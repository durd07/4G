var AxVer = "1,0,3,22";
var webPageVersion = "1.3";
var webPageSubVersion = "1";
var DigSignName = "APPROTECH";
var g_viewXSize = 1600;
var g_viewYSize = 900;
var browser_Netscape = false;
var browser_IE = false;
var browser_FireFox = false;
var keyword_Show = '';
var keyword_Hide = '';
var AxID = "vlc";

var g_MaxSubmitLen = 190;
// it will be over, increase 30
var AxUuid = "A2D1277C-2CC2-4A1A-B715-C6BAB17661D6";
// add by zdy, vlc
var LAry = {};
var LangKeyPrefix = "lang_";
var g_CHID = 0;
var CONTENT_PAGE = '';
var CONTENT_PAGE_LAST = '';
// for link error backup.
var CTRLARY = {};
var c_iniUrl = "/vb.htm?language=ie";
var g_httpOK = true;
var g_SubmitHttp = null;
var g_lockLink = false;
// lock the link , can not access.
var g_CHPageList = "hiddfilename.htm;login.htm;c_sccd.htm;sdigital.htm;aenable.htm;motion.htm;img.htm;imgtune.htm;main.htm;";
var g_badLinkList = "^login\\.htm;^bwcntl\\.htm;^image\\.htm;^update\\.htm;^nftphost\\.htm;^help\\.htm;^ndhcpsvr\\.htm;^nupnp\\.htm;^k_\\w*\\.htm;^p_\\w*\\.htm;^ptz_\\w*\\.htm;^faq\\.htm;^version\\.htm;^index\\.htm;^sccd\\.htm;^armio\\.htm;^svideo\\.htm;^tailpage\\.htm;^mcenter\\.htm;^lang\\.htm".split(";");
var g_AdvMode = 0;
// display advance menu. 1:on , 0:off
var g_lastPolicy = 0;
var WCH = null;
// WebContentHttp
// set language name , must has order.
var g_langFullNameList = new Array("en_us", "zh_cn", "zh_tw", "cs_cz", "nl_nl", "fi_fi", "fr_fr", "de_de", "it_it", "pl_pl", "pt_pt", "es_es", "sv_se", "hu_hu", "ro_ro", "tr_tr");
var g_langNameList;
var g_langName;
var g_sh_net = true;
var g_backList = new Array();
var g_fwdList = new Array();
var NO_STORAGE = 255;
// 255
var ISNOSTORE = (g_defaultStorage == NO_STORAGE);
var g_isShowUpdate = ((g_oemFlag0 & 0x00000001) != 0);
var g_isShowBWCtrl = ((g_oemFlag0 & 0x00000002) != 0);
var g_isShowUPnP = ((g_oemFlag0 & 0x00000004) != 0);

//window.pause_flag = 0; // vlc pause or not

// Multi Profile Case 1
// define the 7228 and 7227, width and hight
// define codec:
var V_JPEG = 1000;
var V_MPEG4 = 1005;
var V_H264 = 1010;

// keep the left top point
var baseX = 0;
var baseY = 0;

var jx = C_Movement;
//add by jackie
var sbtype = device_type;

// This is xml http request object for dynamic fetch html
// var xhttp = null;
var THIS_PAGE = GetWebPageName(location.href);
//Get the page name, as vb.htm, GFL

var c_VideoMode = parseInt(GetCookie("VideoMode"));
//Here is not clear, GFL
g_isSupMpeg4 = (c_VideoMode == 1);

function FixViewSize() {
    if (IsMpeg4()) {
        g_viewXSize = g_mpeg4XSize;
        g_viewYSize = g_mpeg4YSize;
    } else {
        g_viewXSize = g_jpegXSize;
        g_viewYSize = g_jpegYSize;
    }
    SafeCall("UpdateViewSize");
};

FixViewSize();

//加载控件
function TagAX1(id, width, height) {
    var o = '<OBJECT ID="' + ((id == null) ? AxID : (AxID + id)) + '"';
    o += ' CLASSID="CLSID:' + AxUuid + '"';
    o += ' CODEBASE="" ' + ' width=' + width + ' height=' + height + 'events="True"' + '></OBJECT>';
    //</div>';  //change by jackie
    return o;

};
function TagAX1Auto(id, width, height) {
    var o = '<OBJECT ID="' + ((id == null) ? AxID : (AxID + id)) + '"';
    o += ' CLASSID="CLSID:' + AxUuid + '"';
    o += ' CODEBASE="" ' + ' width=' + '"' + width + '%' + '"' + ' height=' + '"' + height + '%' + '"' + 'events="True"' + '></OBJECT>';
    //</div>';  //change by jackie
    return o;

};

function IsMpeg4() {
    return ((g_isSupMpeg4 == "1") && (g_videoFormat == "1"));
};

// is mulit profile?
// H264 or support MP
function IsMP() {
    return (g_isSupportMultiProfile || g_isMP1 || g_isMP73);
};

function PopupPTZ(URL) {
    SendHttp(c_iniUrl + GetSetterCmdKV("ptzpopup", "1"), false);
    return PopupPage(URL, "PTZ", 80, 0, 455, 125);
};
function PopupPage(URL, id, x, y, w, h) {
    var windowProps = "location=no,scrollbars=no,menubars=no,toolbars=no,resizable=no,left=" + x + ",top=" + y + ",width=" + w + ",height=" + h;
    return WindowOpen(URL, id, windowProps);
};
function WindowOpen(URL, id, props) {
    var popup = window.open(URL, id, props);
    try {
        popup.focus();
    } catch (e) {
    };
};

function CheckHex(n, isQuite) {
    var i, strTemp;
    strTemp = "0123456789ABCDEF";
    if (n.length == 0) {
        if (isQuite != true)
            alert(GL("verr_vacuous", {
                1 : "hex"
            }));
        return false;
    }
    n = n.toUpperCase();
    for ( i = 0; i < n.length; i++) {
        if (strTemp.indexOf(n.charAt(i)) == -1) {
            if (isQuite != true)
                alert(GL("verr_not_hex"));
            return false;
        }
    }
    return true;
};

function GetWebPageName(url) {
    var ss = url.split("/");
    return ss[ss.length - 1];
};

function GetContentLink(key, url, type) {
    var o = "";
    o += '<span class="menuLink" onMouseOver="MainMenuIn(this,\'' + key + '\')" onMouseOut="MainMenuOut(this,\'' + key + '\')" onClick="';
    if (type == "pop") {
        o += 'PopupPTZ(\'' + url + '\');';
    } else if (type == "popHide") {
        o += 'PopupPage(\'' + url + '\',\'PTZHIDE\',10000,10000,1,1);';
    } else if (type == "card") {
        o += 'WindowOpen(\'' + url + '\',\'CARD\',\'location=yes,directorybuttons=no,scrollbars=yes,resizable=yes,menubar=yes,toolbar=yes\');';
    } else {
        o += 'ChangeContent(\'' + url + '\');';
    }
    o += '" >' + GL(key) + '</span>';
    return o;
};

function GetHalfViewSizeX() {
    return 352;
    //352;
};
function GetHalfViewSizeY() {
    return (352 * g_viewYSize) / g_viewXSize;
    //(352 * g_viewYSize) / g_viewXSize;
};

// set the object visible
function SetVisible(name, isVisible) {
    var obj = GE(name);
    if (obj != null) {
        obj.style.visibility = (isVisible) ? keyword_Show : keyword_Hide;
    }
};

// change size to Bytes,MB,GB ex: 1035 = 1.02 KB
// fixDotSize decimal point postion , default is 2
function GetCapacityString(size, fixDotSize) {
    var BASEUNIT = 1024;
    var capStr = '';
    if (fixDotSize == null || fixDotSize < 0) {
        fixDotSize = 2;
    }
    var total = parseFloat(size);
    if (total < BASEUNIT) {
        capStr = total + ' Bytes';
    } else {
        total /= BASEUNIT;
        total = total.toFixed(fixDotSize);
        if (total == parseFloat(total)) {
            total = parseFloat(total);
        }
        if (total < BASEUNIT) {
            capStr = total + ' KB';
        } else {
            total /= BASEUNIT;
            total = total.toFixed(fixDotSize);
            if (total == parseFloat(total)) {
                total = parseFloat(total);
            }
            if (total < BASEUNIT) {
                capStr = total + ' MB';
            } else {
                total /= BASEUNIT;
                total = total.toFixed(fixDotSize);
                if (total == parseFloat(total)) {
                    total = parseFloat(total);
                }
                capStr = total + ' GB';
            }
        }
    }
    return capStr;
};

// input data object and format id isDayLight ,return time string.
// timeFormat :
// 0-> YY-MM-DD
// 1-> MM-DD-YY
// 2-> DD-MM-YY
function GiveMeDateTimeString(dateObj, timeFormat, isDayLight) {
    return ((GiveMeDateString(dateObj, timeFormat, isDayLight)) + " " + (GiveMeTimeString(dateObj)));
};
function GiveMeDateString(dateObj, timeFormat, isDayLight) {
    var y, M, d;
    if (browser_FireFox) {
        y = FixNum(dateObj.getYear() + 1900, 4);
    } else {
        y = FixNum(dateObj.getYear(), 4);
    }
    M = FixNum(dateObj.getMonth() + 1, 2);
    d = FixNum(dateObj.getDate(), 2);

    var o = "";
    if (isDayLight == 1)
        o += "(+) ";

    if (timeFormat == 1) {
        o += M + "-" + d + "-" + y;
    } else if (timeFormat == 2) {
        o += d + "-" + M + "-" + y;
    } else {
        o += y + "-" + M + "-" + d;
    }
    return o;
};

function GiveMeTimeString(dateObj) {
    var h, m, s;
    h = FixNum(dateObj.getHours(), 2);
    m = FixNum(dateObj.getMinutes(), 2);
    s = FixNum(dateObj.getSeconds(), 2);
    return (h + ":" + m + ":" + s);
};

function FixNum(str, len) {
    return FixLen(str, len, "0");
};
function FixLen(str, len, c) {
    var ins = "";
    var i;
    for ( i = 0; i < len - str.toString().length; i++) {
        ins += c;
    }
    return ins + str;
};

function GetImageLeftVideo(useAX) {
    var o = "";
    if (IsMpeg4() || useAX == 1 || useAX == true) {
        o = TagAX1(null, 480, 270);
        // (984, 583)
    } else {
        o += '<table border=3 bordercolor="#99CCFF"><tr><td>';
        o += imgFetcher.GetDmsImgStr(GetHalfViewSizeX(), GetHalfViewSizeY());
        o += '</td></tr></table>';
    }
    return o;
};

// ===========================================
// about UI setting
// ===========================================
// AddLightBtn : add a light button
// GetLight : get the light status. 0:off 1:on
// SwitchLight : switch the light status, on -> off , or off -> on
// SetLightPos : set the light position.

