#include     <stdio.h>      
#include     <stdlib.h>     
#include     <unistd.h>     
#include     <sys/types.h>  
#include     <sys/stat.h>   
#include     <fcntl.h> 
#include     <string.h>
#include     <sys/ioctl.h>
#include     <net/if.h>
#include     <sys/socket.h>
//#include      <arpa/inet.h> 
#include "ndis_qmi_service.h"

#define CUR_VERSION  "lc.v.0001"
#define ETHER_NAME_LEN 16
//#define PC_DEBUG
#define WAN_NDIS_NET_NAME "wan0"
#define LC_NDIS_MAGIC      0x05615323

#define NDIS_CMD_CONNECT_CMD       0xA0
#define NDIS_CMD_DISCONN_CMD       0xA1
#define NDIS_CMD_GET_VERSION       0xA2
#define NDIS_CMD_GET_STATUS        0xA3
#define NDIS_CMD_INIT_STATUS       0xA4
#define NDIS_CMD_GO_ACTIVE         0xA5
#define NDIS_CMD_GET_CLIENTID      0xA6
#define NDIS_CMD_EXIT_PROCESS      0xA7
	

typedef struct __ndis_info_t{
int             ndis_magic;
int             ndis_sock;
struct ifreq    ndis_ifr;
int             current_status;
char            g_ether_name[ETHER_NAME_LEN];
unsigned char   g_mac_addr[6];
} ndis_info_t;

enum 
{
    LC_DISCONNECTED			= 0,   //disconneted
    LC_CONNECTING,                 //connecting
    LC_GETTING_IP,                 //connecting
    LC_IP_GETTED,                  //connected
    LC_CONNECTED = LC_IP_GETTED,   //connected
    LC_DISCONNECTING,              //connected
};


#define WWAN_STRING_LEN  64
typedef struct
{
    char AccessString[WWAN_STRING_LEN];   
	char UserName[WWAN_STRING_LEN];
	char Password[WWAN_STRING_LEN];
	int Commpression;
	int IpFamily;
} WWAN_CONNECT_PARAMS;

typedef struct __ndis_command_t{
int            cmd;
unsigned char  data[WWAN_STRING_LEN*3+sizeof(unsigned int)];
} ndis_command_t;

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
 *         Name:  ndis_get_lib_version
 *  Description:  return the ndis qmi dail lib version
 *        Input:  ndis_fd:the ndis net operate file handle
 *       Output:  version:the lib version returned.
 *       Return:  -1 : call faled.
 *                0  : call success.
 *        Notes:  
 ********************************************************************/
int ndis_get_lib_version(int ndis_fd, char* version, int i32len)
{
	ndis_info_t* p_ndis_info = (ndis_info_t*)ndis_fd;
	ndis_command_t  ndis_cmd={0};
	
	if(LC_NDIS_MAGIC != p_ndis_info->ndis_magic)
	{
		cprintf("%s:invalide ndis_fd.\n",__func__);
		return INVALID_DEV_HANDLE;
	}	
	
	ndis_cmd.cmd = NDIS_CMD_GET_VERSION;
	p_ndis_info->ndis_ifr.ifr_data = (void*)&ndis_cmd;
	if(ioctl(p_ndis_info->ndis_sock,SIOCDEVPRIVATE,&(p_ndis_info->ndis_ifr))<0)
	{
		cprintf("%s:send ioctl command:%x failed.\n",__func__,ndis_cmd.cmd);
		return COMMUNICATE_DEV_FAIL;
	}
	
	cprintf("%s:get version=%s\n",__func__,(char*)(p_ndis_info->ndis_ifr.ifr_data));
	strcpy(version,(char*)(p_ndis_info->ndis_ifr.ifr_data));
	//strcpy(version,CUR_VERSION);
	return 0;
}
/********************************************************************
 *
 *         Name:  ndis_qmi_connect
 *  Description:  connect to internet thought ndis net
 *        Input:  ndis_fd:the ndis net operate file handle
 * 				  apn      : apn name.
 *                username : user name 
 *  			  passwd   : password
 *	    		  auth     : auth type: 1----PAP;2----CHAP;3----PAP and CHAP
 *                           default: 0
 *       Output:  null
 *       Return:  >0 :  qmi error code-----dail failed.
 *                0  :  call success.
 *                <0 :  error code
 *        Notes:  
 ********************************************************************/
