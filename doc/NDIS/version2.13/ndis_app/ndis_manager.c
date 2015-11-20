#include     <stdio.h>      
#include     <stdlib.h>     
#include     <unistd.h>     
#include     <sys/types.h>  
#include     <sys/stat.h>   
#include     <fcntl.h>  
#include     <sys/ioctl.h>
#include     <net/if.h>
#include     <sys/socket.h>
#include     <termios.h>
#include     <signal.h>

#include     "ndis_qmi_service.h"

#define PC_DEBUG
#ifdef PC_DEBUG
    #define cprintf  printf
#else
    #define cprintf(fmt, args...) do { \
        FILE *fp = fopen("/dev/console", "w"); \
        if (fp) { \
            fprintf(fp, fmt, ## args); \
            fclose(fp); \
        } \
    } while (0)  
#endif

#define CONNECT_COMMAND    0
#define DISCONNECT_COMMAND 1
#define CONNECT_TIME_OUT  30    //15 seconds
#define DISCONNECT_TIME_OUT  5    //500ms*5

int connect_manager_exit_flag = 0;
int thread_exit_flag = 0;
int keep_alive = 1;
int connection_signal = -1;
int time_out_timer = -1;
pthread_t ndis_status_thread = 0;
ndis_ipinfo pipinfo;

static int disconnect_process(int ndis_fd);
static int connect_process(int ndis_fd);
static void exit_sig_process(int sig);
static void connect_sig_process(int sig);
static void exit_sig_process(int sig);
static void* ndisStatusProcess( void * param);

/********************************************************************
 *
 *         Name:  trim_str
 *  Description:  trim the string with a-z,0-9 A-Z,=,.,/ only
 *        Input:  in_out_str:input string
 *       Output:   in_out_str:trimed string
 *       Return:  0/-1
 *        Notes:  
 ********************************************************************/
static void trim_str(char* in_out_str)
{
    char buff[128]="";
    char* ptr=in_out_str;
    int i=0;
    while(*ptr)
    {    
        if((*ptr>='0'&&*ptr<='9')||(*ptr>='a'&&*ptr<='z')||(*ptr>='A'&&*ptr<='Z')||(*ptr=='_')||(*ptr=='=')||(*ptr=='.')||(*ptr=='/')||(*ptr==','))
            buff[i++]=*ptr;
        ptr++;        
    }
    strcpy(in_out_str,buff);
}

/********************************************************************
 *
 *         Name:  read_ini_config
 *  Description:  read from a ini file the distinct zone distinct 
 *                configure name value
 *        Input:  file_name,ini file name,its example:
 *                ....[conf_zone]
 *                .... conf_name = conf_value
 *       Output:  conf_value
 *       Return:  0/-1
 *        Notes:  
 ********************************************************************/
int read_ini_config(char* file_name,char* conf_zone,char* conf_name, char* conf_value)
{
    FILE* ini_file=fopen(file_name,"r");
    if(ini_file==NULL)
    {
        return -1;
    }
    
    char buff[256];
    int  tag=0;
    while(fgets(buff,sizeof(buff),ini_file))//find zone 
    {
        if(strstr(buff,"[")&&strstr(buff,conf_zone))
        {
            tag=1;
            break;
        }
    }
    if(tag==0)//can not found
    {
        fclose(ini_file);
        return -1;
    }
    while((fgets(buff,sizeof(buff),ini_file)))
    {
        if(strstr(buff,conf_name))
        {
            tag=1;
            break;
        }
    }
    if(tag==0)//can not found
    {
        fclose(ini_file);
        return -1;
    }
    char* ptr = strstr(buff,"=");
    ptr++;
    strcpy(conf_value,ptr);    
    trim_str(conf_value);//remove dirty ascii code
    
    fclose(ini_file);
    return 0;
}

static void exit_sig_process(int sig)
{
	connect_manager_exit_flag = 1;
	return;
}
static void connect_sig_process(int sig)
{
	connection_signal = CONNECT_COMMAND;
	return;
}
static void disconnect_sig_process(int sig)
{
	connection_signal = DISCONNECT_COMMAND;
	return;
}
const char *usage_help = 
"\n\n"
"Usage: connect_managerect ...\n"
"Options:\n"
"   -k keep alive,if disconnect, reconnect automaticly..\n"
"   -d disconnect from nectwok..\n"
"   -c connect to internet, if get disconnect message, disconnect.\n"
"   -h help.\n"
"\n\n";
void print_usage()
{
    cprintf(usage_help);
    return ;
}

