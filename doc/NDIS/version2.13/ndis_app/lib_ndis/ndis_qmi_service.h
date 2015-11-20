
#ifndef NDIS_QMI_SERVICE_H
#define NDIS_QMI_SERVICE_H

#define NDIS_IP_LEN_MAX 18

#if 0
typedef struct ndis_ipinfo_t
{
	int  i32status;   //CONNECTING, CONNECTED,DISCONNECTED
    char wan_ip[NDIS_IP_LEN_MAX];//valid when status is CONNECTED
    char gateway[NDIS_IP_LEN_MAX];//valid when status is CONNECTED
    char dns1[NDIS_IP_LEN_MAX];//valid when status is CONNECTED
    char dns2[NDIS_IP_LEN_MAX];//valid when status is CONNECTED
    char mask[NDIS_IP_LEN_MAX];//valid when status is CONNECTED
} ndis_ipinfo;
#endif
#define NDIS_CONNECTING         0X001
#define NDIS_CONNECTED          0X002
#define NDIS_DISCONNECTED       0X004

#define QMI_WDS_IPV6_ADDR_SIZE_IN_BYTES 16
#define QMI_WDS_MAX_P_CSCF_IPV4_ADDRS   6
#define QMI_WDS_MAX_P_CSCF_IPV6_ADDRS   6
#define QMI_WDS_MAX_MCAST_ADDRS         25
#define QMI_WDS_MAX_MCAST_HNDLS         10
#define QMI_WDS_IPV6_ADDR_SIZE_IN_BYTES 16
#define QMI_WDS_IPV4_ADDR_SIZE_IN_BYTES 4
#define QMI_WDS_MAX_ERR_CODES_IN_RSP    10 
#define QMI_WDS_MAX_FQDN_STRINGS       QMI_WDS_MAX_P_CSCF_IPV4_ADDRS
#define QMI_WDS_MAX_DOMAIN_NAMES       QMI_WDS_MAX_P_CSCF_IPV4_ADDRS
#define QMI_WDS_MAX_PROFILE_STR_SIZE  (32)
#define QMI_WDS_MAX_APN_STR_SIZE              (100 + 1) // Max APN size should be 100

/* Additional TLV's for QMI_WDS_GET_RUNTIME_SETTINGS */
#define QMI_WDS_CURR_CALL_PROFILE_ID_TLV_ID                 0x1F
#define QMI_WDS_CURR_CALL_IPV4_GATEWAY_ADDR_TLV_ID          0x20
#define QMI_WDS_CURR_CALL_IPV4_SUBNET_MASK_TLV_ID           0x21
#define QMI_WDS_CURR_CALL_PCSCF_ADDR_PCO_TLV_ID             0x22
#define QMI_WDS_CURR_CALL_PCSCF_SERVER_ADDR_LIST_TLV_ID     0x23
#define QMI_WDS_CURR_CALL_PCSCF_FQDN_LIST_TLV_ID            0x24
#define QMI_WDS_CURR_CALL_IPV6_ADDR_TLV_ID                  0x25
#define QMI_WDS_CURR_CALL_IPV6_GATEWAY_ADDR_TLV_ID          0x26
#define QMI_WDS_CURR_CALL_PRIMARY_DNS_IPV6_ADDR_TLV_ID      0x27
#define QMI_WDS_CURR_CALL_SECONDARY_DNS_IPV6_ADDR_TLV_ID    0x28
#define QMI_WDS_CURR_CALL_MTU_TLV_ID                        0x29
#define QMI_WDS_CURR_DOMAIN_NAME_LIST_TLV_ID                0x2A
#define QMI_WDS_CURR_IP_FAMILY_TLV_ID                       0x2B
#define QMI_WDS_CURR_IM_CN_FLAG_TLV_ID                      0x2C
#define QMI_WDS_CURR_TECHNOLOGY_TLV_ID                      0x2D
#define QMI_WDS_CURR_CALL_PCSCF_IPV6_SERVER_ADDR_LIST_TLV_ID   0x2E
#define QMI_WDS_CURR_CALL_IPV4_ADDR_TLV_ID                  QMI_WDS_UMTS_PROFILE_IPV4_ADDR_PREF_TLV_ID
#define QMI_WDS_CURR_CALL_PRIMARY_DNS_IPV4_ADDR_TLV_ID      QMI_WDS_UMTS_PROFILE_PRIM_DNS_TLV_ID
#define QMI_WDS_CURR_CALL_SECONDARY_DNS_IPV4_ADDR_TLV_ID    QMI_WDS_UMTS_PROFILE_SEC_DNS_TLV_ID