int ndis_qmi_connect(int ndis_fd, char *apn, char *username, char *passwd, int auth, int ip_family)
{
	ndis_info_t* p_ndis_info = (ndis_info_t*)ndis_fd;
	WWAN_CONNECT_PARAMS conn_parm;
	ndis_command_t  ndis_cmd={0};
	int   conn_err_number = 0;

	cprintf("Enter %s %d\n",__FUNCTION__,__LINE__);
	if(LC_NDIS_MAGIC != p_ndis_info->ndis_magic)
	{
		cprintf("%s:invalide ndis_fd.\n",__func__);
		return INVALID_DEV_HANDLE;
	}

	if(LC_CONNECTING <= p_ndis_info->current_status && LC_IP_GETTED >= p_ndis_info->current_status)
	{
		cprintf("%s:can not redail again,current_status=%d.\n",__func__,p_ndis_info->current_status);
		return DEVICE_STATUS_ERR;
	}	
	
	memset((void*)&conn_parm,0,sizeof(conn_parm));
	if(apn != NULL)
		strcpy(conn_parm.AccessString,apn);
	if(username != NULL)
		strcpy(conn_parm.UserName,username);
	if(passwd != NULL)
		strcpy(conn_parm.Password,passwd);
	conn_parm.Commpression = auth;

	conn_parm.IpFamily = ip_family;

	//p_ndis_info->ndis_ifr.ifr_data = (void*)&conn_parm;	
	
	ndis_cmd.cmd = NDIS_CMD_CONNECT_CMD;
	memcpy(ndis_cmd.data,&conn_parm,sizeof(conn_parm));
	
	p_ndis_info->ndis_ifr.ifr_data = (void*)&ndis_cmd;
	
	if(ioctl(p_ndis_info->ndis_sock,SIOCDEVPRIVATE,&(p_ndis_info->ndis_ifr))<0)
	{
		cprintf("%s:send ioctl command:%x failed.\n",__func__,ndis_cmd.cmd);
		return COMMUNICATE_DEV_FAIL;
	}
	conn_err_number = *(unsigned short*)(p_ndis_info->ndis_ifr.ifr_data);
//	usleep(300);
	if(0!=conn_err_number)
	{
		cprintf("%s:connect to net failed,qmi error number is:%d.\n",__func__,conn_err_number);	
		return conn_err_number;
	}
	
	return 0;
}
/********************************************************************
 *
 *         Name:  ndis_connect
 *  Description:  connect to internet thought ndis net
 *        Input:  ndis_fd:the ndis net operate file handle
 * 				  apn      : apn name.
 *                username : user name 
 *  			  passwd   : password
 *	    		  auth     : auth type: 1----PAP;2----CHAP;3----PAP and CHAP
 *                           default: 0
 *                ip_family: ipv4==4/ipv6==6
 *       Output:  null
 *       Return:  >0 :  qmi error code-----dail failed.
 *                0  :  call success.
 *                <0 :  error code
 *        Notes:  
 ********************************************************************/
int ndis_connect(int ndis_fd, char *apn, char *username, char *passwd, int auth, int ip_family)
{
    int conn_err_number;
	ndis_info_t* p_ndis_info = (ndis_info_t*)ndis_fd;
    
	cprintf("Enter %s %d\n",__FUNCTION__,__LINE__);	

    conn_err_number = ndis_qmi_connect(ndis_fd, apn, username, passwd, auth, ip_family);
	usleep(200);
	if(9==conn_err_number)
	{
		cprintf("%s:connect to net failed,release and get client ID:%d.\n",__func__,conn_err_number);	
		ndis_exit(ndis_fd);
		ndis_re_open(ndis_fd);
		return conn_err_number;
	}
	
	return conn_err_number;
}
/********************************************************************
 *
 *         Name:  ndis_disconnect
 *  Description:  disconnect from internet thought ndis net
 *        Input:  null
 *       Output:  null
 *       Return:  -1 : call faled.
 *                0  : call success.
 *        Notes:  
 ********************************************************************/