// add a graphic buttion, can display on-off,
// it will put the image in <div> tag.
// id : the light id
// onChangeFun is a function name, ex: turnOn(), if you want to add args,
// use \"\", trunOn(\"1000\")
function AddLightBtn(id, left, top, width, height, onImg, offImg, onChangeFunc, describe) {
    var o = "";
    o += "<div id='LIGHT_" + id + "' style='position:absolute; left:" + left + "px; top:" + top + "px; width:" + width + "px; height:" + height + "px; z-index:10'><img id='LIGHT_PIC_" + id + "' src='" + offImg + "' onMouseDown='SwitchLight(\"" + id + "\");' style='cursor:pointer ' alt='" + describe + "' onMouseOver='WS(\"" + describe + "\");' onMouseLeave='WS();'></div>";
    DW(o);
    LightAry["LIGHT_" + id] = new LightInfo(id, onImg, offImg, onChangeFunc);
};

function SwitchLight(id, noAct) {
    var e = GE("LIGHT_PIC_" + id);
    // alert(e);
    if (e != null) {
        var obj = LightAry["LIGHT_" + id];
        if (obj != null) {
            //alert(obj);
            e.src = obj.switchNext(noAct);
        }
    }
};
function GetLight(id) {
    var e = LightAry["LIGHT_" + id];
    var res = 0;
    if (e != null) {
        res = e.value;
    }
    //alert(e.lowsrc);
    return res;
};
function SetLight(id, val, noAct) {
    if (GetLight(id) != val) {
        //alert(GetLight(id));
        SwitchLight(id, noAct);
    }
};
function SetLightPos(id, x, y) {
    var e = GE("LIGHT_" + id);
    if (e != null) {
        e.style.left = x;
        e.style.top = y;
    }
    //alert(e+":"+x+":"+y);
};
// the light information object
function LightInfo(id, onImg, offImg, chgFun) {
    this.id = id;
    this.onImg = onImg;
    this.offImg = offImg;
    this.value = 0;
    this.onChangeFunc = chgFun;
    this.switchNext = LightSwitchNext;
};
// switch to next status, and return the new image.
function LightSwitchNext(noAct) {
    var res;
    if (this.value == 0) {
        this.value = 1;
        res = this.onImg;
    } else {
        this.value = 0;
        res = this.offImg;
    }
    if (this.onChangeFunc != null && noAct != true) {
        if (!this.onChangeFunc()) {
            //recover
            if (this.value == 0) {
                this.value = 1;
                res = this.onImg;
            } else {
                this.value = 0;
                res = this.offImg;
            }
        }

    }
    return res;
};
var LightAry = {};

// ===========================================
// about Machine type
// ===========================================

function Is2114() {
    return (g_isSupportMQ && (g_quadMode == 0));
};

// ===========================================
// Dynamic get content. XMLHttpRequest...
// ===========================================
// use XMLHttpRequest to get the content, and put in center web page.
// isForceChange means do not check last page name, just reload it.
function ChangeContent(link, isNoHis, isForceChange) {
    if (link != null) {
        link = link.toLowerCase();
    }
    //WS((debugC++)+" : "+link);
    if (IsInBadLinkList(link)) {
        return;
    }
    if (g_lockLink) {
        WS("LOCKED...");
        return;
    }
    // alert(CONTENT_PAGE); //zdy
    g_lockLink = true;
    if (link == null) {
        link = CONTENT_PAGE;
    } else {
        CONTENT_PAGE_LAST = CONTENT_PAGE;
        if (isForceChange != true && CONTENT_PAGE == link) {
            //alert("link:"+link+":CP:"+CONTENT_PAGE);
            // avoid endless loop
            g_lockLink = false;
            return;
        }

        if (isNoHis != true) {
            if (g_backList.length > 0) {
                if (g_backList[g_backList.length - 1] != link) {
                    if (g_fwdList.length > 0) {
                        //alert(g_fwdList[g_fwdList.length-1]+"(11pop):"+g_backList[g_backList.length-1]+"(push)");
                        g_backList.push(g_fwdList.pop());
                    }
                    //alert("11:g_backList(push) :"+link);
                    g_backList.push(link);
                }

            } else {
                if (g_fwdList.length > 0) {
                    //alert(g_fwdList[g_fwdList.length-1]+"(22pop):"+g_backList[g_backList.length-1]+"(push)");
                    g_backList.push(g_fwdList.pop());
                }

                //alert("22:g_backList(push) :"+link);
                g_backList.push(link);
            }
            //      if (g_fwdList.length > 0 )
            // {
            // g_backList.push(g_fwdList.pop());
            // }
            g_fwdList = new Array();
        }

    }
    //20061211 move StopActiveX() to last, if you repeat to click the "image"
    // it will let ActiveX to stop , and can not restart.
    try {
        StopActiveX();
    } catch (e) {
    };

    CONTENT_PAGE = link;
    if (WCH != null) {
        //WCH.onreadystatechange=null;
        delete WCH;
        WCH = null;
    }
    WCH = InitXHttp();
    WCH.onreadystatechange = OnWebContentProcess;
    try {

        WCH.open("GET", "/" + link, true);
        WCH.setRequestHeader("If-Modified-Since", "1");
        // finally send the call
        WCH.send(null);
    } catch (e) {
        alert(GL("err_get_content"));
        CONTENT_PAGE = CONTENT_PAGE_LAST;
    }
};
// ALC , After Load Content
// Note: this function must call in the end of the each page.
function ALC() {
    WS("");
};

function GetViewCHHtml() {
    return '';
};

function OnWebContentProcess() {
    if (WCH == null)
        return;
    if (WCH.readyState == 4) {
        if (WCH.status == 200 || WCH.status == 401 || WCH.status == 404 || WCH.status == 403) {
            if (WCH.responseText.indexOf("var.js") >= 0)
                return;
            // var body = GE("WebContent");
            // var o = '<span style="display: none">'+I18NHtml(WCH.responseText)+'</span>';
            var o = '';
            o += GetEmptyCallback() + I18NHtml(WCH.responseText);
            // alert(o);

            // call unload function.
            CallOnUnload();
            // set_innerHTML('WebContent',o);
            setInnerHTML(GE('WebContent'), o);
            setTimeout(CallOnResize, 500);

            if (WCH.status != 200) {
                g_lockLink = false;
            }
        } else {
            alert(GL("err_get_content"));
            CONTENT_PAGE = CONTENT_PAGE_LAST;
            g_lockLink = false;
        }

    }
};

function GetEmptyCallback() {
    var o = '';
    o += '<scri' + 'pt>function MY_ONUNLOAD(){};function MY_ONLOAD(){g_lockLink = false;};function MY_CH_CHANGE(){};';
    o += 'function MY_SUBMIT_OK(){};function MY_ONRESIZE(){};function MY_BEFORE_SUBMIT(){};</scri' + 'pt>';
    return o;
};

// ===========================================
// call to content script.
// ===========================================
function CallOnUnload() {
    g_dmsRun = false;
    clearTimeout(jpegTimer);
    jpegTimer = null;
    if ( typeof (MY_ONUNLOAD) == 'function')
        MY_ONUNLOAD();
};

function CallOnResize() {

    var obj = null;
    GetBaseXY();

    if ( typeof (MY_ONRESIZE) == 'function')
        MY_ONRESIZE();
};

function VS_NO_VIEW_ALL() {
    if (g_CHID == 0)
        g_CHID = 1;
};

function WIPX(tid, ctx) {
    DW('<tr class="b1"><td width=150 height="30" >');
    DW(GL(tid) + ':</td><td >' + ctx + '</td></tr>');
};
function WIP(tid, id) {
    WIPX(tid, WH_(id));
};
function WIP1(ctx, css) {
    DW('<tr class="' + ((css == null) ? "b1" : css) + '" width=150><td colspan=2 height="30" >');
    DW(ctx + '</td></tr>');
};
function WIPSubmit(isAsync) {
    DW("<tr><td align='right' colspan=2 align=center>");
    CreateSubmitButton(null, isAsync);
    DW("</td></tr>");
};
function WIApp(id, enid, ctx) {
    DW("<tr><td height=30 class='b1'>");
    DW(WH_(id) + " " + GL(enid) + " - " + ctx + "");
    DW("</td></tr>");
};
function WIApp1(ctx) {
    DW("<tr><td height=30 class='b1' style='text-indent:3em'>" + ctx + "</td></tr>");
};
function WIAppSubmit() {
    DW("<tr><td align='right'>");
    CreateSubmitButton();
    DW("</td></tr>");
};

// ===========================================
// Checker Object
// ===========================================
// each checker has one validateObj and can link to another checker
function CheckerObj(validateObj, linkChecker) {
    this.validateObj = validateObj;
    this.linkChecker = linkChecker;
    // this.ctrlList = ctrlList;
    this.IsPass = function(ctrlObj, isQuite) {
        var res = true;
        if (this.linkChecker != null) {
            res = this.linkChecker.IsPass(ctrlObj, isQuite);
        }
        if (res == true) {
            res = this.validateObj.IsPass(ctrlObj.GV(), isQuite);
        }
        if (res == false) {
            try {
                var obj = GE(ctrlObj.id);
                obj.focus();
                obj.select();
            } catch (e) {
            };
        }
        return res;
    };
};
// ValidateObj must implement IsPass(isQuite) return ture or false
// check the string length ,range (minLen <= x <= maxLen)
function V_StrLen(minLen, maxLen, defMsg, msg) {
    //this.ctrlID = ctrlID;
    this.defMsg = defMsg;
    this.msg = msg;
    this.minLen = minLen;
    this.maxLen = maxLen;
    this.IsPass = function(val, isQuite) {
        return !(CheckBadStrLen(val, this.minLen, this.maxLen, this.defMsg, this.msg, isQuite));
    };
};
// check the string is English or number
function V_StrEnglishAndNumber(defMsg, msg, noCheckNum, noCheckLower, noCheckUpper) {
    //this.ctrlID = ctrlID;
    this.defMsg = defMsg;
    this.msg = msg;
    this.noNum = noCheckNum;
    this.noLower = noCheckLower;
    this.noUpper = noCheckUpper;
    this.IsPass = function(val, isQuite) {
        return !(CheckBadEnglishAndNumber(val, this.defMsg, this.msg, this.noNum, this.noLower, this.noUpper, isQuite));
    };
};
// check the string is English or number , add by zdy
function V_StrDeviceTitle(defMsg, msg, noCheckNum, noCheckLower, noCheckUpper) {
    //this.ctrlID = ctrlID;
    this.defMsg = defMsg;
    this.msg = msg;
    this.noNum = noCheckNum;
    this.noLower = noCheckLower;
    this.noUpper = noCheckUpper;
    this.IsPass = function(val, isQuite) {
        return !(CheckBadDeviceTitle(val, this.defMsg, this.msg, this.noNum, this.noLower, this.noUpper, isQuite));
    };
};
// check the string is English or number
function V_StrFTPPath(defMsg, msg, noCheckNum, noCheckLower, noCheckUpper) {
    //this.ctrlID = ctrlID;
    this.defMsg = defMsg;
    this.msg = msg;
    this.noNum = noCheckNum;
    this.noLower = noCheckLower;
    this.noUpper = noCheckUpper;
    this.IsPass = function(val, isQuite) {
        return !(CheckFTPPath(val, this.defMsg, this.msg, this.noNum, this.noLower, this.noUpper, isQuite));
    };
};
function V_NumRange(min, max, defMsg, msg) {
    this.min = min;
    this.max = max;
    this.defMsg = defMsg;
    this.msg = msg;
    this.IsPass = function(val, isQuite) {
        return !(CheckBadNumberRange(val, this.min, this.max, this.defMsg, this.msg, isQuite));
    }
};
function V_Empty(defMsg, msg) {
    this.defMsg = defMsg;
    this.msg = msg;
    this.IsPass = function(val, isQuite) {
        //	var ipary = val.split(".");
        //var num = parseInt(ipsry.length);
        // alert(num);
        return !(CheckIsNull(val, this.defMsg, this.msg, isQuite));
    }
};

