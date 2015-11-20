/******************************************************************************
  @file    qmi.h
  @brief   Common, external QMI definitions

  DESCRIPTION
  This file contains common, external header file definitions for QMI
  interface library.

  INITIALIZATION AND SEQUENCING REQUIREMENTS
  qmi_init() must be called at client process initialization time.
  qmi_connection_init() must be called for each QMI control channel that
  you want to send messages on.
  qmi_release() must be called prior to client process exiting

  $Header: //source/qcom/qct/modem/datacommon/qmimsglib/dev/work/inc/qmi.h#2 $ 
  $DateTime: 2009/07/15 10:38:12 $
  ---------------------------------------------------------------------------
  Copyright (c) 2007 - 2012 QUALCOMM Technologies Incorporated. All Rights Reserved.
  QUALCOMM Proprietary and Confidential.
  ---------------------------------------------------------------------------
******************************************************************************/

#ifndef QMI_H
#define QMI_H

//#include "qmi_platform_config.h"

#ifdef __cplusplus
extern "C" {
#endif


#ifndef EXTERN
#define EXTERN extern
#endif

/* Typedef for client handles */
typedef int qmi_client_handle_type;

/* Error codes returned from QMI interface functions */
#define QMI_NO_ERR                0       /* No Error */
#define QMI_INTERNAL_ERR               -1      /* Linux/System Error */
#define QMI_SERVICE_ERR               -2      /* QMI error, check QMI error code */
#define QMI_TIMEOUT_ERR           -3      /* Transaction timeout error code */ 
#define QMI_EXTENDED_ERR           -4      /* SubSystem specific error codes(example: ds_profile) */ 
#define QMI_PORT_NOT_OPEN_ERR      -5     /* QMI control port is not open */


/* Encode/Decode library specific error codes */
#define QMI_IDL_BUFFER_TOO_SMALL                -6
#define QMI_IDL_ARRAY_TOO_BIG                   -7
#define QMI_IDL_MESSAGE_ID_NOT_FOUND            -8
#define QMI_IDL_TLV_DUPLICATED                  -9
#define QMI_IDL_LENGTH_INCONSISTENCY            -10
#define QMI_IDL_MISSING_TLV                     -11
#define QMI_IDL_PARAMETER_ERROR                 -12
#define QMI_IDL_UNRECOGNIZED_SERVICE_VERSION    -13

/* Additional error codes */
#define QMI_MEMCOPY_ERROR                       -14
#define QMI_INVALID_TXN                         -15
#define QMI_CLIENT_ALLOC_FAILURE                -16
#define QMI_IDL_UNKNOWN_MANDATORY_TLV           -17
#define QMI_SERVICE_NOT_PRESENT_ON_MODEM        -18
#define QMI_IDL_TLV_RESP_ERROR                  -19



/* QMI Error codes.  The value in the qmi error code should be set
** to one these when QMI_SERVICE_ERR is returned 
*/
#define QMI_SERVICE_ERR_NONE                          0
#define QMI_SERVICE_ERR_MALFORMED_MSG                 1
#define QMI_SERVICE_ERR_NO_MEMORY                     2
#define QMI_SERVICE_ERR_INTERNAL                      3
#define QMI_SERVICE_ERR_ABORTED                       4
#define QMI_SERVICE_ERR_CLIENT_IDS_EXHAUSTED          5
#define QMI_SERVICE_ERR_UNABORTABLE_TRANSACTION       6
#define QMI_SERVICE_ERR_INVALID_CLIENT_ID             7
#define QMI_SERVICE_ERR_NO_THRESHOLDS                 8
#define QMI_SERVICE_ERR_INVALID_HANDLE                9
#define QMI_SERVICE_ERR_INVALID_PROFILE               10
#define QMI_SERVICE_ERR_INVALID_PINID                 11
#define QMI_SERVICE_ERR_INCORRECT_PIN                 12
#define QMI_SERVICE_ERR_NO_NETWORK_FOUND              13
#define QMI_SERVICE_ERR_CALL_FAILED                   14
#define QMI_SERVICE_ERR_OUT_OF_CALL                   15
#define QMI_SERVICE_ERR_NOT_PROVISIONED               16
#define QMI_SERVICE_ERR_MISSING_ARG                   17
#define QMI_SERVICE_ERR_ARG_TOO_LONG                  19
#define QMI_SERVICE_ERR_INVALID_TX_ID                 22
#define QMI_SERVICE_ERR_DEVICE_IN_USE                 23
#define QMI_SERVICE_ERR_OP_NETWORK_UNSUPPORTED        24
#define QMI_SERVICE_ERR_OP_DEVICE_UNSUPPORTED         25
#define QMI_SERVICE_ERR_NO_EFFECT                     26
#define QMI_SERVICE_ERR_NO_FREE_PROFILE               27
#define QMI_SERVICE_ERR_INVALID_PDP_TYPE              28
#define QMI_SERVICE_ERR_INVALID_TECH_PREF             29
#define QMI_SERVICE_ERR_INVALID_PROFILE_TYPE          30
#define QMI_SERVICE_ERR_INVALID_SERVICE_TYPE          31
#define QMI_SERVICE_ERR_INVALID_REGISTER_ACTION       32
#define QMI_SERVICE_ERR_INVALID_PS_ATTACH_ACTION      33
#define QMI_SERVICE_ERR_AUTHENTICATION_FAILED         34
#define QMI_SERVICE_ERR_PIN_BLOCKED                   35
#define QMI_SERVICE_ERR_PIN_PERM_BLOCKED              36
#define QMI_SERVICE_ERR_SIM_NOT_INITIALIZED           37
#define QMI_SERVICE_ERR_MAX_QOS_REQUESTS_IN_USE       38
#define QMI_SERVICE_ERR_INCORRECT_FLOW_FILTER         39
#define QMI_SERVICE_ERR_NETWORK_QOS_UNAWARE           40
#define QMI_SERVICE_ERR_INVALID_ID                    41
#define QMI_SERVICE_ERR_INVALID_QOS_ID                QMI_SERVICE_ERR_INVALID_ID
#define QMI_SERVICE_ERR_REQUESTED_NUM_UNSUPPORTED     42
#define QMI_SERVICE_ERR_INTERFACE_NOT_FOUND           43
#define QMI_SERVICE_ERR_FLOW_SUSPENDED                44
#define QMI_SERVICE_ERR_INVALID_DATA_FORMAT           45
#define QMI_SERVICE_ERR_GENERAL                       46
#define QMI_SERVICE_ERR_UNKNOWN                       47
#define QMI_SERVICE_ERR_INVALID_ARG                   48
#define QMI_SERVICE_ERR_INVALID_INDEX                 49
#define QMI_SERVICE_ERR_NO_ENTRY                      50
#define QMI_SERVICE_ERR_DEVICE_STORAGE_FULL           51
#define QMI_SERVICE_ERR_DEVICE_NOT_READY              52
#define QMI_SERVICE_ERR_NETWORK_NOT_READY             53
#define QMI_SERVICE_ERR_CAUSE_CODE                    54
#define QMI_SERVICE_ERR_MESSAGE_NOT_SENT              55
#define QMI_SERVICE_ERR_MESSAGE_DELIVERY_FAILURE      56
#define QMI_SERVICE_ERR_INVALID_MESSAGE_ID            57
#define QMI_SERVICE_ERR_ENCODING                      58
#define QMI_SERVICE_ERR_AUTHENTICATION_LOCK           59
#define QMI_SERVICE_ERR_INVALID_TRANSITION            60
#define QMI_SERVICE_ERR_NOT_A_MCAST_IFACE             61
#define QMI_SERVICE_ERR_MAX_MCAST_REQUESTS_IN_USE     62
#define QMI_SERVICE_ERR_INVALID_MCAST_HANDLE          63
#define QMI_SERVICE_ERR_INVALID_IP_FAMILY_PREF        64
#define QMI_SERVICE_ERR_SESSION_INACTIVE              65
#define QMI_SERVICE_ERR_SESSION_INVALID               66
#define QMI_SERVICE_ERR_SESSION_OWNERSHIP             67
#define QMI_SERVICE_ERR_INSUFFICIENT_RESOURCES        68
#define QMI_SERVICE_ERR_DISABLED                      69
#define QMI_SERVICE_ERR_INVALID_OPERATION             70
#define QMI_SERVICE_ERR_INVALID_QMI_CMD               71
#define QMI_SERVICE_ERR_TPDU_TYPE                     72
#define QMI_SERVICE_ERR_SMSC_ADDR                     73
#define QMI_SERVICE_ERR_INFO_UNAVAILABLE              74
#define QMI_SERVICE_ERR_SEGMENT_TOO_LONG              75
#define QMI_SERVICE_ERR_SEGMENT_ORDER                 76
#define QMI_SERVICE_ERR_BUNDLING_NOT_SUPPORTED        77
#define QMI_SERVICE_ERR_OP_PARTIAL_FAILURE            78
#define QMI_SERVICE_ERR_POLICY_MISMATCH               79
#define QMI_SERVICE_ERR_SIM_FILE_NOT_FOUND            80
#define QMI_SERVICE_ERR_EXTENDED_INTERNAL             81
#define QMI_SERVICE_ERR_ACCESS_DENIED                 82
#define QMI_SERVICE_ERR_HARDWARE_RESTRICTED           83
#define QMI_SERVICE_ERR_ACK_NOT_SENT                  84
#define QMI_SERVICE_ERR_INJECT_TIMEOUT                85
// Sups Errors
#define QMI_SERVICE_ERR_INCOMPATIBLE_STATE            90
#define QMI_SERVICE_ERR_FDN_RESTRICT                  91
#define QMI_SERVICE_ERR_SUPS_FAILURE_CAUSE            92
#define QMI_SERVICE_ERR_NO_RADIO                      93
#define QMI_SERVICE_ERR_NOT_SUPPORTED                 94
#define QMI_SERVICE_ERR_NO_SUBSCRIPTION               95
#define QMI_SERVICE_ERR_CARD_CALL_CONTROL_FAILED      96
#define QMI_SERVICE_ERR_NETWORK_ABORTED               97
#define QMI_SERVICE_ERR_MSG_BLOCKED                   98
// Error 99 is open
/* QMI PBM Errors */
#define QMI_SERVICE_ERR_INVALID_SESSION_TYPE          100
#define QMI_SERVICE_ERR_INVALID_PB_TYPE               101
#define QMI_SERVICE_ERR_NO_SIM                        102
#define QMI_SERVICE_ERR_PB_NOT_READY                  103
#define QMI_SERVICE_ERR_PIN_RESTRICTION               104
#define QMI_SERVICE_ERR_PIN2_RESTRICTION              105
#define QMI_SERVICE_ERR_PUK_RESTRICTION               106
#define QMI_SERVICE_ERR_PUK2_RESTRICTION              107
#define QMI_SERVICE_ERR_PB_ACCESS_RESTRICTED          108
#define QMI_SERVICE_ERR_PB_DELETE_IN_PROG             109
#define QMI_SERVICE_ERR_MAX                           110


/* Enum for services.  */ 
typedef enum
{
  QMI_FIRST_SERVICE                       = 0x01,
  QMI_WDS_SERVICE                         = QMI_FIRST_SERVICE,
  QMI_DMS_SERVICE                         = 0x02,
  QMI_NAS_SERVICE                         = 0x03,
  QMI_QOS_SERVICE                         = 0x04,
  QMI_WMS_SERVICE                         = 0x05,
  QMI_SERVICE_NOT_YET_IMPLEMENTED_1       = 0x06,
  QMI_EAP_SERVICE                         = 0x07,
  QMI_ATCOP_SERVICE                       = 0x08,
  QMI_VOICE_SERVICE                       = 0x09,
  QMI_CAT_SERVICE                         = 0x0A,
  QMI_UIM_SERVICE                         = 0x0B,
  QMI_PBM_SERVICE                         = 0x0C,
  QMI_SERVICE_NOT_YET_IMPLEMENTED_2       = 0x0D,
  QMI_SERVICE_NOT_YET_IMPLEMENTED_3       = 0x0E,
  QMI_SERVICE_NOT_YET_IMPLEMENTED_4       = 0x0F,
  QMI_SERVICE_NOT_YET_IMPLEMENTED_5       = 0x10,
  QMI_SAR_SERVICE                         = 0x11,
  QMI_IMS_VIDEO_SERVICE                   = 0x12,
  QMI_SERVICE_NOT_YET_IMPLEMENTED_6       = 0x13,
  QMI_CSD_SERVICE                         = 0x14,
  QMI_SERVICE_NOT_YET_IMPLEMENTED_7       = 0x15,
  QMI_SERVICE_NOT_YET_IMPLEMENTED_8       = 0x16,
  QMI_SERVICE_NOT_YET_IMPLEMENTED_9       = 0x17,
  QMI_SERVICE_NOT_YET_IMPLEMENTED_10      = 0x18,
  QMI_SERVICE_NOT_YET_IMPLEMENTED_11      = 0x19,
  QMI_SERVICE_NOT_YET_IMPLEMENTED_12      = 0x1A,
  QMI_SERVICE_NOT_YET_IMPLEMENTED_13      = 0x1B,
  QMI_SERVICE_NOT_YET_IMPLEMENTED_14      = 0x1C,
  QMI_CSVT_SERVICE                        = 0x1D,
  QMI_IMS_VT_SERVICE,
  QMI_IMS_PRESENCE_SERVICE                = 0x1F,
  QMI_FIRST_VS_SERVICE,
  QMI_RF_SAR_SERVICE                      = QMI_FIRST_VS_SERVICE,
  QMI_MAX_SERVICES
} qmi_service_id_type;


/* #defines for numbers of connections */
/* Max number of PDP connections */
#define QMI_MAX_PDP_CONNECTIONS (3) 

/* Max number of connections including PDP and broadcast */
/* +1 for the QMI Proxy */
/* +1 for the USB Rmnet tethered port "rmnet8" */
#define QMI_MAX_CONNECTIONS (18+1+1)


/* Definitions for set_data_format command */
typedef unsigned short qmi_link_layer_protocol_type;
#define QMI_DATA_FORMAT_LINK_PROTOCOL_UNSPECIFIED  0x0000
#define QMI_DATA_FORMAT_LINK_PROTOCOL_ETHERNET     0x0001
#define QMI_DATA_FORMAT_LINK_PROTOCOL_IP           0x0002
#define QMI_DATA_FORMAT_LINK_PROTOCOL_ALL          0x0003 /* Update to all valid 
                                                          ** bits when adding protocols 
                                                          */

#define QMI_MAX_PWR_INDICATIONS 10  /* Must be at least 3 */
#define QMI_MAX_SERVICE_VERSIONS (QMI_MAX_SERVICES)
#define QMI_MAX_ADDENDUM_LABEL 255

/* used to initialize qmi handle 
 * before calling the qmi_init() API
 */
#define QMI_INVALID_CLIENT_HANDLE   -1

typedef enum
{
  QMI_PWR_EVENT_REPORT_OFF = 0,
  QMI_PWR_EVENT_REPORT_ON  = 1
} qmi_pwr_report_type;


typedef enum
{
  QMI_DATA_FORMAT_WITHOUT_QOS_HDR = 0,
  QMI_DATA_FORMAT_WITH_QOS_HDR = 1
} qmi_data_format_qos_hdr_state_type;


typedef enum
{
  QMI_IP_FAMILY_PREF_ANY = 0,
  QMI_IP_FAMILY_PREF_IPV4 = 4,
  QMI_IP_FAMILY_PREF_IPV6 = 6,
  QMI_IP_FAMILY_PREF_UNSPECIFIED = 8
} qmi_ip_family_pref_type;

/* System event types */
typedef enum
{
  QMI_SYS_EVENT_INVALID = -1,
  QMI_SYS_EVENT_PWR_REPORT,
  QMI_SYS_EVENT_SYNC_IND,
  QMI_SYS_EVENT_MODEM_OUT_OF_SERVICE_IND,
  QMI_SYS_EVENT_MODEM_IN_SERVICE_IND,
} qmi_sys_event_type;

/* Data associated with system events (to be filled in as required) */
typedef union
{
  struct 
  {
    int curr_pwr_state_hndl;
    int prev_pwr_state_hndl;
  } qmi_sys_event_pwr_report;
 
  struct
  {
    int conn_id;
  } qmi_sync_ind;

} qmi_sys_event_info_type;

/* Event callback handler prototype */
typedef void (*qmi_sys_event_rx_hdlr) 
(
  qmi_sys_event_type        event_id,
  const qmi_sys_event_info_type   *event_info,
  void                      *user_data
);

/* Service version tuple */
typedef struct {
    unsigned short  major_ver;  /*  Major version number */
    unsigned short  minor_ver;  /*  Minor version number */
}qmi_service_version_info;


#ifdef __cplusplus
}
#endif


#endif /* QMI_H */