int ndis_disconnect(int ndis_fd)
{
	ndis_info_t* p_ndis_info = (ndis_info_t*)ndis_fd;
	ndis_command_t  ndis_cmd={0};
	int i = 0;
	
	cprintf("Enter %s %d\n",__FUNCTION__,__LINE__);
	if(LC_NDIS_MAGIC != p_ndis_info->ndis_magic)
	{
		cprintf("%s:invalide ndis_fd.\n",__func__);
		return INVALID_DEV_HANDLE;
	}
	
	ndis_cmd.cmd = NDIS_CMD_DISCONN_CMD;
	
	p_ndis_info->ndis_ifr.ifr_data = (void*)&ndis_cmd;

	if(LC_DISCONNECTED == p_ndis_info->current_status || LC_DISCONNECTING == p_ndis_info->current_status)
	{
		cprintf("%s:can not disconnect again,current_status=%d.\n",__func__,p_ndis_info->current_status);
		return DEVICE_STATUS_ERR;
	}	
	
	if(ioctl(p_ndis_info->ndis_sock,SIOCDEVPRIVATE,&(p_ndis_info->ndis_ifr))<0)	
	{
		cprintf("%s:send ioctl command:%x failed.\n",__func__,ndis_cmd.cmd);
		return COMMUNICATE_DEV_FAIL;
	}
	
	{
		ndis_ipinfo m_info;
		usleep(200);
		ndis_get_status(ndis_fd,&m_info);
	}
	return 0;	
}
/********************************************************************
 *
 *         Name:  ndis_go_active
 *  Description:  release client ID 
 *        Input:  null
 *       Output:  null
 *       Return:  -1 : call faled.
 *                0  : call success.
 *        Notes:  
 ********************************************************************/
int ndis_go_active(int ndis_fd)
{
	ndis_info_t* p_ndis_info = (ndis_info_t*)ndis_fd;
	ndis_command_t  ndis_cmd={0};
	
	cprintf("Enter %s %d\n",__FUNCTION__,__LINE__);
	if(LC_NDIS_MAGIC != p_ndis_info->ndis_magic)
	{
		cprintf("%s:invalide ndis_fd.\n",__func__);
		return INVALID_DEV_HANDLE;
	}
	
	ndis_cmd.cmd = NDIS_CMD_GO_ACTIVE;
	
	p_ndis_info->ndis_ifr.ifr_data = (void*)&ndis_cmd;
	
	if(ioctl(p_ndis_info->ndis_sock,SIOCDEVPRIVATE,&(p_ndis_info->ndis_ifr))<0)	
	{
		cprintf("%s:send ioctl command:%x failed.\n",__func__,ndis_cmd.cmd);
		return COMMUNICATE_DEV_FAIL;
	}
	
	return 0;	
}
/********************************************************************
 *
 *         Name:  ndis_get_clientID
 *  Description:  get client ID 
 *        Input:  null
 *       Output:  null
 *       Return:  -1 : call faled.
 *                0  : call success.
 *        Notes:  
 ********************************************************************/
int ndis_get_clientID(int ndis_fd)
{
	ndis_info_t* p_ndis_info = (ndis_info_t*)ndis_fd;
	ndis_command_t  ndis_cmd={0};
	
	cprintf("Enter %s %d\n",__FUNCTION__,__LINE__);
	if(LC_NDIS_MAGIC != p_ndis_info->ndis_magic)
	{
		cprintf("%s:invalide ndis_fd.\n",__func__);
		return INVALID_DEV_HANDLE;
	}
	
	ndis_cmd.cmd = NDIS_CMD_GET_CLIENTID;
	
	p_ndis_info->ndis_ifr.ifr_data = (void*)&ndis_cmd;
	
	if(ioctl(p_ndis_info->ndis_sock,SIOCDEVPRIVATE,&(p_ndis_info->ndis_ifr))<0)	
	{
		cprintf("%s:send ioctl command:%x failed.\n",__func__,ndis_cmd.cmd);
		return COMMUNICATE_DEV_FAIL;
	}
	
	return 0;	
}
/********************************************************************
 *
 *         Name:  ndis_get_status
 *  Description:  get the ndis dail status
 *        Input:  ndis_fd:the ndis net operate file handle
 *       Output:  null
 *       Return:  -1 : call faled.
 *                CONNECTING         0X001;
 *                CONNECTED          0X002;
 *                DISCONNECTED       0X004;.
 *        Notes:  
 ********************************************************************/