function V_EMail(msg) {
    this.msg = msg;
    this.IsPass = function(val, isQuite) {
        return !(CheckBadEMail(val, this.msg, isQuite));
    }
};
function V_FQDN(msg) {
    this.msg = msg;
    this.IsPass = function(val, isQuite) {
        return !(CheckBadFQDN(val, this.msg, isQuite));
    }
};

function V_Hex() {
    this.IsPass = function(val, isQuite) {
        return (CheckHex(val, isQuite));
    }
};
// ===========================================
// Global validate object
// ===========================================
var gv_ipPort = new V_NumRange(1, 65535, "Port number");
var gco_ipPort = new CheckerObj(gv_ipPort);
var gv_byte = new V_NumRange(0, 255, "");
var gco_byte = new CheckerObj(gv_byte);
var gv_empty = new V_Empty(GL("text_field"));
var gco_empty = new CheckerObj(gv_empty);
var gv_email = new V_EMail();
var gco_email = new CheckerObj(gv_email, gco_empty);
var gv_FQDN = new V_FQDN();
var gco_FQDN = new CheckerObj(gv_FQDN, gco_empty);
var gv_engNum = new V_StrEnglishAndNumber("");
var gco_engNum = new CheckerObj(gv_engNum, gco_empty);
var gv_namePass = new V_StrEnglishAndNumber("Username/Password");
var gco_namePass = new CheckerObj(gv_namePass, gco_empty);
var gv_hex = new V_Hex();
var gco_hex = new CheckerObj(gv_hex, gco_empty);

function Hex2Dec(hex) {
    return parseInt(hex, 16);
};
function Dec2Hex(dec) {
    return parseInt(dec).toString(16).toUpperCase();
};
// ===========================================
// CSS style position.
// ===========================================
function SetPos(id, x, y, w, h) {
    var obj = GE(id);
    if (obj != null && obj.style != null) {
        try {
            obj.style.width = w;
            obj.style.height = h;
            obj.style.top = y;
            obj.style.left = x;
        } catch (e) {
        };
    }
};

// ============About JPEG Viewer===========
// use AJAX to replace Java Applet.
var g_maxDmsObj = 16;
var g_fetchList = {};
var jpegCounter = 0;
var jpegTimer = null;
var g_dmsRun = false;
var zeroFpsCount = 0;

function ImageFetcher(myid) {
    this.bufImg1 = new Image();
    this.bufImg2 = new Image();
    this.newImg = this.bufImg1;
    this.myID = myid;
    this.GetDmsImgStr = function(w, h) {
        //20070613 Luther fix 1280 * 960
        if (w > 720) {
            h = (720 * h) / w;
            w = 720;
        }
        return '<img src="" width="' + w + '" height="' + h + '" id="showdms_' + this.myID + '" border=0 >';
    };

    this.imgSwitch = function() {
        if (this.newImg == this.bufImg1) {
            this.newImg = this.bufImg2;
        } else {
            this.newImg = this.bufImg1;
        }
    };

    this.RunDms = function() {
        if (jpegTimer == null) {
            jpegTimer = setTimeout("JpegFrameCal()", 1000);
        }
        g_dmsRun = true;
        // this.newImg = new Image();
        this.imgSwitch();
        // var d = g_dmsList[id];
        var obj = GE("showdms_" + this.myID);
        if (obj != null) {
            this.newImg.id = "showdms_" + this.myID;
            this.newImg.onload = DmsOK;
            this.newImg.src = "/dms?" + Math.random();
        }
    };

};
function DmsOK() {
    //id = 0;
    var z = 1;
    if (GE("zoomSel") != null) {
        z = parseInt(GetValue("zoomSel"));
    }
    //var obj = GE("showdms_"+this.myID);
    var obj = GE("showdms_0");
    if (obj != null) {
        var p = obj.parentNode;
        p.removeChild(obj);
        var b = imgFetcher.newImg;
        if (CONTENT_PAGE == "main.htm") {
            b.width = g_viewXSize * z;
            b.height = g_viewYSize * z;
        } else {
            b.width = obj.width;
            b.height = obj.height;
        }
        p.appendChild(b);
        // alert("g_dmsRun="+g_dmsRun+" g_lockLink="+g_lockLink);
        if (g_dmsRun && !g_lockLink)
            setTimeout("imgFetcher.RunDms()", 5);
        jpegCounter++;
    }

};

var imgFetcher = new ImageFetcher(0);
g_fetchList[0] = imgFetcher;
function JpegFrameCal() {
    WS(jpegCounter + " fps");
    if (jpegCounter == 0) {
        zeroFpsCount++;
    } else {
        zeroFpsCount = 0;
    }
    jpegCounter = 0;
    if (g_dmsRun && !g_lockLink) {
        jpegTimer = setTimeout("JpegFrameCal()", 1000);
    }
    if (zeroFpsCount >= 10) {
        zeroFpsCount = 0;
        // this is not good.
        // alert("RESTART DMS");
        var n;
        for (n in g_fetchList) {
            var obj = GE("showdms_" + n);
            // alert("n="+n+" obj="+obj);
            if (obj != null) {
                g_fetchList[n].RunDms();
            }
        }

    }
};

function InitLoad() {
    var datekey = (new Date()).getTime();
    loadJS("setInnerHTML.js");
    loadJS("../lang/" + "lang_" + g_langName + ".jsl?" + datekey);
    loadJS("override.js");
};

// 20080204 Luther add ---START---
function GetCookie(name) {
    var cname = name + "=";
    var dc = document.cookie;
    if (dc.length > 0) {
        begin = dc.indexOf(cname);
        if (begin != -1) {
            begin = begin + cname.length;
            end = dc.indexOf(";", begin);
            if (end == -1) {
                end = dc.length;
            }
            return dc.substring(begin, end);
        }
    }
    return null;
};

function SetCookie(name, value, expires) {
    CookiesExpDay = "365";
    var time = new Date();
    time.setTime(time.getTime() + ((86400000) * CookiesExpDay));
    if (expires == null) {
        expires = "";
    }
    document.cookie = name + "=" + value + ";expires=" + time.toGMTString();
};

function SaveCombo(id, cookieName) {
    var obj = GE(id);
    if (obj != null) {
        var ix = obj.selectedIndex;
        if (ix >= 0) {
            SetCookie(cookieName, obj.options[obj.selectedIndex].value);
        }
    }
};
function GetCookieInt(name, def) {
    var i = parseInt(GetCookie(name));
    if (isNaN(i)) {
        i = def;
    }
    return i;
};
// 20080204 Luther add --- END ---
// 20080205 Luther add ---START---
// add safe function call
function SafeCall(strFun) {
    //if (typeof(eval(strFun)) != "undefined")
    if (eval("typeof " + strFun + " != 'undefined'")) {
        eval(strFun + "()");
    }
};

// 20080205 Luther add --- END ---
// 20080216 Luther add ---START---
// copy from internet, get the
function Point(_x, _y) {
    this.x = _x;
    this.y = _y;
};
function RealPosition(_obj) {
    var currPos = new Point(_obj.offsetLeft, _obj.offsetTop);
    var workPos = new Point(0, 0);
    if (_obj.offsetParent.tagName.toUpperCase() != "BODY") {
        workPos = RealPosition(_obj.offsetParent);
        currPos.x += workPos.x;
        currPos.y += workPos.y;
    }
    return currPos;
};
// 20080216 Luther add --- END ---

function GetBaseXY() {
    var obj = GE("theObjTable");
    if (obj != null) {
        var p = RealPosition(obj);
        baseY = p.y;
        baseX = p.x;
    }
};

// ======IMAGE=======
// SCR : Submit Change Right now.
function SCR(key) {
    var obj = CTRLARY[key];
    if (obj != null) {
        SendHttp(c_iniUrl + GetSetterCmd(obj, GetCCV(key)), false);
    }
};

// restore date back to Data Content List.
function SaveDCL() {
};

function UpdateGSizeLite() {
    var z = GetLiteStreamNum();
    g_viewXSize = eval("g_s" + z + "XSize");
    g_viewYSize = eval("g_s" + z + "YSize");
}

function GetFirstShowMode() {
    //for alignment so break the format
    if (g_isSupS5)
        return 5;
    if (g_isSupS2)
        return 2;
    if (g_isSupS1)
        return 1;
    if (g_isSupS6)
        return 6;
    if (g_isSupS3)
        return 3;
    if (g_isSupS4)
        return 4;
};

function GetLiteStreamNum() {
    if (g_isSupS1)
        return 1;

    if (g_isSupS3)
        return 3;

    if (g_isSupS6)
        return 6;
    if (g_isSupS2)
        return 2;
    if (g_isSupS5)
        return 5;
    if (g_isSupS4)
        return 4;
}

function Get9001FirstCodec(sel) {
    if (isNaN(sel)) {
        sel = GetLiteStreamNum();
    }
    switch(sel) {
        case 2:
        case 3:
            return V_MPEG4;
        case 5:
        case 6:
            return V_H264;
        //case 1:
        //case 4:
        default:
            return V_JPEG;
        //V_JPEG = 1000
    }
}

// select language
function SelLang() {
    var lang = document.getElementById("lang").selectedIndex;
    if (lang == 0)
        SendHttp(c_iniUrl + GetSetterCmdKV("supportmui", "2"), false);
    else
        SendHttp(c_iniUrl + GetSetterCmdKV("supportmui", "1"), false);
    Refresh();
}

