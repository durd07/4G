#include     <stdio.h>      
#include     <stdlib.h>     
#include     <unistd.h>     
#include     <sys/types.h>  
#include     <sys/stat.h>   
#include     <fcntl.h>  
#include     <sys/ioctl.h>
#include     <net/if.h>
#include     <sys/socket.h>

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
int main()
{
	char version[64] = {0};
	int ret = -1;
	int option = -1;
	ndis_ipinfo pipinfo;
	int fd = ndis_open();
	if(fd == -1)
	{
		cprintf("ndis_open failed.\n");
		return -1;
	}
	ret = ndis_get_status(fd,&pipinfo);	

	if(ret<0)
	{
		cprintf("init failed.\n");
		ndis_close(fd);
		return -1;
	}
	cprintf("ndis dail test! \n");
	
	while(1)
	{
		cprintf(" 1........get lib version.\n");
		cprintf(" 2........connect to internet(if qmi error number==9 release and re get client ID.\n");
		cprintf(" 3........disconnect to internet.\n");
		cprintf(" 4........get current status.\n");
		cprintf(" 5........ndis_go_active.\n");
		cprintf(" 6........get client ID.\n");
		cprintf(" 7........ndis qmi connect(if qmi error number==9 do not process).\n");
		cprintf("-1........exit.\n");
		
		scanf("%d",&option);
		switch(option)
		{
			case 1:
			{
				ret = ndis_get_lib_version(fd,version,sizeof(version));
				if(ret!=0)
				{
					cprintf("ndis_get_lib_version failed,ret=%d.\n",ret);					
				}else
				{
					cprintf("ndis_get_lib_version success:version=%s.\n",version);
				}
				break;
			}
			case 2:
			{
				char apn[128] = "UNINET";
				char usrname[128] = "";
				char pwd[128] = "";
				char authtype[10] = "0";
				char ipfamily[10] = "4";
				FILE* m_fd = fopen("/usr/sbin/profile.ini","r");
				if(m_fd)
				{
					fclose(m_fd);
					read_ini_config("/usr/sbin/profile.ini","profile","apn",apn);
					read_ini_config("/usr/sbin/profile.ini","profile","usrname",usrname);
					read_ini_config("/usr/sbin/profile.ini","profile","pwd",pwd);
					read_ini_config("/usr/sbin/profile.ini","profile","auth",authtype);								
					read_ini_config("/usr/sbin/profile.ini","profile","ipfamily",ipfamily);	
				}
				cprintf("connection use apn:%s,usrname:%s,pwd:%s,auth:%s,ipfamily:%s.\n",apn,usrname,pwd,authtype,ipfamily);					
				ret = ndis_connect(fd,apn,usrname,pwd, atoi(authtype),atoi(ipfamily));			
				if(ret!=0)
				{
					cprintf("ndis_connect failed,ret=%d.\n",ret);					
				}else
				{
					cprintf("ndis_connect success.\n");
				}
				break;
			}
			case 3:
			{
				ret = ndis_disconnect(fd);
				if(ret!=0)
				{
					cprintf("ndis_disconnect failed,ret=%d.\n",ret);					
				}else
				{
					cprintf("ndis_disconnect success.\n");
				}
				break;
			}
			case 4:
			{
				ret = ndis_get_status(fd,&pipinfo);
				if(ret!=0)
				{
					cprintf("ndis_get_status failed,ret=%d.\n",ret);					
				}else
				{
					cprintf("ndis_get_status success.\n");
				}
				break;
			}
			case 5:
			{
				ret = ndis_go_active(fd);
				if(ret!=0)
				{
					cprintf("ndis_go_active failed,ret=%d.\n",ret);					
				}else
				{
					cprintf("ndis_go_active success.\n");
				}
				break;
			}
			case 6:
			{
				ret = ndis_get_clientID(fd);
				if(ret!=0)
				{
					cprintf("ndis_get_clientID failed,ret=%d.\n",ret);					
				}else
				{
					cprintf("ndis_get_clientID success.\n");
				}
				break;
			}
			case 7:
			{
				char apn[64] = "UNINET";
				char usrname[64] = "";
				char pwd[64] = "";
				char authtype[10] = "0";
				char ipfamily[10] = "4";
				FILE* m_fd = fopen("/usr/sbin/profile.ini","r");
				if(m_fd)
				{
					fclose(m_fd);
					read_ini_config("/usr/sbin/profile.ini","profile","apn",apn);
					read_ini_config("/usr/sbin/profile.ini","profile","usrname",usrname);
					read_ini_config("/usr/sbin/profile.ini","profile","pwd",pwd);
					read_ini_config("/usr/sbin/profile.ini","profile","auth",authtype);								
					read_ini_config("/usr/sbin/profile.ini","profile","ipfamily",ipfamily);					
				}
				cprintf("connection use apn:%s,usrname:%s,pwd:%s,auth:%s,ipfamily:%s.\n",apn,usrname,pwd,authtype,ipfamily);	

				ret = ndis_qmi_connect(fd,apn,usrname,pwd, atoi(authtype),atoi(ipfamily));	
				if(ret!=0)
				{
					cprintf("ndis_qmi_connect failed,ret=%d.\n",ret);					
				}else
				{
					cprintf("ndis_qmi_connect success.\n");
				}
				break;
			}
			case -1:
			{
				ndis_close(fd);
				return 0;
			}
			default: break;
		}
	}	
	
	ndis_close(fd);
	return 0;
}