int ndis_get_status(int ndis_fd,ndis_ipinfo *pipinfo)
{
	ndis_info_t* p_ndis_info = (ndis_info_t*)ndis_fd;
	ndis_ipinfo  l_ndis_status={0};
//	int   conn_err_number = 0;
	ndis_command_t  ndis_cmd={0};
	
	if(LC_NDIS_MAGIC != p_ndis_info->ndis_magic)
	{
		cprintf("%s:invalide ndis_fd.\n",__func__);
		return INVALID_DEV_HANDLE;
	}

	ndis_cmd.cmd = NDIS_CMD_GET_STATUS;
	
	p_ndis_info->ndis_ifr.ifr_data = (void*)&ndis_cmd;
	if(ioctl(p_ndis_info->ndis_sock,SIOCDEVPRIVATE,&(p_ndis_info->ndis_ifr))<0)
	{
		cprintf("%s:send ioctl command:%x failed.\n",__func__,ndis_cmd.cmd);
		return COMMUNICATE_DEV_FAIL;
	}
	
	memcpy(&l_ndis_status,(void*)p_ndis_info->ndis_ifr.ifr_data,sizeof(l_ndis_status));
	p_ndis_info->current_status = l_ndis_status.i32status;
	
	//strcpy(pipinfo->wan_ip,inet_ntoa(l_ndis_status.ip_address));
	
	//cprintf("%s:current status:%d,ip address is %u.\n",__func__,l_ndis_status.connection_status,l_ndis_status.ip_address);	
	memcpy(pipinfo,&l_ndis_status,sizeof(ndis_ipinfo));
	
	if((l_ndis_status.i32status == LC_CONNECTING) || (l_ndis_status.i32status == LC_GETTING_IP))
	{
		pipinfo->i32status = NDIS_CONNECTING;
	}else
	if((l_ndis_status.i32status == LC_IP_GETTED) && (l_ndis_status.i32status < LC_DISCONNECTING))
	{
		pipinfo->i32status = NDIS_CONNECTED;
	}else
	{
		pipinfo->i32status = NDIS_DISCONNECTED;
	}

	return 0;
}
/********************************************************************
 *
 *         Name:  ndis_open
 *  Description:  open ndis dail port.
 *        Input:  null
 *       Output:  null
 *       Return:  -1 : call faled.
 *                >0 : ndis net dev handle.
 *        Notes:  
 ********************************************************************/
int ndis_open()
{
//	int i = 0;
	ndis_command_t  ndis_cmd={0};
	ndis_info_t* p_ndis_info = (ndis_info_t*)malloc(sizeof(ndis_info_t));
	if(!p_ndis_info)
	{
		cprintf("malloc memory failed.\n");
		return -1;
	}
	memset(p_ndis_info,0,sizeof(p_ndis_info));
	p_ndis_info->ndis_sock = socket(AF_INET,SOCK_DGRAM,0);
	p_ndis_info->ndis_magic = LC_NDIS_MAGIC;
	p_ndis_info->current_status = LC_DISCONNECTED;
	if(-1 == p_ndis_info->ndis_sock)
	{
		cprintf("get the socket descriptor failed\n");
		p_ndis_info->ndis_magic = 0;
		free(p_ndis_info);
		return -1;
	}
	strcpy(p_ndis_info->g_ether_name,WAN_NDIS_NET_NAME);
	strcpy(p_ndis_info->ndis_ifr.ifr_name,WAN_NDIS_NET_NAME);
	cprintf("ifr.ifr_name = %s\n",p_ndis_info->ndis_ifr.ifr_name);
#if 1
	ndis_cmd.cmd =  NDIS_CMD_INIT_STATUS;
	p_ndis_info->ndis_ifr.ifr_data = (void*)&ndis_cmd;
	
	if(ioctl(p_ndis_info->ndis_sock,SIOCDEVPRIVATE,&(p_ndis_info->ndis_ifr))<0)
	{
		cprintf("%s:send ioctl command:%x failed.\n",__func__,ndis_cmd.cmd);
		p_ndis_info->ndis_magic = 0;
		free(p_ndis_info);
		return -1;
	}
#endif
	cprintf("ndis open exit.\n");
	//memcpy(p_ndis_info->g_mac_addr,p_ndis_info->ndis_ifr.ifr_data,sizeof(p_ndis_info->g_mac_addr));
	
	return (int)p_ndis_info;
}
/********************************************************************
 *
 *         Name:  ndis_close
 *  Description:  ndis dail close
 *        Input:  ndis_fd:the ndis net operate file handle
 *       Output:  null
 *       Return:  -1 : call faled.
 *                0  : call success.
 *        Notes:  
 ********************************************************************/