function LangChange() {
    if (g_s_mui == 2)
        document.getElementById("lang").selectedIndex = 0;
    else
        document.getElementById("lang").selectedIndex = 1;
}

// common function to adation component by wgw
function adaptionComponent(container, target, radio, margin) {
    width = document.getElementById(container).offsetWidth - margin;
    height = document.getElementById(container).offsetHeight;

    if (width / height > radio) {
        target_width = height * radio;
        target_height = height;
        $("#" + target).css({
            "width" : target_width,
            "height" : target_height,
            "position" : "absolute",
            "left" : (width - target_width) / 2,
            "top" : 0
        });
        $("#" + target).css("width:" + height * radio + "  height:" + height + "  left:" + (width - target_width) / 2 + "  top:0");

    } else if (width / height < radio) {
        target_width = width;
        target_height = width / radio;
        $("#" + target).css({
            "width" : width,
            "height" : width / radio,
            "position" : "absolute",
            "left" : 0,
            "top" : (height - target_height) / 2
        });
        $("#" + target).css("width:" + width + "  height:" + width / radio + "  left:0" + "  top:" + (height - target_height) / 2);

    }
}

function WritePreview() {
    var o = '';
    o += '<div id="ocx_outer">';
    o += WriteVideoCtrl();
    o += '<div>';
    o += WriteVideoEnd();
    o += '</div>';
    //alert(o);
    DW(o);
}

function WriteVideoCtrl() {
    var o = '';
    o += '<div id="ocx_video">';
    //o += '<table align="center">';
    o += TagAX1Auto(null, 81.6, 100);
    // (80%, 100%)
    //o += '</table>';
    o += '</div>';
    return o;
}

//sysinfo.htm

function WIPSys(tid, ctx) {
    var o = '';
    o += '<tr><td class="color">';
    o += '&nbsp;&nbsp;' + GL(tid) + '</td>';

    o += '<td class="nocolor">&nbsp;&nbsp;' + ctx;
    o += '</td></tr>';
    DW(o);
}

function WIPSysTitle(tid, ctx) {
    var o = '';
    o += '<tr><td class="color">';
    o += '&nbsp;' + GL(tid) + '</td>';

    o += '<td class="nocolor">&nbsp;';
    o += '<input id="devtitle" type="text" maxlength=14 value= "';
    o += ctx + '"/>';
    o += '</td></tr>';
    DW(o);
}

function WSubmitSys() {
    var o = '';
    o += '<div id="syssub">';
    o += '<input type="button" value="submit" onclick="submittitle()">';
    o += '</div>';
    DW(o);
}

function submittitle() {
    SendHttp(c_iniUrl + GetSetterCmdKV("title", 1), false);
}

function V_UmPort() {
    this.IsPass = function(val, isQuite) {
        return (CheckUmPort(val, isQuite));
    }
}

function CheckUmPort(port, isQuite) {
    var num = parseInt(port);
    if ((num >= 2000 && num <= 65535)) {
        return true;
    } else {
        if (isQuite != true)
            alert("Bad Multicast port:\nOnly 2000~65535 are acceptable.");
        return false;
    }
}

function isUMEnable1() {
    CTRLARY["umipaddr1"].Disable(GetCCV("useUniMul1") == 0);
    CTRLARY["port1"].Disable(GetCCV("useUniMul1") == 0);
}

function FixTime1() {
    document.getElementById("timeposition1").disabled = (GetCCV("timestampenable1") == 0);
}

function FixText1() {
    document.getElementById("overlaytext1").disabled = (GetCCV("textenable1") == 0);
    CTRLARY["textposition1"].Disable(GetCCV("textenable1") == 0);
}

function V_UmPort() {
    this.IsPass = function(val, isQuite) {
        return (CheckUmPort(val, isQuite));
    };
};

// check port //ZDY
function CheckUmPort(port, isQuite) {
    var num = parseInt(port);
    if ((num >= 2000 && num <= 65535)) {
        return true;
    } else {
        if (isQuite != true)
            alert("Bad Multicast port:\nOnly 2000~65535 are acceptable.");
        return false;
    }
}

var gv_umPort = new V_UmPort();
var gco_umPort = new CheckerObj(gv_umPort);
//common.js function

// check user exist or not
var USER_NOT_EXIST = 0xF0E;
var USER_LIST_FULL = 0xF0F;

function checkUserExist(cname) {
    var retv = USER_LIST_FULL;
    alert("in the common.js!!");
    //----------------add 提示
    for (var i = 0; (i * 2) < userStr.length; i++) {
        if (cname == userStr[i * 2]) {
            retv = i;
            break;
        } else if ("" == userStr[i * 2]) {
            retv = USER_NOT_EXIST;
        }
    }
    SendHttp(c_iniUrl + GetSetterCmdKV("loginuser", cname), false);

    return retv;
}

// check char is chinese or not
function isChinese(ch) {
    var chinese = "[\u0391-\uFFE5]";
    if (ch.match(chinese))
        return true;
    return false;
}

// check username or password invalid or not
function isInvalid(ch) {
    var invalidch = "~\'\"\"`!@#$%^&*()[]{}+=-|\\\'/？,，。.<>:;";
    if (invalidch.indexOf(ch) != -1)
        return true;
    return false;
}

// check  mail invalid or not
function isMailInvalid(ch) {
    var invalidch = "~\'\"\"`!#$%^&*()[]{}+=-|\\\'/？,，。<>:;";
    if (invalidch.indexOf(ch) != -1)
        return true;
    return false;
}

// check path invalid or not
function isPathInvalid(ch) {
    var invalidch = "~\'\"`!@#$%^&*()[]{}+=-|/？,，。.<>;";
    if (invalidch.indexOf(ch) != -1)
        return true;
    return false;
}

function WriteVideo() {
    var o = '';
    o += '<div id="ocx_object">';
    o += TagAX1Auto(null, 100, 100);
    //
    o += '</div>';
    DW(o);
}

function WriteVideopmask() {
    var o = '';
    o += '<div id="ocx_object">';
    o += TagAX1Auto(null, 0, 0);
    //
    o += '</div>';
    DW(o);
}

//有更简洁点的代码，第一版在 denoise.js中，希望以后可以更简单  2015-6-3 by wgw
function PViewGet(action_itemjson) {
    SendHttp(c_iniUrl + GetSetterCmdKV("camera_parameters_get", action_itemjson), false, GetResult);
    var txt = g_resultTxt;
    var response = null;
    var back = null;
    var backjson = null;
    if ((txt.indexOf("OK camera_parameters_get") >= 0) && (txt.indexOf("POWER_VIEW") >= 0)) {
        back = txt.substring(36);
    }
    backjson = JSON.parse(back);
    //转换为json
    return backjson;
}

function PViewGetDPosition() {
    var value = 0;
    var strvalue = null;
    var cmd = null;
    var i = 0;
    var actionjson = {
        "Factory" : "POWER_VIEW",
        "Type" : "PV8340-F2",
        "Action_Item" : "3D_Positioning",
        "Param" : "0"
    };
    cmd = JSON.stringify(actionjson);

    var getinfojson = PViewGet(cmd);
    if (getinfojson != null) {
        strvalue = getinfojson.Param;
        //alert(strvalue);
        if (strvalue == "Off") {
            value = 0;
        }
        if (strvalue == "On") {
            value = 1;
        }
    } else {
    }
    return value;
}

/********add by jackie 2014年7月23日11:07:45*********************************
 功能：创建文件夹
 参数：folder，创建文件夹的路径
 ****************************************************************************/
function creatfolder(folder) {
    var strFolder = folder;
    var objFSO = new ActiveXObject("Scripting.FileSystemObject");
    if (!objFSO.FolderExists(strFolder)) {
        // 创建文件夹
        var strFolderName = objFSO.CreateFolder(strFolder);
    }
}

/**add by jackie 2014年7月23日11:07:45**************
 功能：写文件
 参数：filename，文件名字；filecontent，写入文件的内容
 ****************************************************/
function writeFile(filename, filecontent) {
    var fso, f, s;
    fso = new ActiveXObject("Scripting.FileSystemObject");
    f = fso.OpenTextFile(filename, 8, true);
    f.WriteLine(filecontent);
    f.Close();
    //alert('ok');
}

//------------------------------------------------
//过期不用的方法
function RecordVideo() {
    var mydate = new Date();
    var date = GiveMeDateString(mydate, 0, 0);
    var time = GiveMeTimeString(mydate);
    //var recname = recpath + "record_" + gv_ip1 + "_" + date + "_" + time + ".ts";
    creatfolder("d:\\bit");
    var path = "d:\\bit\\video\\";
    creatfolder(path);
    var xs = "";
    xs = "录像已存至" + path;
    var obj = GE(AxID);
    if (obj != null) {
        try {
            obj.RecordVideo(path);
            alert(xs);
        } catch (e) {
        }
    }
}

// stop record
function StopRecordVideo() {

    var obj = GE(AxID);
    if (obj != null) {
        try {
            obj.StopRecordVideo();
            //window.save_flag = 1;
            // ChangeSavePic();
        } catch (e) {
        }
    }
}

// pause
function Pause() {
    var obj = GE(AxID);
    if (obj != null) {
        try {
            obj.togglePause();
            // window.pause_flag = 1;
            // ChangeStartPic();
        } catch (e) {
        }
    }
}

function ChangeActive() {
    for (var key in CTRLARY) {
        var obj = CTRLARY[key];
        // alert(obj.active);
        obj.active = 1;
    }
}

function GetRadioRsch(list, id) {
    var o = '';
    o += '<td>';
    o += GetRadioCtrlHtml(list, id, 0);
    //zdy
    o += GL("run_infinite_times");
    o += '</td>';
    o += '<td >';
    o += GetRadioCtrlHtml(list, id, 1);
    o += '</td>';
    return o;
};
function GetCtrlRsch(id) {
    var res = '';
    var obj = CTRLARY[id];
    if (obj != null) {
        res = GetRadioRsch(CTRLARY, id);
    }
    return res;
}

function WHRsch(id) {
    DW('<tr>');
    DW(GetCtrlRsch(id));
}

/* add by dsl, 2013-9-11 */
function WriteImgtuneVideoHidden() {
    var o = '';
    o += '<div>';
    o += TagAX1(null, 0, 0);
    o += '</div>';
    DW(o);
}

/*end added, dsl, 2013-9-11 */

StringBuffer = function() {
    var col = [];
    this.Add = function(s) {
        col.push(s);
    };
    this.ToString = function() {
        return col.join("");
    };
};

