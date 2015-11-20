/*
 * This file is developed based on USBModemECMControl.h
 * which is used by mac NDIS dail 2012.01.05 
 * this file only process the qmi data package,so hope for porting to other system easily.
 * Copyright (C) 2012 by qiaoyongkang (longcheer Ltd.)
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will support Huawei data card devices for Linux networking,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
 */

#ifndef __QMI_HEADER_H__
#define __QMI_HEADER_H__   
#include <linux/ctype.h>

#include "qmi_wds_srvc_i.h"

typedef unsigned short      UInt16;
typedef unsigned char       UInt8;
typedef unsigned int        UInt32;
typedef unsigned long long  UInt64;

#define LDEBUG		0			// for debugging
#define USE_ELG		0			// to Event LoG (via kprintf and Firewire) - LDEBUG must also be set
#define USE_IOL		0			// to IOLog - LDEBUG must also be set
#define	LOG_DATA	0			// logs data to the appropriate log - LDEBUG must also be set
#define DUMPALL		0			// Dumps all the data to the log - LOG_DATA must also be set

#define Sleep_Time	20

#define IP_V6_SUPPORT 1

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
  QMI_WDS_IPV6_TYPE = 0x06
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

enum
{
    kDataIn			= 0,
    kDataOut,
    kDataOther,
    kDataNone
};

	// Reset states

enum
{
    kResetNormal	= 0,
    kResetNeeded,
    kResetDone
};

enum 
{
    LC_DISCONNECTED			= 0,   //disconneted
    LC_CONNECTING,                 //connecting
    LC_GETTING_IP,                 //connecting
    LC_IP_GETTED,                  //connected
    LC_CONNECTED = LC_IP_GETTED,   //connected
    LC_DISCONNECTING,              //connected
};

enum 
{
    IP_FAMLIY_V4			= 4,   //IP V4
    IP_FAMLIY_V6            = 6,   //IP V6
    IP_FAMILY_UNSPEC        = 8,   //unspecified
};

typedef struct _QCQMI_HDR
{
    UInt8  IFType;
	UInt16 Length;
	UInt8  CtlFlags;
	UInt8  QMIType;
	UInt8  ClientId;
}__attribute__((packed)) QCQMI_HDR/*, *PQCQMI_HDR*/;

typedef struct _QCQMI
{
    UInt8  IFType;
	UInt16 Length;
	UInt8  CtlFlags;
	UInt8  QMIType;
	UInt8  ClientId;
	UInt8  SDU;   // point to qcqmux or qcqmictl_msg_hdr
}__attribute__((packed)) QCQMI/*, *QCQMI**/ ;

typedef struct _QCQMUX_HDR
{
    UInt8  CtlFlags;
	UInt16 TransactionId;
}__attribute__((packed)) QCQMUX_HDR/*, *QCQMUX_HDR**/;

typedef struct _QCQMUX
{
    UInt8  CtlFlags;
	UInt16 TransactionId;
	UInt8  Message; // point to QCQMUX_MSG_HDR
}__attribute__((packed)) QCQMUX;

typedef struct _QCQMUX_MSG_HDR
{
    UInt16 Type;
	UInt16 Length;
}__attribute__((packed)) QCQMUX_MSG_HDR, *PQCQMUX_MSG_HDR;

typedef struct _QCQMICTL_MSG_HDR
{
	UInt8 CtlFlag;
	UInt8 TransactionId;
	UInt16 QMICTLType;
	UInt16 Length;
}__attribute__((packed)) QCQMICTL_MSG_HDR;

#define QMUX_BROADCAST_CID 0xFF

enum
{
    QMUX_TYPE_CTL = 0x00,
	QMUX_TYPE_WDS = 0x01,
	QMUX_TYPE_DMS = 0x02,
	QMUX_TYPE_NAS = 0x03,
	QMUX_TYPE_QOS = 0x04,
	QMUX_TYPE_MAX,
	QMUX_TYPE_ALL = 0xFF
};


#define QCQMI_CTL_FLAG_SERVICE 0x80
#define USB_CTL_MSG_TYPE_QMI   0x01