int ndis_close(int ndis_fd)
{
	ndis_info_t* p_ndis_info = (ndis_info_t*)ndis_fd;
	cprintf("Enter %s %d\n",__FUNCTION__,__LINE__);
	if(LC_NDIS_MAGIC == p_ndis_info->ndis_magic)
	{
		close(p_ndis_info->ndis_sock);
		p_ndis_info->ndis_magic = 0;
		free(p_ndis_info);
		return 0;
	}else
	{
		cprintf("invalide ndis_fd.\n");
		return -1;
	}
}
/********************************************************************
 *
 *         Name:  ndis_exit
 *  Description:  ndis dail close
 *        Input:  ndis_fd:the ndis net operate file handle
 *       Output:  null
 *       Return:  -1 : call faled.
 *                0  : call success.
 *        Notes:  
 ********************************************************************/
int ndis_exit(int ndis_fd)
{
	ndis_info_t* p_ndis_info = (ndis_info_t*)ndis_fd;
	ndis_command_t  ndis_cmd={0};
	
	cprintf("Enter %s %d\n",__FUNCTION__,__LINE__);
	if(LC_NDIS_MAGIC != p_ndis_info->ndis_magic)
	{
		cprintf("%s:invalide ndis_fd.\n",__func__);
		return INVALID_DEV_HANDLE;
	}
	
	ndis_cmd.cmd = NDIS_CMD_EXIT_PROCESS;
	
	p_ndis_info->ndis_ifr.ifr_data = (void*)&ndis_cmd;
	
	if(ioctl(p_ndis_info->ndis_sock,SIOCDEVPRIVATE,&(p_ndis_info->ndis_ifr))<0)	
	{
		cprintf("%s:send ioctl command:%x failed.\n",__func__,ndis_cmd.cmd);
		return COMMUNICATE_DEV_FAIL;
	}
	return 0;
}
/********************************************************************
 *
 *         Name:  ndis_re_open
 *  Description:  open ndis dail port.
 *        Input:  null
 *       Output:  null
 *       Return:  -1 : call faled.
 *                >0 : ndis net dev handle.
 *        Notes:  
 ********************************************************************/
int ndis_re_open(int ndis_fd)
{
//	int i = 0;
	ndis_command_t  ndis_cmd={0};
	ndis_info_t* p_ndis_info = (ndis_info_t*)ndis_fd;

	cprintf("Enter %s %d\n",__FUNCTION__,__LINE__);

	ndis_cmd.cmd =  NDIS_CMD_INIT_STATUS;
	p_ndis_info->ndis_ifr.ifr_data = (void*)&ndis_cmd;
	
	if(ioctl(p_ndis_info->ndis_sock,SIOCDEVPRIVATE,&(p_ndis_info->ndis_ifr))<0)
	{
		cprintf("%s:send ioctl command:%x failed.\n",__func__,ndis_cmd.cmd);
		p_ndis_info->ndis_magic = 0;
		free(p_ndis_info);
		return -1;
	}

	cprintf("ndis ndis_re_open exit.\n");
	//memcpy(p_ndis_info->g_mac_addr,p_ndis_info->ndis_ifr.ifr_data,sizeof(p_ndis_info->g_mac_addr));
	
	return 0;
}