// ==================================
// Luther add String trim function
// ==================================
String.prototype.trim = function() {
    return this.replace(/(^\s*)|(\s*$)/g, "");
};
String.prototype.ltrim = function() {
    return this.replace(/(^\s*)/g, "");
};
String.prototype.rtrim = function() {
    return this.replace(/(\s*$)/g, "");
};
// return the count of space, &nbsp;...
function addBackSpace(count) {
    var o = new StringBuffer();
    for (var i = 0; i < count; i++) {
        o.Add("&nbsp;");
    }
    return o.ToString();
};

function IsMozilla() {
    return (browser_Netscape || browser_FireFox);
};
// initialize language name.
{
    var o = '';
    var t = g_s_mui;
    var i = 0;
    while (t > 0) {
        if (t % 2 == 1) {
            o += g_langFullNameList[i] + ";";
        }
        t = Math.floor(t / 2);
        i++;
    }
    o = o.substring(0, o.length - 1);
    g_langNameList = o.split(";");

    if (g_langNameList.length == 0 || g_mui < 0 || g_langNameList[0] == "")
        g_langName = "en_us";
    else if (g_langNameList.length == 1)
        g_langName = g_langNameList[0];
    else
        g_langName = g_langFullNameList[g_mui];
};

// check brower type, and set show ,hide keyword.
if (window.ActiveXObject) {
    browser_IE = true;
    keyword_Show = "visible";
    keyword_Hide = "hidden";
} else if (document.layers) {
    browser_Netscape = true;
    keyword_Show = "show";
    keyword_Hide = "hide";
} else {
    browser_FireFox = true;
    keyword_Show = "visible";
    keyword_Hide = "hidden";
}

function IsVS() {
    return false;
};

function IsInBadLinkList(link) {
    if (link == null || link == "")
        return false;
    link = link.toLowerCase();
    for (var i = 0; i < g_badLinkList.length; i++) {
        if (TestRE(link, g_badLinkList[i])) {
            return true;
        }
    }
    return false;
};

// get object from id
function GE(name) {
    return document.getElementById(name);
};
// get obj array from name
function GES(name) {
    return document.getElementsByName(name);
};
// genernate the "select" html tag
function SelectObject(strName, strOption, intValue, onChange) {
    DW(SelectObjectNoWrite(strName, strOption, intValue));
};
function SelectObjectNoWrite(strName, strOption, intValue, onChange) {
    // alert(onChange);
    var o = '';
    o += '<SELECT NAME="' + strName + '" id="' + strName + '" class="m1"';
    if (onChange == null) {
        o += '>';
    } else {
        o += ' onchange="' + onChange + '" >';
    }
    aryOption = strOption.split(';');
    for (var i = 0; i < aryOption.length; i++) {
        if (i == intValue) {
            o += '<OPTION selected value=' + i + '>' + aryOption[i];
        } else {
            o += '<OPTION value=' + i + '>' + aryOption[i];
        }
    }
    o += '</SELECT>';
    return o;
};

// Genernate "select" , the value is number
// include start and end
function CreateSelectNumber(name, start, end, gap, init) {
    DW(GetSelectNumberHtml(name, start, end, gap, init));
};
// fixNum : the digital fix count.
function GetSelectNumberHtml(name, start, end, gap, init, onChange, onFocus, fixNumC) {
    var o = '';
    o += '<select id="' + name + '" name="' + name + '" class="m1" ';
    if (onChange != null) {
        o += ' onchange="' + onChange + '"';
    }
    if (onFocus != null) {
        o += ' onfocus="' + onFocus + '"';
    }
    o += '>';
    var i = 0;
    for ( i = start; i <= end; i += gap) {
        var fixStr = i;
        if (fixNumC != null) {
            fixStr = FixNum(i, fixNumC);
        }
        if (i == init) {
            o += '<option selected value=' + i + '>' + fixStr;
        } else {
            o += '<option value=' + i + '>' + fixStr;
        }
    }
    o += '</select>';
    return o;
};

// return the radio button that be checked.
function GetRadioValue(name) {
    var value = 0;
    var i;
    var radioObj = GES(name);
    if (radioObj != null) {
        for ( i = 0; i < radioObj.length; i++) {
            if (radioObj[i].checked == true) {
                value = radioObj[i].value;
                break;
            }
        }
    }
    return value;
};
// if radio button value equal vv , then check this option.
function SetRadioValue(name, vv) {
    var i;
    var radioObj = GES(name);
    if (radioObj != null) {
        for ( i = 0; i < radioObj.length; i++) {
            if (radioObj[i].value == vv) {
                radioObj[i].checked = true;
                break;
            }
        }
    }
};

function CreateText(name, size, maxlength, value, isPassword, onChangeFunc) {
    DW(CreateTextHtml(name, size, maxlength, value, isPassword, onChangeFunc));
};
function CreateTextHtml(name, size, maxlength, value, isPassword, onChangeFunc, onKeyUP) {
    var type = "text";
    if (isPassword) {
        type = "password";
    }
    var o = '';
    o += "<input name='" + name + "' id='" + name + "' type='" + type + "' size='" + size + "' class='m1' maxlength='" + maxlength + "' value='" + value + "'";
    //<input name= currentCameraDate id = currentCameraDate type= text size=15 class=m1 maxlength =15 value = '' >
    if (onChangeFunc != null) {
        o += "onChange='" + onChangeFunc + "' ";
    }
    if (onKeyUP != null) {
        o += "onKeyup='" + onKeyUP + "' ";
    }
    o += ">";
    return o;
};

// ===================================================
// Validate
// ===================================================
// test the reqular expression , v is value, re is regualar expression
function TestRE(v, re) {
    return new RegExp(re).test(v);
};

// check the string is null or blank.
// return ture -> str is not null or ""
// return false -> str is
function CheckIsNull(str, defMsg, msg, isQuite) {
    var result = false;
    if (CheckIsNullNoMsg(str)) {
        if (isQuite != true) {
            if (msg != null) {
                alert(msg);
            } else {
                alert(GL("verr_vacuous", {
                    1 : defMsg
                }));
            }
        }
        result = true;
    }
    return result;
};
function CheckIsNullNoMsg(str) {
    return (str == null || str == "");
};
// ===================================================
// check E-Mail
function CheckBadEMail(str, msg, isQuite) {
    var result = false;
    if (!TestRE(str, '^[-!#$%&\'*+\\./0-9=?A-Z^_`a-z{|}~]+@[-!#$%&\'*+\\/0-9=?A-Z^_`a-z{|}~]+\.[-!#$%&\'*+\\./0-9=?A-Z^_`a-z{|}~]+$')) {
        if (isQuite != true) {
            if (msg == null) {
                alert(GL("verr_email"));
            } else {
                alert(msg);
            }
        }
        result = true;
    }
    return result;
};

function IsNumeric(sText) {
    var ValidChars = "0123456789";
    var IsNumber = true;
    var i;
    var Char;
    for ( i = 0; i < sText.length && IsNumber == true; i++) {
        Char = sText.charAt(i);
        if (ValidChars.indexOf(Char) == -1) {
            IsNumber = false;
        }
    }
    return IsNumber;
}

function CheckBadFQDN(str, msg, isQuite) {
    var result = false;
    //var strRE = "^\w([\w\-]+\.)+\w+$";
    rObj = new RegExp("^\\w([\\w-]+\\.)+\\w+$");
    if (!str.match(rObj)) {
        if (isQuite != true) {
            if (msg == null) {
                alert("URL/Address is not correct.");
            } else {
                alert(msg);
            }
        }
        result = true;
    }
    return result;
};

// ===================================================
// check the range of number.

// check the range of number ,include min and max ( min <= x <= max)
// true: the number(str) is not in the range.
function CheckBadNumberRange(str, min, max, defMsg, msg, isQuite) {
    var result = false;
    var num = parseInt(str);
    if (!((num >= min && num <= max) && (IsNumeric(str)))) {
        if (isQuite != true) {
            if (msg == null) {
                alert(GL("verr_bad_num", {
                    1 : defMsg,
                    2 : min,
                    3 : max
                }));
            } else {
                alert(msg);
            }
        }
        result = true;
    }
    return result;
};
// ===================================================
// check the length of the string.
// true: if the length of the string is not in range(minLen <= x <= maxLen)
function CheckBadStrLen(str, minLen, maxLen, defMsg, msg, isQuite) {
    var result = false;
    if (str == null) {
        result = true;
    } else {
        var len = str.length;
        if (!(len >= minLen && len <= maxLen)) {
            if (isQuite != true) {
                if (msg == null) {
                    if (minLen != maxLen) {
                        alert(GL("verr_str_len", {
                            1 : defMsg,
                            2 : minLen,
                            3 : maxLen
                        }));
                    } else {
                        alert(GL("verr_str_len2", {
                            1 : defMsg,
                            2 : minLen
                        }));
                    }
                } else {
                    alert(msg);
                }
            }
            result = true;
        }
    }
    return result;
};

function CheckBadEnglishAndNumber(str, defMsg, msg, noCheckNum, noCheckLower, noCheckUpper, isQuite) {
    var result = false;
    if (str == null) {
        result = true;
    } else {
        var i = 0;
        for ( i = 0; i < str.length; i++) {
            var cc = str.charCodeAt(i);
            var checker = true;
            // true : means baddly.
            if (noCheckNum == null || noCheckNum == false) {
                checker = checker && !(cc >= 48 && cc <= 57);
            }
            if (noCheckLower == null || noCheckLower == false) {
                //checker = checker && !(cc >= 97 && cc <= 122);
                checker = checker && !(cc >= 97 && cc <= 122);
            }
            if (noCheckUpper == null || noCheckUpper == false) {
                checker = checker && !(cc >= 65 && cc <= 90);
            }
            if (checker) {
                if (isQuite != true) {
                    if (msg == null) {
                        alert(GL("verr_eng_digital", {
                            1 : defMsg
                        }));
                    } else {
                        alert(msg);
                    }
                }
                result = true;
                break;
            }
        }
    }
    return result;
};
//check camara titile include English, Number and '_', zdd by zdy
function CheckBadDeviceTitle(str, defMsg, msg, noCheckNum, noCheckLower, noCheckUpper, isQuite) {
    var result = false;
    if (str == null) {
        result = true;
    } else {
        var i = 0;
        for ( i = 0; i < str.length; i++) {
            var cc = str.charCodeAt(i);
            var checker = true;
            // true : means baddly.
            if (noCheckNum == null || noCheckNum == false) {
                checker = checker && !(cc >= 48 && cc <= 57);
            }
            if (noCheckLower == null || noCheckLower == false) {
                checker = checker && !(cc >= 97 && cc <= 122) && !(cc == 95);
            }
            if (noCheckUpper == null || noCheckUpper == false) {
                checker = checker && !(cc >= 65 && cc <= 90);
            }
            if (checker) {
                if (isQuite != true) {
                    if (msg == null) {
                        alert(GL("verr_eng_digital_", {
                            1 : defMsg
                        }));
                    } else {
                        alert(msg);
                    }
                }
                result = true;
                break;
            }
        }
    }
    return result;
};
// check string , include the non alphabet or digital char.
// true : found non alphabet or digital char, False: all chars are belong alphabet or digital number
// noCheckNum : do not check digital number. it's mean only check alphabet
// noCheckLower: do not check lower alphabet,
// noCheckLower: do not check upper alphabet,
function CheckFTPPath(str, defMsg, msg, noCheckNum, noCheckLower, noCheckUpper, isQuite) {
    var result = false;
    if (str == null) {
        result = true;
    } else {
        var i = 0;
        for ( i = 0; i < str.length; i++) {
            var cc = str.charCodeAt(i);
            var checker = true;
            // true : means baddly.
            if (noCheckNum == null || noCheckNum == false) {
                checker = checker && !(cc >= 47 && cc <= 57);
            }
            if (noCheckLower == null || noCheckLower == false) {
                checker = checker && !(cc >= 97 && cc <= 122) && !(cc == 95);
            }
            if (noCheckUpper == null || noCheckUpper == false) {
                checker = checker && !(cc >= 65 && cc <= 90);
            }
            if (checker) {
                if (isQuite != true) {
                    if (msg == null) {
                        alert(GL("verr_ftp_eng_dig", {
                            1 : defMsg
                        }));
                    } else {
                        alert(msg);
                    }
                }
                result = true;
                break;
            }
        }
    }
    return result;
};