/************************************************************************
* Definitions associated with QMI_WDS_GET_SESSION_SETTINGS
************************************************************************/
#define QMI_WDS_CURR_CALL_INFO_IPV4_GATEWAY_ADDR       0x00000001 /* gateway address         */
#define QMI_WDS_CURR_CALL_INFO_SUBNET_MASK             0x00000002 /* subnet mask             */
#define QMI_WDS_CURR_CALL_INFO_PCSCF_ADDR_USNG_PCO     0x00000004
#define QMI_WDS_CURR_CALL_INFO_PCSCF_IPV4_ADDR_LIST    0x00000008
#define QMI_WDS_CURR_CALL_INFO_PCSCF_FQDN_LIST         0x00000010
#define QMI_WDS_CURR_CALL_INFO_IPV6_ADDR               0x00000020
#define QMI_WDS_CURR_CALL_INFO_IPV6_GTWY_ADDR          0x00000040
#define QMI_WDS_CURR_CALL_INFO_PRIMARY_DNS_IPV6_ADDR   0x00000080
#define QMI_WDS_CURR_CALL_INFO_MTU                     0x00000100
#define QMI_WDS_CURR_CALL_INFO_DOMAIN_NAME_LIST        0x00000200
#define QMI_WDS_CURR_CALL_INFO_IP_FAMILY               0x00000400
#define QMI_WDS_CURR_CALL_INFO_IM_CN_FLAG              0x00000800
#define QMI_WDS_CURR_CALL_INFO_TECHNOLOGY              0x00001000
#define QMI_WDS_CURR_CALL_INFO_IPV4_ADDR               0x00002000
#define QMI_WDS_CURR_CALL_INFO_PRIMARY_DNS_IPV4_ADDR   0x00004000
#define QMI_WDS_CURR_CALL_INFO_SECONDARY_DNS_IPV4_ADDR 0x00008000
#define QMI_WDS_CURR_CALL_INFO_SECONDARY_DNS_IPV6_ADDR 0x00010000
#define QMI_WDS_CURR_CALL_INFO_PCSCF_IPV6_ADDR_LIST    0x00020000

typedef unsigned long ipv4_addr_type;
typedef unsigned char ipv6_addr_type[QMI_WDS_IPV6_ADDR_SIZE_IN_BYTES];

typedef enum
{
  QMI_WDS_IPV4_TYPE = 0x04,
  QMI_WDS_IPV6_TYPE = 0x06,
  QMI_WDS_UNSPEC_TYPE = 0x08
} qmi_wds_ip_family;

typedef struct
{
  int                         fqdn_length;
  unsigned char               fqdn_string[QMI_WDS_MAX_PROFILE_STR_SIZE];
} qmi_wds_fqdn_strings;

typedef struct
{
  int                  domain_name_len;
  unsigned char        domain_name[QMI_WDS_MAX_PROFILE_STR_SIZE];
} qmi_wds_domain_names;
typedef struct{
	ipv6_addr_type  ipv6_addr;
	int             ipv6_prefix_len;
} qmi_ipv6_addr_type;

/* this maps with ps iface name */
typedef enum
{
  QMI_WDS_IFACE_NAME_CDMA             = 0x8001,
  QMI_WDS_IFACE_NAME_UTMS             = 0x8004,/* typo of name */
  /* correct name, keep it backward compatible */
  QMI_WDS_IFACE_NAME_UMTS             = QMI_WDS_IFACE_NAME_UTMS,
  QMI_WDS_IFACE_NAME_EMBMS            = 0x8882,
  QMI_WDS_IFACE_NAME_MODEM_LINK_LOCAL = 0x8888,
  QMI_WDS_IFACE_NAME_NOT_REPORTED     = 0xFFFF
} qmi_wds_iface_name_type;

typedef enum
{
  CN_FLAG_TRUE  = 0x01,
  CN_FLAG_FALSE = 0x00
} qmi_wds_cn_flag_true_false;

/* Run-time settings information */
typedef struct
{

  /* bit mask which indicates which of the below fields
  ** contain valid values.  Use above QMI_WDS_CALL_SETTINGS mask values
  */
  unsigned long                 mask;

  /* All values are optional, and their validity
  ** is indicated by set bit in param_mask
  */
  ipv4_addr_type                 ipv4_addr;
  ipv4_addr_type                 primary_dns_ipv4_addr;
  ipv4_addr_type                 secondary_dns_ipv4_addr;
  ipv4_addr_type                 ipv4_gateway_addr;
  ipv4_addr_type                 ipv4_subnet_mask;
  unsigned char                  p_cscf_addr_using_pco;

  struct
  {
    unsigned char num_instances;
    ipv4_addr_type p_cscf_ipv4_addr[QMI_WDS_MAX_P_CSCF_IPV4_ADDRS];
  }p_cscf_ipv4_addrs;

  struct
  {
    unsigned char num_instances;
    ipv6_addr_type p_cscf_ipv6_addr[QMI_WDS_MAX_P_CSCF_IPV6_ADDRS];
  }p_cscf_ipv6_addrs;

  struct
  {
    unsigned char num_instances;
    qmi_wds_fqdn_strings   fqdn_strings[QMI_WDS_MAX_FQDN_STRINGS];
  }fqdn_list;

  qmi_ipv6_addr_type               ipv6_addr_info;
  qmi_ipv6_addr_type               ipv6_gateway_addr_info;
  ipv6_addr_type                   primary_dns_ipv6_addr;
  ipv6_addr_type                   secondary_dns_ipv6_addr;
  unsigned long                    mtu;

  struct
  {
    unsigned char num_instances;
    qmi_wds_domain_names domain_names[QMI_WDS_MAX_DOMAIN_NAMES];
  }domain_name_list;

  qmi_wds_ip_family               ip_family;
  qmi_wds_cn_flag_true_false      im_cn_flag;
  qmi_wds_iface_name_type         curr_technology;
} qmi_wds_curr_call_info_type;

