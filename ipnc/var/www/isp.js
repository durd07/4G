var browser_Netscape = false;
var browser_IE = false;
var browser_FireFox = false;
var g_MaxSubmitLen = 190; // it will be over, increase 30
//var AxUuid="39646d1d-52c5-46b4-ad17-00a207dbf901";  //this is for Java Web Page Maker to replace.
//var AxUuid="5E4CCBDC-F575-4BE5-B9C2-C87F562DD0F8";
var c_iniUrl = "/vb.htm?language=ie";
var g_httpOK = true;
var g_SubmitHttp = null;
var g_lockLink = false; // lock the link , can not access.
var CONTENT_PAGE = "hi_isp.htm";
var CONTENT_PAGE_LAST = '';
var WCH = null; // WebContentHttp
/*  Following add by zdy, 2013-04-15  */
//var g_regonebit1 = "<%regvalue%>";

/*  End added */

// This is xml http request object for dynamic fetch html
// var xhttp = null;

// check brower type, and set show ,hide keyword.
if (window.ActiveXObject)
{
  browser_IE = true;
  keyword_Show = "visible";
  keyword_Hide = "hidden";
}
else if (document.layers)
{
  browser_Netscape = true;
  keyword_Show = "show";
  keyword_Hide = "hide";
}
else
{
  browser_FireFox = true;
  keyword_Show = "visible";
  keyword_Hide = "hidden";
}
// ==================================
// Luther add String trim function
// ==================================
String.prototype.trim = function()
{
  return this.replace(/(^\s*)|(\s*$)/g, "");
}
String.prototype.ltrim = function()
{
  return this.replace(/(^\s*)/g, "");
}
String.prototype.rtrim = function()
{
  return this.replace(/(\s*$)/g, "");
}

function IsMozilla()
{
  return (browser_Netscape || browser_FireFox);
};


// check the string is null or blank.
// return ture -> str is not null or ""
// return false -> str is
function CheckIsNull(str, defMsg, msg, isQuite)
{
  var result = false;
  if (CheckIsNullNoMsg(str))
  {
    if (isQuite != true)
    {
      if (msg != null)
      {
        alert(msg);
      }
      else
      {
        alert(GL("verr_vacuous",
        { 1 : defMsg }));
      }
    }
    result = true;
  }
  return result;
};
function CheckIsNullNoMsg(str)
{
  return (str == null || str == "");
};
function IsNumeric(sText)
{
  var ValidChars = "0123456789";
  var IsNumber = true;
  var i;
  var Char;
  for (i = 0; i < sText.length && IsNumber == true; i++)
  {
    Char = sText.charAt(i);
    if (ValidChars.indexOf(Char) == -1)
    {
      IsNumber = false;
    }
  }
  return IsNumber;
}


// ===================================================
// check the range of number.