function DW(str) {
    document.write(str);
};
// ===================================================
// Submit the form
// ===================================================
// create the submit button
// CLID: Control List ID
function CreateSubmitButton(CLID, isAsync) {
    // alert("CreateSubmitButton_");
    DW(CreateSubmitButton_(CLID, isAsync));
};
function CreateSubmitButton_(CLID, isAsync) {
    // alert("CreateSubmitButton_");
    // alert(g_lockLink);
    var fun = "ValidateCtrlAndSubmit";
    fun += ((CheckIsNullNoMsg(CLID)) ? "(CTRLARY" : ("(" + CLID));
    fun += ((CheckIsNullNoMsg(isAsync)) ? "" : ("," + isAsync));
    fun += ")";
    // alert(fun+isAsync);
    var o = '';
    o += '<input type="button" id="smbtn_' + ((CLID == null) ? "" : CLID) + '" value="' + GL("submit") + '" class="m1" onClick="' + fun + '" style="width:80px;height:30px">';
    //  alert(o);
    return o;

};

function SendHttp(url, isAsync, callBack) {
    //alert("IN the SendHttp!!");
    //isAsync = new Boolean(isAsync);
    g_SubmitHttp = null;
    g_SubmitHttp = InitXHttp();
    if (callBack != null) {
        g_SubmitHttp.onreadystatechange = callBack;
    } else {
        g_SubmitHttp.onreadystatechange = OnSubmitReadyStateProcess;
    }

    try {
        g_SubmitHttp.open("GET", url, isAsync);
        g_SubmitHttp.setRequestHeader("If-Modified-Since", "0");
        g_SubmitHttp.send(null);
        WS(GL("sending_"));
    } catch (e) {
    };

};

function OnSubmitReadyStateProcess() {
    // alert("OnSubmitReadyStateProcess");
    if (g_SubmitHttp.readyState == 4) {
        if (g_SubmitHttp.status != 200) {
            alert(GL("err_submit_fail"));
            g_httpOK = false;
            WS(GL("fail_"));
        } else {
            g_httpOK = true;
            WS(GL("ok_"));
        }
    }
};

var g_resultTxt = "";

function GetResult() {
    g_resultTxt = "";
    if (g_SubmitHttp.readyState == 4) {
        if (g_SubmitHttp.status == 200) {
            g_resultTxt = g_SubmitHttp.responseText;
        }
    }
}

function SendCallBack() {
    // alert("SendCallBack");
    // alert(g_SubmitHttp.readyState);
    // alert(g_SubmitHttp.status);
    if (g_SubmitHttp.readyState == 4) {
        if (g_SubmitHttp.status == 200) {
            var txt = g_SubmitHttp.responseText;
            // alert(txt);
            if (txt.indexOf("NG") >= 0) {
                alert(GL("err_submit_fail"));
                g_httpOK = false;
                WS(GL("fail_"));
                // alert(g_httpOK);
            } else {
                MY_SUBMIT_OK();
                g_httpOK = true;
                WS(GL("ok_"));
            }

        } else {
            alert(GL("err_submit_fail"));
            g_httpOK = false;
            WS(GL("fail_"));
        }
    }

}

function SendImgCallBack() {
    // alert("SendImgCallBack");
    // alert(g_SubmitHttp.readyState);
    // alert(g_SubmitHttp.status);
    if (g_SubmitHttp.readyState == 4) {
        if (g_SubmitHttp.status == 200) {
            var txt = g_SubmitHttp.responseText;
            // alert(txt);
            if (txt.indexOf("NG") >= 0 || txt.indexOf("UW") >= 0) {
                alert(GL("err_submit_fail"));
                g_httpOK = false;
                WS(GL("fail_"));
            } else {
                MY_SUBMIT_OK();
                g_httpOK = true;
                WS(GL("ok_"));
            }

        } else {
            alert(GL("err_submit_fail"));
            g_httpOK = false;
            WS(GL("fail_"));
        }
    }
}

function IsChecked(name) {
    var obj = GE(name);
    var result = false;
    if (obj != null) {
        result = obj.checked;
    }
    return result;
};
function SetChecked(name, isChk) {
    var obj = GE(name);
    if (obj != null) {
        obj.checked = isChk;
    }
};
function Bool2Int(data) {
    return (data) ? 1 : 0;
};
// ===================================================
// Get the value form the object.
// ===================================================
// return obj.value
// noErr: true do not show error message.
function GetValue(name, noErr) {
    var result = '';
    var obj = GE(name);
    if (obj != null) {
        if (obj.type.indexOf("select") >= 0) {
            var ix = obj.selectedIndex;
            if (ix < 0) {
                result = -1;
            } else {
                result = obj.options[ix].value;
            }
        } else {
            result = obj.value;
        }
    } else if (noErr != true) {
        alert(GL("verr_miss_obj", {
            1 : name
        }));
    }
    return result;
};

// ===================================================
// set the value of the object.
// ===================================================
function SetValue(name, value) {
    var obj = GE(name);
    if (obj != null) {
        if (obj.type.indexOf("select") >= 0) {
            for (var i = 0; i < obj.options.length; i++) {
                if (obj.options[i].value == value) {
                    obj.selectedIndex = i;
                    break;
                }
            }
        } else {
            obj.value = value;
        }
    } else {
        alert(GL("verr_set_value", {
            1 : name
        }));
    }
};

/*  Following add by zdy, 2012-11-22  */
function Refresh() {
    window.location.reload();
    //Refesh web page
}

function InitXHttp() {
    var xhttp = null;
    if (IsMozilla()) {
        xhttp = new XMLHttpRequest();
        if (xhttp.overrideMimeType) {
            xhttp.overrideMimeType('text/xml');
        }
    } else if (browser_IE) {
        try {
            xhttp = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            try {
                xhttp = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) {
            };
        }
    }
    return xhttp;
};

function DisableObject(name, isDisable) {
    var obj = GE(name);
    if (obj != null) {
        obj.disabled = isDisable;
    }
    try {
        SetCIA(name, !isDisable);
    } catch (e) {
    };

    var objs = GES(name);
    if (objs != null) {
        for (var i = 0; i < objs.length; i++) {
            objs[i].disabled = isDisable;
        }
    }
};
function DisableObjs(list, isDisable) {
    for (var i = 0; i < list.length; i++) {
        DisableObject(list[i], isDisable);
    }
};

// get Select Object ,be select text not index
function GetSelectText(name) {
    var oo = "";
    var obj = GE(name);
    if (obj != null) {
        var ix = obj.selectedIndex;
        if (ix >= 0) {
            oo = obj.options[obj.selectedIndex].text;
        }
    }
    return oo;
};

function CheckBadFqdnLen(str, msg) {
    var result = false;
    if (str.length > v_maxFqdnLen) {
        alert(msg);
        result = true;
    }
    return result;
};

// ===========================================
// I18N,
// ===========================================
// GL : GetLanguage
// name: is the key of the i18n string,
function GL(name, va) {
    name = LangKeyPrefix + name;
    var v = ( typeof (LAry[name]) == "undefined") ? GetDefaultStr(name) : LAry[name], n;

    if (va) {
        for (n in va)
        v = this.ReplaceVar(v, n, va[n]);
    }
    return v;
};

// string replace
// the {$xxx} will be treat a variable, and replace it.
// h: the origional string, r:replace key(no $ sign.),v: replace value.
function ReplaceVar(h, r, v) {
    //debug
    // alert("h="+h+"r="+r+"v="+v);
    // alert(h.replace(new RegExp('{\\\$' + r + '}', 'g'), v));
    return h.replace(new RegExp('{\\\$' + r + '}', 'g'), v);
};

function GetDefaultStr(v) {
    v = v.substring(LangKeyPrefix.length, v.length);
    return v.replace(new RegExp("_", "g"), " ");
};

function AddLangs(ar) {
    for (var key in ar) {
        if ( typeof (ar[key]) == 'function')
            continue;
        // debug
        // alert((key.indexOf(LangKeyPrefix) == -1 ? LangKeyPrefix : '') + key);
        // alert(ar[key]);
        LAry[(key.indexOf(LangKeyPrefix) == -1 ? LangKeyPrefix : '') + key] = ar[key];
    }
};

// replace content key word to I18N .
function I18NHtml(src) {
    var len = LangKeyPrefix.length;
    for (var key in LAry) {
        //alert(key.substring(len,key.lenght) +" : "+LAry[key]);
        src = ReplaceVar(src, key.substring(len, key.length), LAry[key]);
    }
    //alert(src);
    return src;
};
function FoundBadLink(link) {
    if (link == null || link == "")
        return true;
    var badStr = ":/.%$#@!~^&*(){}|\\;\"'?><,";
    for (var i = 0; i < badStr.length; i++) {
        if (link.indexOf(badStr.charAt(i)) >= 0)
            return true;
    }
    return false;
};

// ===========================================
// Wrap the control to object.
// ===========================================
// SetCCV : SetCommonContrlValue
function SetCCV(id, val) {
    SetCtrlValue(CTRLARY, id, val);
};
function SetCtrlValue(ctrlList, id, val) {
    var obj = ctrlList[id];
    if (obj != null) {
        obj.SV(val);
    }
};
// GetCCV : GetCommonContrlValue
function GetCCV(id) {
    return GetCtrlValue(CTRLARY, id);
};
function GetCtrlValue(ctrlList, id) {
    var res = '';
    var obj = ctrlList[id];
    if (obj != null) {
        res = obj.GV();
    }
    return res;
};
// Set Control InActive
function SetCIA(id, val) {
    CTRLARY[id].active = (val == true);
};
function GetCtrlHtml(ctrlList, id) {
    var res = '';
    var obj = ctrlList[id];
    if (obj != null) {
        if (obj.type == 'radio') {
            res = GetRadioONOFF(ctrlList, id);
        } else {
            res = obj.html;
        }
    }
    return res;
};