static void delay(unsigned int timeout)
{
    struct timespec timev;
    struct timespec timer;
    unsigned int rv;

    timer.tv_sec = timeout / 1000UL;
    timer.tv_nsec = (timeout * 1000000UL) % 1000000000UL;
    
    do
    {
        timev = timer;        /* remaining time */
        rv = nanosleep(&timev, &timer);
        
    } while (rv < 0);
}

static void* ndisStatusProcess( void * param)
{
    int current_status = NDIS_CONNECTED;
    int connecting_timeout = CONNECT_TIME_OUT;
    int disnnecting_timeout = DISCONNECT_TIME_OUT;
    int ret = -1;
    int*  pfd = (int*)param;
    int fd = *pfd;
    
    while(!(connect_manager_exit_flag|thread_exit_flag))
    {       
        ret = ndis_get_status(fd,&pipinfo);
		if(ret!=0)
		{
			cprintf("ndis_get_status failed,ret=%d.\n",ret);					
		}else
		{			
			if(NDIS_CONNECTED == pipinfo.i32status)
			{
				if(current_status == NDIS_CONNECTING)//new connected to internet.
				{
					cprintf("connected to internet success, .\n");
					//system("udhcpc -i wan0 -s /etc/udhcpc.script");//to get ip/dns/gatway
					system("dhclient wan0&");						
				}
				current_status = NDIS_CONNECTED;
			}else if(NDIS_CONNECTING == pipinfo.i32status)
			{
				if(current_status == NDIS_CONNECTED)//disconnected from internet...
				{
					ret = disconnect_process(fd);
					if(ret!=0)
					{
						cprintf("ndis_disconnect failed,ret=%d.\n",ret);	
						return -1;		
					}else
					{
						cprintf("ndis_disconnect success.\n");
					}	
					if(keep_alive==1)
					{
						connection_signal = CONNECT_COMMAND;
					}
					break;
					
				}
			//	if()
				current_status = NDIS_CONNECTING;
			}else if(NDIS_DISCONNECTED == pipinfo.i32status)//has disconnected from internet.
			{
				current_status = NDIS_DISCONNECTED;
				
				current_status = pipinfo.i32status;		
				if(keep_alive==1)
				{
					connection_signal = CONNECT_COMMAND;
				}
				break;	
			}
		}
		usleep(500000);
    }
    
    return (void*)0;
}

static int connect_process(int ndis_fd)
{
	int connecting_timeout = CONNECT_TIME_OUT;
	int ret = -1;
	
	{
		char apn[128] = "UNINET";
		char usrname[128] = "";
		char pwd[128] = "";
		char authtype[10] = "0";
		FILE* m_fd = fopen("/usr/sbin/profile.ini","r");
		if(m_fd)
		{
			fclose(m_fd);
			read_ini_config("/usr/sbin/profile.ini","profile","apn",apn);
			read_ini_config("/usr/sbin/profile.ini","profile","usrname",usrname);
			read_ini_config("/usr/sbin/profile.ini","profile","pwd",pwd);
			read_ini_config("/usr/sbin/profile.ini","profile","auth",authtype);								
		}
		cprintf("connection use apn:%s,usrname:%s,pwd:%s,auth:%s.\n",apn,usrname,pwd,authtype);	
		ret = ndis_connect(ndis_fd,apn,usrname,pwd, atoi(authtype),8);			
		if(ret!=0)
		{
			cprintf("ndis_connect failed,ret=%d.\n",ret);	
			return -1;
		}else
		{
			cprintf("ndis_connect success.\n");
		}
	}
	
	while(connecting_timeout--)
	{
		ret = ndis_get_status(ndis_fd,&pipinfo);
		if(ret!=0)
		{
			cprintf("ndis_get_status failed,ret=%d.\n",ret);					
		}else
		{
			cprintf("ndis_get_status success.\n");
			if(NDIS_CONNECTED==pipinfo.i32status){
			    cprintf("connected to internet success, .\n");
			//	system("udhcpc -i wan0 -s /etc/udhcpc.script");//to get ip/dns/gatway
				system("sudo dhclient wan0&");
				break;
			}
		}
		usleep(500000);
	}

	if(NDIS_CONNECTING==pipinfo.i32status)
	{
		cprintf("connecting to internet time out,disconnect from internet.\n");	
		ret = ndis_disconnect(ndis_fd);
		if(ret!=0)
		{
			cprintf("ndis_disconnect failed,ret=%d.\n",ret);	
            return -1;		
		}else
		{
			cprintf("ndis_disconnect success.\n");
		}	
		ret = ndis_get_status(ndis_fd,&pipinfo);
	}
	
	return 0;
}

