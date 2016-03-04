function GV(v, df)   //如果服务器中获取参数错误，且参数之前有<%则将参数值置为df
{
  return (v.indexOf("<%") > -1) ? df : v;//If var is wrong, use df, else use the right value, GFL 判断获取参数的正确性
} 
var g_isSupMpeg4 = GV("<%supportmpeg4%>", 1);
var g_videoFormat = GV("<%format%>", 0);
var g_isPal = (GV("<%imagesource%>", 1) == "1");
var g_deviceName = GV("<%devicename%>", "VideoServer");
var g_defaultStorage = GV("<%defaultstorage%>", 1); // 0: cf, 1:sd 255:no card //modified by zdy,20120827
var g_SDInsert = GV("<%sdinsert%>", 0);//modified by zdy,20120824
var g_CFInsert = GV("<%cfinsert%>", 0);
var g_cardGetLink = GV("<%defaultcardgethtm%>", "sdget.htm"); //zdy
var g_brandUrl = GV("<%brandurl%>", null);
var g_titleName = GV("<%title%>", "IPCAM");
var g_brandName = "nobrand";
var g_supportTStamp = GV("<%supporttstamp%>", 0);
var g_mpeg4XSize = 0;
var g_mpeg4YSize = 0;
var g_h264XSize = 0;//GFL
var g_h264YSize = 0;//GFL
var g_jpegXSize = 0;
var g_jpegYSize =0;
var g_socketAuthority = parseInt(GV("<%socketauthority%>", 3)); // 0:admin,1:operator,2:viewer
var g_isAuthorityChange = (parseInt(GV("<%authoritychange%>", 0)) == 1);
var g_isSupMotion = (parseInt(GV("<%supportmotion%>", 0)) >= 1);
var g_isSupWireless = (parseInt(GV("<%supportwireless%>", 0)) == 1);//GFL
var g_serviceFtpClient = 1;//parseInt(GV("<%serviceftpclient%>", 0));
var g_serviceSmtpClient = 1;//parseInt(GV("<%servicesmtpclient%>", 0));//GFL
var g_servicePPPoE = parseInt(GV("<%servicepppoe%>", 0));
var g_serviceSNTPClient = 1;//parseInt(GV("<%servicesntpclient%>", 0));//GFL
var g_serviceDDNSClient = 1;//parseInt(GV("<%serviceddnsclient%>", 0));//GFL
var g_s_maskarea = GV("<%supportmaskarea%>", 0);
var g_machineCode = "<%machinecode%>";
var g_maxCH = 4; //GV("<%maxchannel%>", 4); //zdy
var g_isSupportRS485 = ("<%supportrs485%>" == "1");
var g_isSupportRS232 = ("<%supportrs232%>" == "1");
var g_useActiveX = GV("<%layoutnum.0%>", 1);
var g_ptzID = GV("<%layoutnum.1%>", 1);
var g_s_mui = GV("<%supportmui%>", 1); //zdy
var g_mui = GV("<%mui%>", -1);
var g_isSupportSeq = ("<%supportsequence%>" == "1");
var g_isSupportMQ = (parseInt("<%quadmodeselect%>") >= 0);
var g_quadMode = GV("<%quadmodeselect%>", 1); // default is 1:quad
var g_isSupportSmtpAuth = true;
var g_isSupportIPFilter = ("<%serviceipfilter%>" == "1");
var g_oemFlag0 = (parseInt(GV("<%oemflag0%>", 0)));
var g_s_daynight = (parseInt(GV("<%supportdncontrol%>", 0)) == 1);
var g_is264 = 1;//(parseInt(GV("<%supportavc%>", 0)) == 1);//GFL
var g_isSupportD2N = false;
var g_isSupportN2D = false;
var g_isSupportAudio = (parseInt(GV("<%supportaudio%>", 0)) >= 1);
var g_isSelMpeg4 = (parseInt(GV("<%supportavc%>", 0)) == 1);
//==========================
// Follow add by zdy
//==========================
var daylight = parseInt("<%daylight%>");  //zdy
var audioSupport = parseInt("<%audioenable%>"); //zdy  
var timeFormat = parseInt("<%timeformat%>");
var imagesource = "<%imagesource%>";
//var gv_ip1 = "<%netip%>"; //add by zdy
var gv_ip1 = document.domain; 
//	alert("<%supportmui%>");
function getip(){
	var val = gv_ip1.split('.');
	 // alert(val);
	  var i;
	  var url = '';;
	  for(i=0;i<4;i++){
	  	  val[i] = parseInt(val[i]);
	  	  url = url + val[i];
	  	  if(i<3){
	  	  	  url = url + '.';
	  	  }
	  }
	  return url;
}
var gv_ip = getip();
var recenable = 1; //add by zdy
var isRecord = 0; //add by zdy

function GetRegValue()
{
	var	g_regvalue = "<%regvalue%>";
	ChangeContent();
	return g_regvalue;
}
//==========================
// PTZ Control
//==========================
// supportptzpage 0:NO PTZ, 1:NORMAL, 2:DV840, 3:DV840 with Full Control 4:New
// UI for Peloco-D
// Note: old machine no this command, so default is 1
var g_isSupportPtz = (parseInt(GV("<%supportptzpage%>", 1)) > 0);
// display old PTZ control
var g_isShowOldPtzPage = (parseInt(GV("<%supportptzpage%>", 1)) == 1);;
var g_isShowFullPtzCtrl = false;
var g_isShowPtzPD = false;