function GetHtmlbyId(id) {
    var res = '';
    var obj = CTRLARY[id];
    if (obj != null) {
        res = obj.GetHtml();
    } else {
        res = "Error: GetHtmlbyId";
    }
    return res;
}

function WH(id) {
    DW(WH_(id));
};
function WH_(id) {
    return GetCtrlHtml(CTRLARY, id);
};
function GetRadioCtrlHtml(ctrlList, id, val) {
    var res = '';
    var obj = ctrlList[id];
    if (obj != null) {
        res = obj.GetHtml(val);
    }
    return res;
};

function WRH(id, val) {
    DW(WRH_(id, val));
};
function WRH_(id, val) {
    return GetRadioCtrlHtml(CTRLARY, id, val);
};
function CPASS(ctrl, isQuite) {
    var res = true;
    if (ctrl.checker != null) {
        res = ctrl.checker.IsPass(ctrl, isQuite);
    }
    return res;
};

function Ctrl_Select(id, list, val, setcmd, onChangeFunc, checker, inactive) {
    this.type = "select";
    this.active = !(inactive == true);
    this.id = id;
    this.list = list;
    this.value = val;
    this.setcmd = setcmd;
    this.checker = checker;
    this.html = SelectObjectNoWrite(id, list, val, onChangeFunc);
    // GetValue
    this.GV = function() {
        return GetValue(this.id);
    };
    // SetValue
    this.SV = function(val) {
        SetValue(this.id, val);
    };
    this.IsPass = function(isQuite) {
        return CPASS(this, isQuite);
    };
    this.Disable = function(isDis)// Add by ZDY
    {
        this.active = !isDis;
        DisableObject(this.id, isDis);
    };
};
function Ctrl_SelectNum(id, sNum, eNum, gap, val, setcmd, onChangeFunc, onFocusFunc, fixNumC, checker, inactive) {
    this.type = "selectNum";
    this.active = !(inactive == true);
    this.id = id;
    this.value = val;
    this.setcmd = setcmd;
    this.checker = checker;
    this.html = GetSelectNumberHtml(id, sNum, eNum, gap, val, onChangeFunc, onFocusFunc, fixNumC);
    // GetValue
    this.GV = function() {
        return GetValue(this.id);
    };
    // SetValue
    this.SV = function(val) {
        SetValue(this.id, val);
    };
    this.IsPass = function(isQuite) {
        return CPASS(this, isQuite);
    };

};

//new Ctrl_Text("port1", "5", "5", "<%umport1%>", "umport1=")
function Ctrl_Text(id, size, maxlen, val, setcmd, checker, isPwd, onChangeFunc, inactive, onKeyUP) {
    this.type = "text";
    this.active = !(inactive == true);
    this.id = id;
    this.value = val;
    this.setcmd = setcmd;
    this.checker = checker;
    this.html = CreateTextHtml(id, size, maxlen, val, isPwd, onChangeFunc, onKeyUP);
    // GetValue
    this.GV = function() {
        return GetValue(this.id);
    };
    // SetValue
    this.SV = function(val) {
        SetValue(this.id, val);
    };
    this.IsPass = function(isQuite) {
        return CPASS(this, isQuite);
    };
    this.Disable = function(isDis)// Add by ZDY
    {
        this.active = !isDis;
        DisableObject(this.id, isDis);
    }
};
function Ctrl_Check(id, val, setcmd, onClickFunc, checker, inactive) {
    this.type = "check";
    this.active = !(inactive == true);
    this.id = id;
    this.value = val;
    this.setcmd = setcmd;
    this.checker = checker;
    this.onClickFunc = onClickFunc;
    this.GetHtml = function() {
        var o = '';
        o += '<input type="checkbox" id="' + this.id + '" name="' + this.id + '" ';
        if (this.value == 1) {
            o += "checked ";
        }
        if (this.active != true) {
            o += "disabled='true'";
        }
        if (this.onClickFunc != null) {
            o += "onClick='" + this.onClickFunc + "'";
        }
        o += " >";
        return o;
    };
    this.html = this.GetHtml();
    // GetValue
    this.GV = function() {
        return Bool2Int(IsChecked(this.id));
    };
    // SetValue
    this.SV = function(val) {
        SetChecked(this.id, (val == 1));
    };
    this.IsPass = function(isQuite) {
        return CPASS(this, isQuite);
    };
    this.Disable = function(isDis)// Add by ZDY
    {
        this.active = !isDis;
        DisableObject(this.id, isDis);
    }
};
function Ctrl_Radio(id, val, setcmd, onClickFunc, checker, inactive) {
    this.type = "radio";
    this.active = !(inactive == true);
    this.id = id;
    this.value = val;
    this.setcmd = setcmd;
    this.checker = checker;
    this.onClickFunc = onClickFunc;
    this.GetHtml = function(val) {
        var o = "<input type='radio' name='" + this.id + "' id='" + this.id + "' class='m1' value='" + val + "' ";
        if (this.value == val) {
            o += "checked ";
        }
        if (this.onClickFunc != null) {
            o += "onClick='" + this.onClickFunc + "'";
        }
        o += " >";
        return o;
    };
    // GetValue
    this.GV = function() {
        return GetRadioValue(this.id);
    };
    // SetValue
    this.SV = function(val) {
        SetRadioValue(this.id, val);
    };
    this.IsPass = function(isQuite) {
        return CPASS(this, isQuite);
    };

    this.Disable = function(isDis)// Add by ZDY
    {
        this.active = !isDis;
        DisableObject(this.id, isDis);
    };
};
/*  Following add by zdy, 2013-03-14  */
function Ctrl_Input(id, val, onClickFunc) {
    this.type = "input";
    this.id = id;
    this.value = val;
    this.onClickFunc = onClickFunc;
    this.html = '<input type="button" id="' + this.id + ' "value="' + GL(val) + '" class="m1" onClick="' + this.onClickFunc + '">';
    this.Disable = function(isDis) {
        this.active = !isDis;
        DisableObject(this.id, isDis);
    };
};

/*  End Added   */
function GetRadioONOFF(id) {
    return GetRadioONOFF(CTRLARY, id);
    //zdy
};
function GetRadioONOFF(list, id) {
    var o = '';
    //  o += GetRadioCtrlHtml(list, id, 1);
    //  o += GL("on");
    //  o += GetRadioCtrlHtml(list, id, 0);
    //  o += GL("off");
    o += GetRadioCtrlHtml(list, id, 0);
    //zdy
    o += GL("off");
    o += GetRadioCtrlHtml(list, id, 1);
    o += GL("on");
    return o;
};

// following add by zdy
// crossing or section
function GetRadioInfo(id) {
    return GetRadioInfo(CTRLARY, id);
    //zdy
};

function GetRadioInfo(list, id) {
    var o = '';
    o += GetRadioCtrlHtml(list, id, 0);
    //zdy
    o += GL("crossing");
    o += GetRadioCtrlHtml(list, id, 1);
    o += GL("section");
    return o;
};
// enable or disable
function GetRadioENDIS(id) {
    var o = '';
    o += WRH_(id, 1);
    o += GL("enable");
    o += WRH_(id, 0);
    o += GL("disable");
    return o;
};
// AD: Allow/Deny
function GetRadioAD(id) {
    var o = '';
    o += WRH_(id, 1);
    o += GL("allow");
    o += WRH_(id, 0);
    o += GL("deny");
    return o;
};
// note: onChangeFunc not implement
function Ctrl_IPAddr(id, val, setcmd, onChangeFunc, checker, inactive) {
    this.type = "ipaddr";
    this.active = !(inactive == true);
    this.id = id;
    this.value = val;
    this.setcmd = setcmd;
    this.checker = checker;
    this.onChangeFunc = onChangeFunc;
    this.GetIP = function(s) {
        if (s.charAt(0) == '0')//return the char of s[0]
        {
            s = s.replace('0', '');
            if (s.charAt(0) == '0') {
                s = s.replace('0', '');
            }
        }
        if (s == "")
            return 0;
        return parseInt(s);
    };
    this.GV = function() {
        var o = '';
        for (var i = 1; i < 5; i++) {
            try {
                o += FixNum(this.GetIP(GE(this.id + '_ip' + i).value), 3);
                o += (i < 4) ? "." : "";
            } catch (e) {
            };
        }
        this.value = o;
        // alert(o.replace(/\./g,""));
        return o.replace(/\./g, "");
    };
    this.SV = function(val) {
        var ips = val.split(".");
        if (ips.length >= 4) {
            for (var i = 1; i < 5; i++) {
                try {
                    GE(this.id + '_ip' + i).value = this.GetIP(ips[i - 1]);
                } catch (e) {
                };
            }
            this.value = val;
        }
    };
    this.GetHtml = function() {
        var ips = this.value.split(".");
        // alert(ips.length);
        var o = '';
        o += '<div class="cssIpAddr" id="' + this.id + '">';
        for (var i = 1; i < 5; i++) {
            //alert(ips[i-1]);
            o += '<input type="text" width="10px" size="3" value="' + ((ips.length >= 4) ? this.GetIP(ips[i - 1]) : '0') + '" name="' + this.id + '_ip' + i + '" id="' + this.id + '_ip' + i + '" maxlength=3 class="cssIpAddrItem" onkeyup="IPMask(this,event)" onkeydown="IPMaskDown(this,event)" onblur="if(this.value==\'\')this.value=\'0\';" onbeforepaste=IPMask_c()>';
            o += (i < 4) ? "." : "";
        }
        o += '</div>';
        return o;
    };
    this.html = this.GetHtml();
    this.IsPass = function(isQuite) {
        return CPASS(this, isQuite);
    };
    this.Disable = function(isDis) {
        this.active = !isDis;
        for (var i = 1; i < 5; i++)
            DisableObject(this.id + '_ip' + i, isDis);
    }
};
// note: onChangeFunc not implement
function Ctrl_IPFilter(id, val, setcmd, onChangeFunc, checker, inactive) {
    this.type = "ipfilter";
    this.active = !(inactive == true);
    this.id = id;
    this.value = val;
    this.setcmd = setcmd;
    this.checker = checker;
    this.onChangeFunc = onChangeFunc;
    this.GetIP = function(s) {
        if (s.charAt(0) == '0') {
            s = s.replace('0', '');
            if (s.charAt(0) == '0') {
                s = s.replace('0', '');
            }
        }
        if (s == "")
            return 0;
        // return parseInt(s);
        return s;
    };
    this.GV = function() {
        var o = '';
        for (var i = 1; i < 5; i++) {
            try {
                o += this.GetIP(GE(this.id + '_ip' + i).value);
                o += (i < 4) ? "." : "";
            } catch (e) {
            };
        }
        this.value = o;
        return o;
    };
    this.SV = function(val) {
        var ips = val.split(".");
        if (ips.length >= 4) {
            for (var i = 1; i < 5; i++) {
                try {
                    GE(this.id + '_ip' + i).value = this.GetIP(ips[i - 1]);
                } catch (e) {
                };
            }
            this.value = val;
        }
    };
    this.GetHtml = function() {
        var ips = this.value.split(".");
        // alert(ips.length);
        var o = '';
        o += '<div class="cssIpFilter" id="' + this.id + '">';
        for (var i = 1; i < 5; i++) {
            //alert(ips[i-1]);
            o += '<input type="text" value="' + ((ips.length >= 4) ? this.GetIP(ips[i - 1]) : '0') + '" name="' + this.id + '_ip' + i + '" id="' + this.id + '_ip' + i + '" maxlength=9 class="cssIpFilterItem" onkeyup="IPMask(this,event,true)" onkeydown="IPMaskDown(this,event)" onblur="if(this.value==\'\')this.value=\'0\';" onbeforepaste=IPMask_c(true)>';
            o += (i < 4) ? "." : "";
        }
        o += '</div>';
        return o;
    };
    this.html = this.GetHtml();
    this.IsPass = function(isQuite) {
        return CPASS(this, isQuite);
    };

    this.Disable = function(isDis) {
        for (var i = 1; i < 5; i++)
            DisableObject(this.id + '_ip' + i, isDis);
    };

};