// QMICTL Control Flags
#define QMICTL_CTL_FLAG_CMD 0x00
#define QMICTL_CTL_FLAG_RSP 0x01
#define QMICTL_CTL_FLAG_IND 0x02

#define QMICTL_SET_INSTANCE_ID_REQ  0x0020
#define QMICTL_SET_INSTANCE_ID_RESP 0x0020
#define QMICTL_GET_CLIENT_ID_REQ    0x0022
#define QMICTL_GET_CLIENT_ID_RESP   0x0022
#define QMICTL_RELEASE_CLIENT_ID_REQ 0x0023
#define QMICTL_RELEASE_CLIENT_ID_RESP 0x0023
#define QMICTL_REVOKE_CLIENT_IDIND    0x0024
#define QMICTL_INVALID_CLIENT_ID_IND  0x0025
#define QMICTL_GET_VERSION_REQ        0x0021
#define QMICTL_GET_VERSION_RESP       0x0021
#define QMICTL_SET_DATA_FORMAT_REQ    0x0026
#define QMICTL_SET_DATA_FORMAT_RESP   0x0026



// wds message
#define QMIWDS_START_NETWORK_INTERFACE_REQ  0x0020
#define QMIWDS_START_NETWORK_INTERFACE_RESP 0x0020
#define QMIWDS_STOP_NETWORK_INTERFACE_REQ   0x0021
#define QMIWDS_STOP_NETWORK_INTERFACE_RESP  0x0021
#define QMIWDS_GET_RUNTIME_SETTINGS_REQ     0x002D
#define QMIWDS_GET_RUNTIME_SETTINGS_RESP    0x002D
//used for abort,when dailing. added by qiao 2012.3.21
#define QMIWDS_ABORT_MSG_REQ                0X0002
#define QMIWDS_ABORT_MSG_RESP               0X0002  
#define QMIWDS_EVENT_REPORT_REQ             0X0001
#define QMIWDS_EVENT_REPORT_RESP            0X0001
// wds Indication
#define QMIWDS_GET_PKT_SRVC_STATUS_IND      0x0022
#define QMIWDS_GET_PKT_SRVC_STATUS          0X0022
#define QMIWDS_GO_ACTIVE_REQ                0X0026
#define QMIWDS_GO_ACTIVE_RESP               0X0026

#define QMICTL_CTL_FLAG_REQUEST 0x00

#define QMI_RESULT_SUCCESS 0x0000
#define QMI_RESULT_FAILURE 0x0001

#define QMUX_CTL_FLAG_SINGLE_MSG 0x00
#define QMUX_CTL_FLAG_TYPE_CMD   0x00
#define QMUX_CTL_FLAG_MASK_TYPE  0x06
#define QMUX_CTL_FLAG_MASK_COMPOUND 0x01
#define QMUX_CTL_FLAG_TYPE_RSP   0x02
#define QMUX_CTL_FLAG_TYPE_IND   0x04

typedef struct _QMICTL_GET_CLIENT_ID_REQ_MSG
{
    UInt8 CtlFlags;
	UInt8 TransactionId;
	UInt16 QMICTLType;
	UInt16 Length;
	UInt8  TLVType;
	UInt16 TLVLength;
	UInt8  QMIType;
}__attribute__((packed)) QMICTL_GET_CLIENT_ID_REQ_MSG;

typedef struct _QMICTL_GET_CLIENT_ID_RESP_MSG
{
    UInt8 CtlFlags;
	UInt8 TransactionId;
	UInt16 QMICTLType;
	UInt16 Length;
	UInt8  TLVType;
	UInt16 TLVLength;
	UInt16 QMIResult;
	UInt16 QMIError;
	UInt8  TLV2Type;
	UInt16 TLV2Length;
	UInt8  QMIType;
	UInt8  ClientId;
}__attribute__((packed)) QMICTL_GET_CLIENT_ID_RESP_MSG;