// LUTHER TEST FOR 7242
// var g_isSupportPtz=true;
// var g_isShowOldPtzPage=false;
// var g_isShowFullPtzCtrl=false;
// var g_isShowPtzPD=true;

var g_isShowDvPtzCtrl = ( g_isShowFullPtzCtrl || g_isShowPtzPD);

//==========================
// Multi Profile
//==========================
var g_s1XSize = parseInt(GV("<%stream1xsize%>", 640));
var g_s1YSize = parseInt(GV("<%stream1ysize%>", 360));
var g_s2XSize = parseInt(GV("<%stream2xsize%>", 320));
var g_s2YSize = parseInt(GV("<%stream2ysize%>", 240));
var g_s3XSize = parseInt(GV("<%stream3xsize%>", 320));
var g_s3YSize = parseInt(GV("<%stream3ysize%>", 240));
var g_s4XSize = parseInt(GV("<%stream4xsize%>", 320));
var g_s4YSize = parseInt(GV("<%stream4ysize%>", 240));
var g_s5XSize = parseInt(GV("<%stream5xsize%>", 640));
var g_s5YSize = parseInt(GV("<%stream5ysize%>", 360));
var g_s6XSize = parseInt(GV("<%stream6xsize%>", 320));
var g_s6YSize = parseInt(GV("<%stream6ysize%>", 240));
var g_isSupS1 = 1;//(parseInt(GV("<%supportstream1%>", 0)) >= 1); //我猜测应该是支持码流3
var g_isSupS2 = (parseInt(GV("<%supportstream2%>", 0)) >= 1);
var g_isSupS3 = (parseInt(GV("<%supportstream3%>", 0)) >= 1);
var g_isSupS4 = (parseInt(GV("<%supportstream4%>", 0)) >= 1);
var g_isSupS5 = 1;//(parseInt(GV("<%supportstream5%>", 0)) >= 1);//我猜测应该是支持码流1
var g_isSupS6 = 1;//(parseInt(GV("<%supportstream6%>", 0)) >= 1);//我猜测应该是支持码流2

var g_isSupportMultiProfile = true;
var g_isSupportQuickSet = false;
var g_isMP1 = true;
var g_isMP73 = false;

var g_isEventApp = false;

var c_MaxTextLen = parseInt("<%maxtextlen%>");
    var userStr = new Array("<%user.0%>", "<%authority.0%>", 
							"<%user.1%>", "<%authority.1%>", 
							"<%user.2%>", "<%authority.2%>", 
							"<%user.3%>", "<%authority.3%>", 
							"<%user.4%>", "<%authority.4%>", 
							"<%user.5%>", "<%authority.5%>", 
							"<%user.6%>", "<%authority.6%>", 
							"<%user.7%>", "<%authority.7%>", 
							"<%user.8%>", "<%authority.8%>", 
							"<%user.9%>", "<%authority.9%>", 
							"<%user.10%>", "<%authority.10%>", //GFL
							"<%user.11%>", "<%authority.11%>", 
							"<%user.12%>", "<%authority.12%>", 
							"<%user.13%>", "<%authority.13%>", 
							"<%user.14%>", "<%authority.14%>", 
							"<%user.15%>", "<%authority.15%>"//GFL, total 16 users 
							);
var loginusr = "<%loginuser%>";
var loginauth = "<%loginauth%>";
var umenable1 = "<%umenable1%>";
var umenable2 = "<%umenable2%>";
var umenable3 = "<%umenable3%>";

var umip1 = "<%umip1%>";
var umip2 = "<%umip2%>";
var umip3 = "<%umip3%>";

var umport1 = "<%umport1%>";
var umport2 = "<%umport2%>";
var umport3 = "<%umport3%>";

var snappath = "<%snapshotpath%>";
var recpath = "<%recordpath%>";

var copyright = "<%copyrightinfo%>";

var streamtype = "<%videocodec%>";

var flowtype = "<%flowtype%>";


var streamname1 = "<%streamname1%>";
var streamname2 = "<%streamname2%>";
var streamname3 = "<%streamname3%>";

var streamname1list = streamname1.split('@');
var streamname2list = streamname2.split('@');
var streamname3list = streamname3.split('@');

//var stream1 = streamname1list[1];
//var stream2 = streamname2list[1];
//var stream3 = streamname3list[1];

var stream1 = "rtsp://"+gv_ip1+":8557/h264";
var stream2 = "rtsp://"+gv_ip1+":8556/h264";
var stream3 = "rtsp://"+gv_ip1+":8555/mjpeg";

var originurl = "192.168.0.2";
function loadJS(url)
{
  document.write('<script language="javascript" type="text/javascript" src="' + url + '"></script>');
}

var g_fdetect = "<%fdetect%>";
var g_fdconflevel = "<%fdconflevel%>";
var g_fddirection = "<%fddirection%>";
var g_fdx = "<%fdx%>";
var g_fdy = "<%fdy%>";
var g_fdw = "<%fdw%>";
var g_fdh = "<%fdh%>";
var g_fddirection = "<%fddirection%>";

var g_overlaytext1 = "<%overlaytext1%>";
var g_overlaytext2 = "<%overlaytext2%>";
var g_overlaytext3 = "<%overlaytext3%>";

var device_type= "<%device_type%>";//设备类型1,park; 2,VM; 3,VM_P; 4,VP;

var G_or_B = "<%ptzctrl%>";//球or枪 0,枪；1,球； 2:TC26

var C_Movement = 2;//机芯种类，0:镜头传感器 ;1:松下，2: 动力视讯 

var threeDposition = 0; //3D开关， 0：off 1:on