// ===========================================
// IP Mask control
// ===========================================
function FocusToNextIPAddr(obj, isNext, select) {
    //alert(obj+":"+isNext);
    obj.blur();
    var nextip = parseInt(obj.name.charAt(obj.name.length - 1));
    nextip = (isNext) ? nextip + 1 : nextip - 1;
    nextip = nextip >= 5 ? 1 : nextip;
    nextip = nextip <= 0 ? 4 : nextip;
    try {
        var oo = GE(obj.name.substring(0, obj.name.length - 1) + nextip);
        oo.focus();
        if (select) {
            oo.select();
        }
    } catch (e) {
    };
};
function IPMaskDown(obj, evt) {
    var key1 = evt.keyCode;
    if (key1 == 190 || key1 == 110) {
        FocusToNextIPAddr(obj, true, false);
    }
};
function IPMask(obj, evt, isFilter) {
    var key1 = evt.keyCode;
    var pobj = event.srcElement.parentNode;
    // alert(key1);
    if (!(key1 == 46 || key1 == 8 || key1 == 48 || (key1 >= 49 && key1 <= 57) || (key1 >= 97 && key1 <= 104))) {
        if (isFilter == true) {
            obj.value = obj.value.replace(/[^\d\-\*\(\)]/g, '');
        } else {
            obj.value = obj.value.replace(/[^\d]/g, '');
        }
    }

    if (key1 == 190 || key1 == 110) {
        obj.select();
    }
    //alert(key1);
    if (key1 == 37 || key1 == 39) {
        //alert("a:"+key1);
        FocusToNextIPAddr(obj, (key1 == 39), false);
    }
    if (obj.value.length >= 3) {
        if (parseInt(obj.value) >= 256 || parseInt(obj.value) < 0) {
            // alert(GL("err_ip_address"));
            if (pobj.id == "netip")
                alert(GL("ip_inva"))
            else if (pobj.id == "netmask")
                alert(GL("netmask_inva"));
            else if (pobj.id == "gateway")
                alert(GL("gateway_inva"))
            obj.value = "";
            obj.focus();
            return false;
        }

    }
};
function IPMask_c(isFilter) {
    var txt = clipboardData.getData('text');
    txt = (isFilter == true) ? txt.replace(/[^\d\-\*\(\)]/g, '') : txt.replace(/[^\d]/g, '');
    clipboardData.setData('text', txt);
};
// ===========================================
// validate control and submit
// ===========================================
function GetSetterCmd(ctrl, val) {
    return GetSetterCmdKV(ctrl.setcmd, val);
};
// direct input the name and value
function GetSetterCmdKV(name, val) {
    var o = "&" + name;
    // Luther memo: it is important, null string is equals 0, :(
    if (isNaN(parseInt(val)) && val == "") {
        val = "(null)";
    }
    //if setcmd contain "=" ,it's mean video server do not add channel id.
    if (name.indexOf("=") < 0) {
        o += "=";
    }
    //add value
    o += val;
    return o;
};
function ValidateCtrlAndSubmit(ctrlList, isAsync) {
    if (g_lockLink) {
        WS("LOCKED...");
        return;
    }
    if (isAsync == null)
        isAsync = false;
    // validate
    var res = true;
    for (var key in ctrlList) {
        var obj = ctrlList[key];
        if (obj.active) {
            if (!res) {
                return res;
            }
        }
    }
    //call back
    if (MY_BEFORE_SUBMIT() == false) {
        return false;
    }

    //submit ,
    g_httpOK = true;
    var o = c_iniUrl;
    //add by zdy, 20121109
    var len = g_MaxSubmitLen;
    for (var key in ctrlList) {
        var obj = ctrlList[key];
        if (obj.active) {
            if (obj.setcmd != "") {
                var str = GetSetterCmd(obj, GetCtrlValue(ctrlList, key));
                len -= str.length;
                o += str;
                if (len < 10) {
                    SendHttp(o, isAsync, OnSubmitReadyStateProcess);
                    if (g_httpOK) {
                        o = c_iniUrl;
                        len = g_MaxSubmitLen;
                    } else {
                        break;
                    }
                }
            }
        }
    }
    if (len != g_MaxSubmitLen) {
        SendHttp(o, isAsync, OnSubmitReadyStateProcess);
    }
    if (g_httpOK) {
        MY_SUBMIT_OK();
    }
};

// ===========================================
// Dispaly Message on browser status bar
// ===========================================
function WS(msg) {
    window.status = (msg == null) ? "" : msg;
};

/**
 **把控件调用统一放到这里，关于控件的方法以后可以都加到这里面。
 **/
var VideoActiveXControl = {
    threeD : 0, //3D定位，默认0 关闭。
    streamIndex : 1, //默认一码流
    videoCache : 300, //视频缓存时间，默认300毫秒
    tcpOrUdp : 1, // 默认1：Tcp  0：UDP

    setProtocol : function(value) {
        this.tcpOrUdp = value;
        var obj = GE("vlc");
        obj.bRtspTcp = value;
        obj.Stop();
        obj.Play();
    },

    setThreeD : function(value) {
        this.threeD = value;
        var obj = GE("vlc");
        obj.IsDrawRect = value;
        obj.IsShowRanges = value;

    },
    setStreamIndex : function(value) {
        this.streamIndex = value;
    },
    setVideoCache : function(value) {
        this.videoCache = value;
    },

    videoPlay : function(streamIndex, threeDposition, video_cache_time) {
        this.videoStop();

        var obj = GE("vlc");
        if (obj == null)
            return;
        var mediaUrl = "";

        if (streamIndex == 3) {
            if (umenable3 == 0) {
                mediaUrl += stream3;
            } else {
                mediaUrl = '';
                mediaUrl += 'himjpeg://' + umip3 + ':' + umport3;
            }
        } else if (streamIndex == 1) {
            if (umenable1 == 0) {
                mediaUrl += stream1;
            } else {
                mediaUrl = '';
                mediaUrl += 'bitcom://' + umip1 + ':' + umport1;
            }
        } else {
            if (umenable2 == 0) {
                mediaUrl += stream2;
            } else {
                mediaUrl = '';
                mediaUrl += 'bitcom://' + umip2 + ':' + umport2;
            }
        }

        obj.MediaURL = mediaUrl;
        obj.VideoDinterlace = 1;
        obj.IsDrawRect = threeDposition;
        obj.IsShowRanges = threeDposition;
        if (video_cache_time) {
            obj.VideoCaching = video_cache_time;
        }

        /*if (flowtype == 0)
         obj.bRtspTcp = 0;
         else
         obj.bRtspTcp = 1;
         */
        obj.bRtspTcp = this.tcpOrUdp;

        try {
            obj.Play();
        } catch(e) {
        }

    },
    videoStop : function() {
        var obj = GE("vlc");
        try {
            obj.Stop();
        } catch(e) {
        }

    },
    snapShot : function(root) {
        var obj = GE(AxID);
        if (root == null || root == '' || root == undefined) {
            root = LocalConfigCtrl.readConfigFromLocalFile().snapPicRoot;
        }
        if (obj != null) {
            try {
                obj.takeSnapshot(root);
            } catch (e) {
                alert("Take Snap Error!");
            }
        }
    },
    recordVideo : function() {
        var localConfig = LocalConfigCtrl.readConfigFromLocalFile();
        var xs = "录像已存至" + localConfig.videoRecordRoot;
        var obj = GE(AxID);
        if (obj != null) {
            obj.RecordVideo(localConfig.videoRecordRoot);
            alert(xs);
        }
    },
    stopRecordVideo : function() {
        var obj = GE(AxID);
        if (obj != null) {
            obj.StopRecordVideo();
        }
    },
    togglePause : function() {
        var obj = GE(AxID);
        if (obj != null) {
            obj.togglePause();
        }
    }
};

/**
 * 读取本地化配置
 */
var LocalConfigCtrl = {
    //浏览本地文件并返回路径
    browseLocalFileSystem : function() {
        var obj = GE(AxID);
        if (obj != null) {
            return obj.SetLocalePath();
        }
    },
    //读取本地文件内容并返回JSON对象
    readConfigFromLocalFile : function() {
        var obj = GE(AxID);
        if (obj != null) {
            var str = obj.ReadLocalePath();
            //var str = '{"localSnapRoot":"C:\\\\VideoCtrl\\\\snapshot","localVideoRecordRoot":"C:\\\\VideoCtrl\\\\videoRecord"}';
            var json = JSON.parse(str);
            return {
                snapPicRoot:json.localSnapRoot,
                videoRecordRoot:json.localVideoRecordRoot,
                entranceBackgroundImage:'EntranceBackgroundImage.png'
            };
        }
    },
    //写到本地文件中
    writeLocalFile : function(){
        var content = {"localSnapRoot":arguments[0],
                       "localVideoRecordRoot":arguments[1]
        };
        var jsonStr = JSON.stringify(content);
        var obj = GE(AxID);
        if (obj != null) {
            obj.SaveLocalePath(jsonStr);
        }
    }
};