typedef struct _QMICTL_RELEASE_CLIENT_ID_REQ_MSG
{
	UInt8 CtlFlags;
	UInt8 TransactionId;
	UInt16 QMICTLType;
	UInt16 Length;
	UInt8  TLVType;
	UInt16 TLVLength;
	UInt8  QMIType;
	UInt8  ClientId;
}__attribute__((packed)) QMICTL_RELEASE_CLIENT_ID_REQ_MSG;

typedef struct _QMICTL_RELEASE_CLIENT_ID_RESP_MSG
{
    UInt8 CtlFlags;
	UInt8 TransactionId;
	UInt16 QMICTLType;
	UInt16 Length;
	UInt8  TLVType;
	UInt16 TLVLength;
	UInt16 QMIResult;
	UInt16 QMIError;
	UInt8  TLV2Type;
	UInt16 TLV2Length;
	UInt8  QMIType;
	UInt8  ClientId;
}__attribute__((packed)) QMICTL_RELEASE_CLIENT_ID_RESP_MSG;

typedef struct _QMICTL_GET_VERSION_REQ_MSG
{
	UInt8 CtlFlags;
	UInt8 TransactionId;
	UInt16 QMICTLType;
	UInt16 Length;
	UInt8  TLVType;
	UInt16 TLVLength;
	UInt8  QMIType;    
}__attribute__((packed)) QMICTL_GET_VERSION_REQ_MSG;

typedef struct _QMUX_TYPE_VERSION_STRUCT
{
	UInt8  QMUXType;
	UInt16 MajorVersion;
	UInt16 MinorVersion;
}__attribute__((packed)) QMUX_TYPE_VERSION_STRUCT;

typedef struct _QMICTL_GET_VERSION_RESP_MSG
{
    UInt8 CtlFlags;
	UInt8 TransactionId;
	UInt16 QMICTLType;
	UInt16 Length;
	UInt8  TLVType;
	UInt16 TLVLength;
	UInt16 QMIResult;
	UInt16 QMIError;
	UInt8  TLV2Type;
	UInt16 TLV2Length;
	UInt8  NumElements;
	QMUX_TYPE_VERSION_STRUCT  TypeVersion;
}__attribute__((packed)) QMICTL_GET_VERSION_RESP_MSG;

typedef struct _QMI_TLV_HDR
{
    UInt8  TLVType;
	UInt16 TLVLength;
}__attribute__((packed)) QMI_TLV_HDR;

// set data format
typedef struct _QMICTL_SET_DATA_FORMAT_TLV_LINK_PROT
{
    UInt8  TLVType;
	UInt16 TLVLength;
	UInt16 LinkProt;
}__attribute__((packed)) QMICTL_SET_DATA_FORMAT_TLV_LINK_PROT;

typedef struct _QMICTL_SET_DATA_FORMAT_REQ_MSG
{
    UInt8 CtlFlags;
	UInt8 TransactionId;
	UInt16 QMICTLType;
	UInt16 Length;
	UInt8  TLVType;
	UInt16 TLVLength;
	UInt8  DataFormat;
	QMICTL_SET_DATA_FORMAT_TLV_LINK_PROT Proto;
}__attribute__((packed)) QMICTL_SET_DATA_FORMAT_REQ_MSG;

typedef struct _QMICTL_SET_DATA_FORMAT_RESP_MSG
{
	UInt8 CtlFlags;
	UInt8 TransactionId;
	UInt16 QMICTLType;
	UInt16 Length;
	UInt8  TLVType;
	UInt16 TLVLength;
	UInt16 QMIResult;
	UInt16 QMIError;
	QMICTL_SET_DATA_FORMAT_TLV_LINK_PROT Proto;
}__attribute__((packed)) QMICTL_SET_DATA_FORMAT_RESP_MSG;

typedef struct _QMICTL_SET_INSTANCE_ID_REQ_MSG
{
    UInt8 CtlFlags;
	UInt8 TransactionId;
	UInt16 QMICTLType;
	UInt16 Length;
	UInt8  TLVType;
	UInt16 TLVLength;
	UInt8  Value;
}__attribute__((packed)) QMICTL_SET_INSTANCE_ID_REQ_MSG;