typedef struct{
  ipv4_addr_type                 ipv4_addr;
  ipv4_addr_type                 primary_dns_ipv4_addr;
  ipv4_addr_type                 secondary_dns_ipv4_addr;
  ipv4_addr_type                 ipv4_gateway_addr;
  ipv4_addr_type                 ipv4_subnet_mask;	
  
  qmi_ipv6_addr_type               ipv6_addr_info;
  qmi_ipv6_addr_type               ipv6_gateway_addr_info;
  ipv6_addr_type                   primary_dns_ipv6_addr;
  ipv6_addr_type                   secondary_dns_ipv6_addr;
  unsigned long                    mtu;
  qmi_wds_ip_family               ip_family;
} qmi_ip_info_t;

typedef struct ndis_ipinfo_t
{
	int  i32status;   //CONNECTING, CONNECTED,DISCONNECTED
    qmi_ip_info_t ip_v4_v6_info;
} ndis_ipinfo;


#define INVALID_DEV_HANDLE      0XFFFFFFFF
#define COMMUNICATE_DEV_FAIL    0XFFFFFFFE
#define CONNECTION_TIME_OUT     0XFFFFFFFD
#define FAILED_GET_IPADDR       0XFFFFFFFC
//#define QMI_DAIL_FAILED         0XFF00FF00  // 
#define DEVICE_STATUS_ERR       0XFFFFFFFB
//#define   
/********************************************************************
 *
 *         Name:  ndis_get_lib_version
 *  Description:  return the ndis qmi dail lib version
 *        Input:  ndis_fd:the ndis net operate file handle
 *                i32len :the version char buffer size;
 *       Output:  version:(64 length)the lib version returned.
 *       Return:  other : error code.
 *                0  : call success.
 *        Notes:  
 ********************************************************************/
int ndis_get_lib_version(int ndis_fd, char* version, int i32len);
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
int ndis_connect(int ndis_fd, char *apn, char *username, char *passwd, int auth,int ip_family);			
/********************************************************************
 *
 *         Name:  ndis_disconnect
 *  Description:  disconnect from internet thought ndis net
 *  			  if qmi error num==9 invalid qmi handle,do not process it.
 *        Input:  ndis_fd:the ndis net operate file handle
 *       Output:  null
 *       Return:  other : error code.
 *                0  : call success.
 *        Notes:  
 ********************************************************************/
int ndis_disconnect(int ndis_fd);
/********************************************************************
 *
 *         Name:  ndis_get_status
 *  Description:  get the ndis dail status
 *        Input:  ndis_fd:the ndis net operate file handle
 *       Output:  pipinfo:the ipinfo buffer
 *       Return:  other : error code.
 *                0  : call success.
 *        Notes:  
 ********************************************************************/
int ndis_get_status(int ndis_fd, ndis_ipinfo *pipinfo);
/********************************************************************
 *
 *         Name:  ndis_open
 *  Description:  open ndis dail port.
 *        Input:  ndis_fd:the ndis net operate file handle
 *       Output:  null
 *       Return:  -1 : call faled.
 *                >0 : ndis net dev handle.
 *        Notes:  
 ********************************************************************/
int ndis_open();
/********************************************************************
 *
 *         Name:  ndis_close
 *  Description:  ndis dail close
 *        Input:  ndis_fd:the ndis net operate file handle
 *       Output:  null
 *       Return:  other : error code.
 *                0  : call success.
 *        Notes:  
 ********************************************************************/
int ndis_close(int ndis_fd);
/********************************************************************
 *
 *         Name:  ndis_qmi_connect
 *  Description:  connect to internet thought ndis net, 
 *  			  if qmi error num==9 invalid qmi handle,do not process it.
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
int ndis_qmi_connect(int ndis_fd, char *apn, char *username, char *passwd, int auth,int ip_family);
/********************************************************************
 *
 *         Name:  ndis_go_active
 *  Description:  set link active
 *        Input:  null
 *       Output:  null
 *       Return:  -1 : call faled.
 *                0  : call success.
 *        Notes:  
 ********************************************************************/
int ndis_go_active(int ndis_fd);
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
 int ndis_get_clientID(int ndis_fd);
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
int ndis_exit(int ndis_fd);
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
int ndis_re_open(int ndis_fd);
#endif