// check the range of number ,include min and max ( min <= x <= max)
// true: the number(str) is not in the range.
function CheckBadNumberRange(str, min, max, defMsg, msg, isQuite)
{
  var result = false;
  var num = parseInt(str);
  if (!((num >= min && num <= max) && (IsNumeric(str))))
  {
    if (isQuite != true)
    {
      if (msg == null)
      {
        alert(GL("verr_bad_num",
        { 1 : defMsg, 2 : min, 3 : max }));
      }
      else
      {
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
function CheckBadStrLen(str, minLen, maxLen, defMsg, msg, isQuite)
{
  var result = false;
  if (str == null)
  {
    result = true;
  }
  else
  {
    var len = str.length;
    if (!(len >= minLen && len <= maxLen))
    {
      if (isQuite != true)
      {
        if (msg == null)
        {
          if (minLen != maxLen)
          {
            alert(GL("verr_str_len",
            { 1 : defMsg, 2 : minLen, 3 : maxLen }));
          }
          else
          {
            alert(GL("verr_str_len2",
            { 1 : defMsg, 2 : minLen }));
          }
        }
        else
        {
          alert(msg);
        }
      }
      result = true;
    }
  }
  return result;
};

// check string , include the non alphabet or digital char.
// true : found non alphabet or digital char, False: all chars are belong alphabet or digital number
// noCheckNum : do not check digital number. it's mean only check alphabet
// noCheckLower: do not check lower alphabet,
// noCheckLower: do not check upper alphabet,
function CheckBadEnglishAndNumber(str, defMsg, msg, noCheckNum, noCheckLower, noCheckUpper, isQuite)
{
  var result = false;
  if (str == null)
  {
    result = true;
  }
  else
  {
    var i = 0;
    for (i = 0; i < str.length; i++)
    {
      var cc = str.charCodeAt(i);
      var checker = true; // true : means baddly.
      if (noCheckNum == null || noCheckNum == false)
      {
        checker = checker && !(cc >= 48 && cc <= 57);
      }
      if (noCheckLower == null || noCheckLower == false)
      {
        //checker = checker && !(cc >= 97 && cc <= 122);
        checker = checker && !(cc >= 97 && cc <= 122);
      }
      if (noCheckUpper == null || noCheckUpper == false)
      {
        checker = checker && !(cc >= 65 && cc <= 90);
      }
      if (checker)
      {
        if (isQuite != true)
        {
          if (msg == null)
          {
            alert(GL("verr_eng_digital",
            { 1 : defMsg }));
          }
          else
          {
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
function SendHttp(url, isAsync, callBack)
{
  isAsync = new Boolean(isAsync);
  g_SubmitHttp = null;
  g_SubmitHttp = InitXHttp();
  if (callBack != null)
  {
    g_SubmitHttp.onreadystatechange = callBack;
  }
  else
  {
    g_SubmitHttp.onreadystatechange = OnSubmitReadyStateProcess;
  }

  try
  {
    g_SubmitHttp.open("GET", url, isAsync);
    g_SubmitHttp.setRequestHeader("If-Modified-Since", "0");
    g_SubmitHttp.send(null);
    WS(GL("sending_"));
  }
  catch (e)
  {};

};

function OnSubmitReadyStateProcess()
{
  if (g_SubmitHttp.readyState == 4)
  {
    if (g_SubmitHttp.status != 200)
    {
      //alert(GL("err_submit_fail"));
      g_httpOK = false;
      //WS(GL("fail_"));
      WS("fail");
    }
    else
    {
      g_httpOK = true;
      //WS(GL("ok_"));
      WS("ok");
    }
  }
};

function WS(msg)
{
  window.status = (msg == null) ? "" : msg;
};

function IsChecked(name)
{
  var obj = GE(name);
  var result = false;
  if (obj != null)
  {
    result = obj.checked;
  }
  return result;
};
function SetChecked(name, isChk)
{
  var obj = GE(name);
  if (obj != null)
  {
    obj.checked = isChk;
  }
};
function Bool2Int(data)
{
  return (data) ? 1 : 0;
};

function InitXHttp()
{
  var xhttp = null;
  if (IsMozilla())
  {
    xhttp = new XMLHttpRequest();
    if (xhttp.overrideMimeType)
    {
      xhttp.overrideMimeType('text/xml');
    }
  }
  else if (browser_IE)
  {
    try
    {
      xhttp = new ActiveXObject("Msxml2.XMLHTTP");
    }
    catch (e)
    {
      try
      {
        xhttp = new ActiveXObject("Microsoft.XMLHTTP");
      }
      catch (e)
      {};
    }
  }
  return xhttp;
};
// get init submit string
// return the submit POSTDATA init data.
function GetIS()
{
  var o = 'GET /' + THIS_PAGE + '?';
  o += "language=ie";
  return o;
};

// ===========================================
// about Machine type
// ===========================================
function IsVS()
{
  var res = false;
  // res = (g_machineCode == "1290" ||g_machineCode == "1280");
  res = (g_machineCode == "1290" || g_machineCode == "1291");

  // res = true;

  return res;
};
function Is2114()
{
  //return (g_machineCode == "1291");
  return (g_isSupportMQ && (g_quadMode == 0));
};

// ===========================================
// Dynamic get content. XMLHttpRequest...
// ===========================================
// use XMLHttpRequest to get the content, and put in center web page.
// isForceChange means do not check last page name, just reload it.
function ChangeContent(link, isNoHis, isForceChange)
{	
  if (link != null)
  {
    link = link.toLowerCase();
  }
  //WS((debugC++)+" : "+link);
  
  if (g_lockLink)
  {
    WS("LOCKED...");
    return;
  }
 // alert(CONTENT_PAGE); //zdy
  g_lockLink = true;
  if (link == null)
  {
    link = CONTENT_PAGE;
  }
  else
  {
    CONTENT_PAGE_LAST = CONTENT_PAGE;
    if (isForceChange != true && CONTENT_PAGE == link)
    {
      //alert("link:"+link+":CP:"+CONTENT_PAGE);
      // avoid endless loop
      g_lockLink = false;
      return;
    }

    if (isNoHis != true)
    {
      if (g_backList.length > 0)
      {
        if (g_backList[g_backList.length - 1] != link)
        {
          if (g_fwdList.length > 0)
          {
            //alert(g_fwdList[g_fwdList.length-1]+"(11pop):"+g_backList[g_backList.length-1]+"(push)");
            g_backList.push(g_fwdList.pop());
          }
          //alert("11:g_backList(push) :"+link);
          g_backList.push(link);
        }

      }
      else
      {
        if (g_fwdList.length > 0)
        {
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
  try
  {
    StopActiveX();
  }
  catch (e)
  {};

  CONTENT_PAGE = link;
  if (WCH != null)
  {
    //WCH.onreadystatechange=null;
    delete WCH;
    WCH = null;
  }
  WCH = InitXHttp();
  WCH.onreadystatechange = OnWebContentProcess;
  try
  {
    //if((typeof(g_isStartPtz) != "undefined")&& (g_isShowDvPtzCtrl))
    // {
    // ShowPtzCtrl(false);
    // }
    WCH.open("GET", "/" + link, true);
    WCH.setRequestHeader("If-Modified-Since", "1");
    // finally send the call
    WCH.send(null);
    // alert("ChangeContent:"+data);
  }
  catch (e)
  {
    alert(GL("err_get_content"));
    CONTENT_PAGE = CONTENT_PAGE_LAST;
  }

  //g_lockLink = false;
};

// ALC , After Load Content
// Note: this function must call in the end of the each page.
function ALC()
{
  WS("");
  g_lockLink = true;
  setTimeout(MY_ONLOAD, 300);
};

// ===========================================
// validate control and submit
// ===========================================
function GetSetterCmd(ctrl, val)
{
  return GetSetterCmdKV(ctrl.setcmd, val);
};
// direct input the name and value
function GetSetterCmdKV(name, val)
{
  var o = "&" + name;
  // Luther memo: it is important, null string is equals 0, :(
  if (isNaN(parseInt(val)) && val == "")
  {
    val = "(null)";
  }
  //if setcmd contain "=" ,it's mean video server do not add channel id.
  if (name.indexOf("=") < 0)
  {
    o += "=";
    if (IsVS())
    {
      o += g_CHID + ":";
    }
  }
  //add value
  o += val;
  return o;
};

function InitLoad()
{ 
  var datekey = (new Date()).getTime();
  //loadJS("setInnerHTML.js");
  //loadJS("../lang/"+ "lang_" + g_langName + ".jsl?" + datekey);
  //loadJS("override.js");
};

function OnWebContentProcess()
{
  if (WCH == null)
    return;
  if (WCH.readyState == 4)
  {
    if (WCH.status == 200 || WCH.status == 401 || WCH.status == 404 || WCH.status == 403)
    {
      //alert(WCH.responseText);
      if (WCH.responseText.indexOf("var.js") >= 0)
        return;
      // var body = GE("WebContent");
      // var o = '<span style="display: none">'+I18NHtml(WCH.responseText)+'</span>';
      var o = '';
      // o+=GetViewCHHtml()+GetEmptyCallback()+I18NHtml(WCH.responseText);
      o += GetEmptyCallback() + I18NHtml(WCH.responseText);
      // alert(o);

      // call unload function.
      CallOnUnload();
      // set_innerHTML('WebContent',o);      
      setInnerHTML(GE('WebContent'), o);      
      setTimeout(CallOnResize, 500);
      // GE("WebContent").innerHTML='<span style="display: none">'+I18NHtml(WCH.responseText)+'</span>';
      if (WCH.status != 200)
      {
        g_lockLink = false;
      }
    }
    else
    {
      alert(GL("err_get_content"));
      CONTENT_PAGE = CONTENT_PAGE_LAST;
      g_lockLink = false;
    }

  }
};