typedef struct _QMICTL_SET_INSTANCE_ID_RESP_MSG
{
	UInt8 CtlFlags;
	UInt8 TransactionId;
	UInt16 QMICTLType;
	UInt16 Length;
	UInt8  TLVType;
	UInt16 TLVLength;
	UInt16 QMIResult;
	UInt16 QMIError;
	UInt8  TLV2Type;
	UInt16 TLV2Length;
	UInt16 QMI_ID;
}__attribute__((packed)) QMICTL_SET_INSTANCE_ID_RESP_MSG;


#define QCTLV_TYPE_REQUIRED_PARAMETER 0x01
#define QMICTL_GETVERSION_RSP_TLV_TYPE_ADD_VERSION 0x10

#define SET_DATA_FORMAT_TLV_TYPE_LINK_PROTO 0x10
#define SET_DATA_FORMAT_LINK_PROTO_ETH      0x0001
#define SET_DATA_FORMAT_LINK_PROTO_IP       0x0002

#define MP_INVALID_QMI_ID                   0xF0000000

#define QCTLV_TYPE_APN 0x14
#define QCTLV_TYPE_AUTH_TYPE 0x16
#define QCTLV_TYPE_USER_NAME 0x17
#define QCTLV_TYPE_PASSWORD  0x18
#define QCTLV_TYPE_IP_FAMILY 0x19

typedef struct _QMIWDS_RESP_MSG_HEADER
{
    UInt16 Type;
	UInt16 Length;
	UInt8  TLVType;
	UInt16 TLVLength;
	UInt16 QMUXResult;
	UInt16 QMUXError;
}__attribute__((packed)) QMIWDS_RESP_MSG_HEADER, *PQMIWDS_RESP_MSG_HEADER;

typedef struct _QMIWDS_START_NETWORK_INTERFACE_RESP_MSG
{
    UInt16 Type;
	UInt16 Length;
	UInt8  TLVType;
	UInt16 TLVLength;
	UInt16 QMUXResult;
	UInt16 QMUXError;
	UInt8  TLVType2;
	UInt16 TLVLength2;
	UInt32 Pkt_Data_Handle;
}__attribute__((packed)) QMIWDS_START_NETWORK_INTERFACE_RESP_MSG;

typedef struct _QMIWDS_GET_PKT_SRVC_STATUS_IND_MSG
{
    UInt16 Type;
	UInt16 Length;
	UInt8  TLVType;
	UInt16 TLVLength;
	UInt8  ConnectionStatus;
	UInt8  ReconfigRequired;
}__attribute__((packed)) QMIWDS_GET_PKT_SRVC_STATUS_IND_MSG;

typedef struct _QMIWDS_STOP_NETWORK_INTERFACE_REQ_MSG
{
    UInt16 Type;
	UInt16 Length;
	UInt8  TLVType;
	UInt16 TLVLength;
	UInt32 Packet_Handle;
}__attribute__((packed)) QMIWDS_STOP_NETWORK_INTERFACE_REQ_MSG;

typedef struct _QMIWDS_ABORT_CONNECTING_REQ_MSG
{
    UInt16 Type;
	UInt16 Length;
	UInt8  TLVType;
	UInt16 TLVLength;
	UInt16 ConnTransactionId;
}__attribute__((packed)) QMIWDS_ABORT_CONNECTING_REQ_MSG;

typedef struct _QMIWDS_GET_RUNTIME_SETTINGS_REQ_MSG
{
    UInt16 Type;
	UInt16 Length;
	UInt8  TLVType;
	UInt16 TLVLength;
	UInt32 Mask;
}__attribute__((packed)) QMIWDS_GET_RUNTIME_SETTINGS_REQ_MSG;

typedef struct _QMIWDS_GET_RUNTIME_SETTINGS_TLV_IPV4_ADDR
{
    UInt8  TLVType;
	UInt16 TLVLength;
	UInt32 IPV4Address;
}__attribute__((packed)) QMIWDS_GET_RUNTIME_SETTINGS_TLV_IPV4_ADDR;