static int disconnect_process(int ndis_fd)
{
	int ret = -1;
	int disnnecting_timeout = DISCONNECT_TIME_OUT;
	
	// disconnect to internet	
	{
		ret = ndis_disconnect(ndis_fd);
		if(ret!=0)
		{
			cprintf("ndis_disconnect failed,ret=%d.\n",ret);	
            return -1;		
		}else
		{
			cprintf("ndis_disconnect success.\n");
		}	
		system("ifconfig wan0 down");
		system("ifconfig wan0 up");	
	}
	
	// to release resource.
	while(disnnecting_timeout--)
	{
		ret = ndis_get_status(ndis_fd,&pipinfo);
		if(ret!=0)
		{
			cprintf("ndis_get_status failed,ret=%d.\n",ret);					
		}
		usleep(500000);
	}
	return 0;
}


int main(int argc, char* argv[])
{
	char version[64] = {0};
	int ret = -1;
	int current_status = NDIS_DISCONNECTED;

	int connecting_timeout = CONNECT_TIME_OUT;
	int c = 0;
	int disnnecting_timeout = DISCONNECT_TIME_OUT;
	
	
	signal(SIGTERM, exit_sig_process);
	signal(SIGUSR1, connect_sig_process);
    signal(SIGUSR2, disconnect_sig_process);
    
    
	c = getopt(argc, argv, "hkdc");
	if(c==-1){
		print_usage();
        exit(0);	
	}
	
	while( c != -1 )
    {
        switch(c)
        {
            case 'k':
            keep_alive = 1;
            cprintf("keep alive ==1.\n");
            break;
            
            case 'd':
            connection_signal = DISCONNECT_COMMAND;
            cprintf("connection_signal ==DISCONNECT_COMMAND.\n");
            break;
            
            case 'c':
            connection_signal = CONNECT_COMMAND;
            cprintf("connection_signal ==CONNECT_COMMAND.\n");
            break;
            
            case 'h':
            default:
            print_usage();
            exit(0);	
        } 
        c = getopt(argc, argv, "hkdc");       
    }
	
	int fd = ndis_open();	
	
	if(fd == -1)
	{
		cprintf("ndis_open failed.\n");
		return -1;
	}
	
	//if get version failed, indicated initliaze error.
	ret = ndis_get_lib_version(fd,version,sizeof(version));
	if(ret!=0||strlen(version)<3)
	{
		cprintf("ndis_get_lib_version failed,ret=%d.\n",ret);	
        ndis_close(fd);
		return -1;		
	}else
	{
		cprintf("ndis_get_lib_version success,version=%s.\n",version);		
	}

	cprintf("ndis connect test! \n");	
	
	ret = ndis_get_status(fd,&pipinfo);
	if(ret!=0)
	{
		cprintf("ndis_get_status failed,ret=%d.\n",ret);					
	}
	current_status = pipinfo.i32status;
	
	while(!connect_manager_exit_flag)
	{
	//	cprintf("11111111 \n");			
		
		if(connection_signal==CONNECT_COMMAND)//connect to internet process.
		{
			if(current_status==NDIS_DISCONNECTED)
			{
				connection_signal = -1;// set the signal as processed.				
				thread_exit_flag = 0;
				
				ret = connect_process(fd);			
				if(ret!=0)
				{
					cprintf("connect_managerect failed,ret=%d.\n",ret);	
					goto EXIT_PROGRAM;
				}else
				{
					current_status = NDIS_CONNECTED;
					cprintf("connect_managerect success.\n");
				}
				
				ret = pthread_create (&ndis_status_thread,NULL,ndisStatusProcess, (void*)&fd);
			}else if(current_status==NDIS_CONNECTING)
			{
				thread_exit_flag = 1;
			
				pthread_join(ndisStatusProcess, NULL);
				disconnect_process(fd);
				//current_status = NDIS_CONNECTED;
			}else if(current_status==NDIS_CONNECTED)
			{
				connection_signal = -1;// set the signal as processed.				
				thread_exit_flag = 0;
				ret = pthread_create (&ndis_status_thread,NULL,ndisStatusProcess, (void*)&fd);
			//	cprintf("333333\n");	
			}
		//	cprintf("222222\n");		
			
		}else if(connection_signal==DISCONNECT_COMMAND)//disconnect to internet.
		{			
			connection_signal = -1;// set the signal as processed.
			thread_exit_flag = 1;
			
			pthread_join(ndisStatusProcess, NULL);
			disconnect_process(fd);
		//	current_status = NDIS_CONNECTED;
		}
		
		current_status = pipinfo.i32status;
		sleep(1);		
	}	

EXIT_PROGRAM:	
	ndis_close(fd);
	return 0;
}