typedef struct _QMIWDS_GET_RUNTIME_SETTINGS_RESP_MSG
{
    UInt16 Type;
	UInt16 Length;
	UInt8  TLVType;
	UInt16 TLVLength;
	UInt16 QMUXResult;
	UInt16 QMUXError;
}__attribute__((packed)) QMIWDS_GET_RUNTIME_SETTINGS_RESP_MSG;

#define QMIWDS_GET_RUNTIME_SETTINGS_TLV_TYPE_IPV4 0x1E
#define QMIWDS_GET_RUNTIME_SETTINGS_TLV_TYPE_IPV6 0x25

#define QMIWDS_GET_RUNTIME_SETTINGS_MASK_IPV4_ADDR 0x0100
#define QMIWDS_GET_RUNTIME_SETTINGS_MASK_ALL 0xFFFF

// qmi error code
#define QMI_ERR_CALL_FAILED           0x0E
#define QMI_ERR_AUTHENTICATION_FAILED 0x22
#define QMI_ERR_NO_NETWORK_FOUND      0x0D
#define QMI_ERR_IP_FAILED             0xFF01


// ethernet headers
#define ETH_TYPE_ARP  0x0806
#define ETH_TYPE_IPV4 0x0800
#define ETH_TYPE_IPV6 0x86DD

#define ETH_LENGTH_OF_ADDRESS 6

typedef struct _QC_ETH_HDR
{
    UInt8 DstMacAddress[ETH_LENGTH_OF_ADDRESS];
	UInt8 SrcMacAddress[ETH_LENGTH_OF_ADDRESS];
	UInt16 EtherType;
}__attribute__((packed)) QC_ETH_HDR;

typedef struct _QC_ARP_HDR
{
    UInt16 HardwareType;
	UInt16 ProtocolType;
	UInt8  HLEN;
	UInt8  PLEN;
	UInt16 Operation;
	UInt8  SenderHA[ETH_LENGTH_OF_ADDRESS];
	UInt32 SenderIP;
	UInt8  TargetHA[ETH_LENGTH_OF_ADDRESS];
	UInt32 TargetIP;
}__attribute__((packed)) QC_ARP_HDR; 

#define kUSBModem_Oper_Flag           "ModemOper"
#define kUSBModem_Connect_APN         "APN"
#define kUSBModem_Connect_UserName    "UserName"
#define kUSBModem_Connect_Password    "PassWord"
#define kUSBModem_Connect_Compression "Compression"
#define kUSBModem_Connect_Error       "ModemConnectionError"

#define QWDS_PKT_DATA_DISCONNECTED    0x01
#define QWDS_PKT_DATA_CONNECTED       0x02
#define QWDS_PKT_DATA_SUSPENDED       0x03

enum  
{
    WwanAuthProtocolNone = 0x00,
	WwanAuthProtocolPap  = 0x01,
	WwanAuthProtocolChap = 0x02,
	WwanAuthProtocolMax  = 0xFF
};

enum 
{
	WwanOperationQueryReady = 0x00,
	WwanOperationConnect    = 0x01,
	WwanOperationDisconnect = 0x02,
	WwanOperationState      = 0x03,
	WwanOperationCount      = 0x04,
	WwanOperationMax        = 0xFF
};

enum  
{
    WwanStateDisconnected  = 0,
	WwanStateConnecting    = 1,
	WwanStateConnected     = 2,
	WwanStateDisconnecting = 3
};

#define WWAN_STRING_LEN    64


typedef struct
{
    char AccessString[WWAN_STRING_LEN];   
	char UserName[WWAN_STRING_LEN];
	char Password[WWAN_STRING_LEN];
	UInt32 Commpression;
	UInt32 IpFamily;
}__attribute__((packed)) WWAN_CONNECT_PARAMS;

typedef struct _WWAN_FLOW_STATS
{
	UInt32 ConnectState;
	UInt64 UpLinkBytes;
	UInt64 DownLinkBytes;
}__attribute__((packed)) WWAN_FLOW_STATS;

#endif
