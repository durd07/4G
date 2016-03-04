/* 动力视讯机芯获取参数，详见协议文档 */
var apelist = "F1.4;F1.6;F2.0;F2.4;F2.8;F3.4;F4.0;F4.8;F5.6;F6.8;F8.0;F9.6;F11;F14;F16;Close";
var shuterlist = "1/1;1/2;1/3;1/6;1/12;1/25;1/50;1/75;1/100;1/120;1/150;1/215;1/300;1/425;1/600;1/1000;1/1250;1/1750;1/2500;1/3500;1/6000;1/10000";
var gain_list = "n3db;0db;2db;4db;6db;8db;10db;12db;14db;16db;18db;20db;22db;24db;26db;28db";
var swhite_balancelist = "Auto;A_key_Trigger;Manul;Indoor;Outdoor;Outdoor_Automatic;ATW";
var focusextremeslist  = "Infinity;25m;11m;7m;4.9m;3.7m;2.9m;2.3m;1.85m;1.5m;1.23m;1m";
function PowerViewGet(action_itemjson)
{
	SendHttp(c_iniUrl + GetSetterCmdKV("camera_parameters_get", action_itemjson), false, GetResult);
	var txt = g_resultTxt;
	var response = null;
	var back = null;
	var backjson = null;
	if ((txt.indexOf("OK camera_parameters_get") >= 0)&&(txt.indexOf("POWER_VIEW") >= 0) ) {
			
		back = txt.substring(36);
		
	}	
	//alert(back);
	backjson=JSON.parse(back);//转换为json
	return backjson;
}
function PowerViewGetExposure_Moudle()
{
	var value = 0;
	var strvalue = null;
	var cmd = null;
	var actionjson = {"Factory":"POWER_VIEW",
			  "Type":"PV8340-F2",
			  "Action_Item":"Exposure_Mode",
			  "Param":"0"
			  };
	cmd = JSON.stringify(actionjson);
	
	var getinfojson = PowerViewGet(cmd);
	if (getinfojson != null){
		strvalue = getinfojson.Param;
		//alert(strvalue);
		
		if(strvalue == "Manul"){
			value = 0;
		}
		if(strvalue == "Auto"){
			value = 1;
		}
		if(strvalue == "Shutter_Priority"){
			value = 2;
		}
		if(strvalue == "Aperture_Priority"){
			value = 3;
		}	
	}
	else
	{
		
	}
		
	return value;
}
function PowerViewGetAperture_Moudle()
{
	var value = 0;
	var strvalue = null;
	var cmd = null;
	var i = 0;
	var actionjson = {"Factory":"POWER_VIEW",
			  "Type":"PV8340-F2",
			  "Action_Item":"Aperture",
			  "Param":"0"
			  };
	cmd = JSON.stringify(actionjson);
	
	var getinfojson = PowerViewGet(cmd);
	if (getinfojson != null){
		strvalue = getinfojson.Param;
		//alert(strvalue);
		var array = apelist.split(";");	
		for(i=0;i<=15;i++){
			if(strvalue ==array[i] )
			{
				value = i;
				break;
			}
		}		
	}
	else
	{
		
	}		
	return value;
}
function PowerViewGetGain_Moudle()
{
	var value = 0;
	var strvalue = null;
	var cmd = null;
	var i = 0;
	var actionjson = {"Factory":"POWER_VIEW",
			  "Type":"PV8340-F2",
			  "Action_Item":"Gain",
			  "Param":"0"
			  };
	cmd = JSON.stringify(actionjson);
	
	var getinfojson = PowerViewGet(cmd);
	if (getinfojson != null){
		strvalue = getinfojson.Param;
		//alert(strvalue);
		var array = gain_list.split(";");	
		
		for(i=0;i<=15;i++){
			if(strvalue ==array[i] )
			{
				value = i;
				break;
			}
		}		
	}
	else
	{
		
	}
	return value;
}
function PowerViewGetFocus_Mode()
{
	var value = 0;
	var strvalue = null;
	var cmd = null;
	var i = 0;
	var actionjson = {"Factory":"POWER_VIEW",
			  "Type":"PV8340-F2",
			  "Action_Item":"Focus_Mode",
			  "Param":"0"
			  };
	cmd = JSON.stringify(actionjson);	
	
	
	var getinfojson = PowerViewGet(cmd);
	if (getinfojson != null){
		strvalue = getinfojson.Param;
		//alert(strvalue);
		if(strvalue == "Auto"){
			value = 0;
		}
		if(strvalue == "Manul"){
			value = 1;
		}
		if(strvalue == "A_key_focus"){
			value = 2;
		}
			
	}
	else
	{
		
	}
	return value;
}

function PowerViewGetFocus_Extremes()
{
	var value = 0;
	var strvalue = null;
	var cmd = null;
	var i = 0;
	var actionjson = {"Factory":"POWER_VIEW",
			  "Type":"PV8340-F2",
			  "Action_Item":"Focus_Extremes",
			  "Param":"0"
			  };
	cmd = JSON.stringify(actionjson);
	
	var getinfojson = PowerViewGet(cmd);
	if (getinfojson != null){
		strvalue = getinfojson.Param;
		//alert(strvalue);
		var array = focusextremeslist.split(";");	
		
		for(i=0;i<=11;i++){
			if(strvalue ==array[i] )
			{
				value = i;
				break;
			}
		}		
	}
	else
	{
		
	}
	return value;
}
function PowerViewGetWhite_Balance()
{
	var value = 0;
	var strvalue = null;
	var cmd = null;
	var i = 0;
	var actionjson = {"Factory":"POWER_VIEW",
			  "Type":"PV8340-F2",
			  "Action_Item":"White_Balance",
			  "Param":"0"
			  };
	cmd = JSON.stringify(actionjson);
	
	var getinfojson = PowerViewGet(cmd);
	if (getinfojson != null){
		strvalue = getinfojson.Param;
		//alert(strvalue);
		var array = swhite_balancelist.split(";");	
		
		for(i=0;i<=6;i++){
			if(strvalue ==array[i] )
			{
				value = i;
				break;
			}
		}		
	}
	else
	{
		
	}
	return value;
}

function PowerViewGetRed_Gain()
{
	var value = 0;
	var strvalue = null;
	var cmd = null;
	var i = 0;
	var actionjson = {"Factory":"POWER_VIEW",
			  "Type":"PV8340-F2",
			  "Action_Item":"Red_Gain",
			  "Param":"0"
			  };
	cmd = JSON.stringify(actionjson);
	
	var getinfojson = PowerViewGet(cmd);
	if (getinfojson != null){
		strvalue = getinfojson.Param;
		//alert(strvalue);
		value = strvalue;
	}
	else
	{
		
	}
	return value;
}
function PowerViewGetBlue_Gain()
{
	var value = 0;
	var strvalue = null;
	var cmd = null;
	var i = 0;
	var actionjson = {"Factory":"POWER_VIEW",
			  "Type":"PV8340-F2",
			  "Action_Item":"Blue_Gain",
			  "Param":"0"
			  };
	cmd = JSON.stringify(actionjson);
	
	var getinfojson = PowerViewGet(cmd);
	if (getinfojson != null){
		strvalue = getinfojson.Param;
		//alert(strvalue);
		value = strvalue;
	}
	else
	{
		
	}
	return value;
}

function PowerViewGetDay_Night()
{
	var value = 0;
	var strvalue = null;
	var cmd = null;
	var i = 0;
	var actionjson = {"Factory":"POWER_VIEW",
			  "Type":"PV8340-F2",
			  "Action_Item":"Day_Night_Mode",
			  "Param":"0"
			  };
	cmd = JSON.stringify(actionjson);
	
	var getinfojson = PowerViewGet(cmd);
	if (getinfojson != null){
		strvalue = getinfojson.Param;
		//alert(strvalue);
		if(strvalue == "Day"){
			value = 0;
		}
		if(strvalue == "Night"){
			value = 1;
		}
		if(strvalue == "Auto"){
			value = 2;
		}		
	}
	else
	{
		
	}
	return value;
}

function PowerViewGetDNSensitivity()
{
	var value = 0;
	var strvalue = null;
	var cmd = null;
	var i = 0;
	var actionjson = {"Factory":"POWER_VIEW",
			  "Type":"PV8340-F2",
			  "Action_Item":"Day_Night_Sensitivity",
			  "Param":"0"
			  };
	cmd = JSON.stringify(actionjson);
	
	var getinfojson = PowerViewGet(cmd);
	if (getinfojson != null){
		strvalue = getinfojson.Param;
		//alert(strvalue);
		value = strvalue;
	}
	else
	{
		
	}
	return value;
}

function PowerViewGetGamma()
{
	var value = 0;
	var strvalue = null;
	var cmd = null;
	var i = 0;
	var actionjson = {"Factory":"POWER_VIEW",
			  "Type":"PV8340-F2",
			  "Action_Item":"Gamma",
			  "Param":"0"
			  };
	cmd = JSON.stringify(actionjson);
	
	var getinfojson = PowerViewGet(cmd);
	if (getinfojson != null){
		strvalue = getinfojson.Param;
		//alert(strvalue);
		value = strvalue;
	}
	else
	{
		
	}
	return value;
}
function PowerViewGetBlc()
{
	var value = 0;
	var strvalue = null;
	var cmd = null;
	var i = 0;
	var actionjson = {"Factory":"POWER_VIEW",
			  "Type":"PV8340-F2",
			  "Action_Item":"BLC",
			  "Param":"0"
			  };
	cmd = JSON.stringify(actionjson);
	
	var getinfojson = PowerViewGet(cmd);
	if (getinfojson != null){
		strvalue = getinfojson.Param;
		//alert(strvalue);
		if(strvalue == "Off"){
			value = 0;
		}
		if(strvalue == "On"){
			value = 1;
		}
	}
	else
	{
		
	}
	return value;
}
function PowerViewGetDenoise()
{
	var value = 0;
	var strvalue = null;
	var cmd = null;
	var i = 0;
	var actionjson = {"Factory":"POWER_VIEW",
			  "Type":"PV8340-F2",
			  "Action_Item":"Denoising",
			  "Param":"0"
			  };
	cmd = JSON.stringify(actionjson);
	
	var getinfojson = PowerViewGet(cmd);
	if (getinfojson != null){
		strvalue = getinfojson.Param;
		//alert(strvalue);
		value = strvalue;
	}
	else
	{
		
	}
	return value;
}
function PowerViewGetSharpness()
{
	var value = 0;
	var strvalue = null;
	var cmd = null;
	var i = 0;
	var actionjson = {"Factory":"POWER_VIEW",
			  "Type":"PV8340-F2",
			  "Action_Item":"Sharpness",
			  "Param":"0"
			  };
	cmd = JSON.stringify(actionjson);
	
	var getinfojson = PowerViewGet(cmd);
	if (getinfojson != null){
		strvalue = getinfojson.Param;
		//alert(strvalue);
		value = strvalue;
	}
	else
	{
		
	}
	return value;
}
function PowerViewTBrightness()
{
	var value = 0;
	var strvalue = null;
	var cmd = null;
	var i = 0;
	var actionjson = {"Factory":"POWER_VIEW",
			  "Type":"PV8340-F2",
			  "Action_Item":"Target_Brightness",
			  "Param":"0"
			  };
	cmd = JSON.stringify(actionjson);
	
	var getinfojson = PowerViewGet(cmd);
	if (getinfojson != null){
		strvalue = getinfojson.Param;
		//alert(strvalue);
		value = strvalue;
	}
	else
	{
		
	}
	return value;
}
function PowerViewGetSaturation()
{
	var value = 0;
	var strvalue = null;
	var cmd = null;
	var i = 0;
	var actionjson = {"Factory":"POWER_VIEW",
			  "Type":"PV8340-F2",
			  "Action_Item":"Saturation",
			  "Param":"0"
			  };
	cmd = JSON.stringify(actionjson);
	
	var getinfojson = PowerViewGet(cmd);
	if (getinfojson != null){
		strvalue = getinfojson.Param;
		//alert(strvalue);
		value = strvalue;
	}
	else
	{
		
	}
	return value;
}
function PowerViewGetContrast()
{
	var value = 0;
	var strvalue = null;
	var cmd = null;
	var i = 0;
	var actionjson = {"Factory":"POWER_VIEW",
			  "Type":"PV8340-F2",
			  "Action_Item":"Contrast",
			  "Param":"0"
			  };
	cmd = JSON.stringify(actionjson);
	
	var getinfojson = PowerViewGet(cmd);
	if (getinfojson != null){
		strvalue = getinfojson.Param;
		//alert(strvalue);
		value = strvalue;
	}
	else
	{
		
	}
	return value;
}
function PowerViewDeffect()
{
	var value = 0;
	var strvalue = null;
	var cmd = null;
	var i = 0;
	var actionjson = {"Factory":"POWER_VIEW",
			  "Type":"PV8340-F2",
			  "Action_Item":"Digital_Effects",
			  "Param":"0"
			  };
	cmd = JSON.stringify(actionjson);
	
	var getinfojson = PowerViewGet(cmd);
	if (getinfojson != null){
		strvalue = getinfojson.Param;
		//alert(strvalue);
		if(strvalue == "Off"){
			value =0;			
		}
		if(strvalue == "180_Flip"){
			value =1;			
		}
		if(strvalue == "Flip_Vertical"){
			value =2;			
		}
		if(strvalue == "Flip_Horizontal"){
			value =3;			
		}
	}
	else
	{
		
	}
	return value;
}
function PowerViewGetZoomMag()
{
	var value = 0;
	var strvalue = null;
	var cmd = null;
	var i = 0;
	var actionjson = {"Factory":"POWER_VIEW",
			  "Type":"PV8340-F2",
			  "Action_Item":"Zoom_Logo",
			  "Param":"0"
			  };
	cmd = JSON.stringify(actionjson);
	
	var getinfojson = PowerViewGet(cmd);
	if (getinfojson != null){
		strvalue = getinfojson.Param;
		//alert(strvalue);
		if(strvalue == "Off"){
			value =0;			
		}
		if(strvalue == "On"){
			value =1;			
		}		
	}
	else
	{
		
	}
	return value;
}
function PowerViewGetFogPenetration()
{
	var value = 0;
	var strvalue = null;
	var cmd = null;
	var i = 0;
	var actionjson = {"Factory":"POWER_VIEW",
			  "Type":"PV8340-F2",
			  "Action_Item":"Fog_Penetration",
			  "Param":"0"
			  };
	cmd = JSON.stringify(actionjson);
	
	var getinfojson = PowerViewGet(cmd);
	if (getinfojson != null){
		strvalue = getinfojson.Param;
		//alert(strvalue);
		if(strvalue == "Off"){
			value =0;			
		}
		if(strvalue == "On"){
			value =1;			
		}		
	}
	else
	{
		
	}
	return value;
}
function PowerViewGetFreeze()
{
	var value = 0;
	var strvalue = null;
	var cmd = null;
	var i = 0;
	var actionjson = {"Factory":"POWER_VIEW",
			  "Type":"PV8340-F2",
			  "Action_Item":"Freeze",
			  "Param":"0"
			  };
	cmd = JSON.stringify(actionjson);
	
	var getinfojson = PowerViewGet(cmd);
	if (getinfojson != null){
		strvalue = getinfojson.Param;
		//alert(strvalue);
		if(strvalue == "Off"){
			value =0;			
		}
		if(strvalue == "On"){
			value =1;			
		}		
	}
	else
	{
		
	}
	return value;
}
function PowerViewGetStrongHibition()
{
	var value = 0;
	var strvalue = null;
	var cmd = null;
	var i = 0;
	var actionjson = {"Factory":"POWER_VIEW",
			  "Type":"PV8340-F2",
			  "Action_Item":"Strong_Hibition",
			  "Param":"0"
			  };
	cmd = JSON.stringify(actionjson);
	
	var getinfojson = PowerViewGet(cmd);
	if (getinfojson != null){
		strvalue = getinfojson.Param;
		//alert(strvalue);
		if(strvalue == "Off"){
			value =0;			
		}
		if(strvalue == "On"){
			value =1;			
		}		
	}
	else
	{
		
	}
	return value;
}
function PowerViewGetDPosition()
{
	var value = 0;
	var strvalue = null;
	var cmd = null;
	var i = 0;
	var actionjson = {"Factory":"POWER_VIEW",
			  "Type":"PV8340-F2",
			  "Action_Item":"3D_Positioning",
			  "Param":"0"
			  };
	cmd = JSON.stringify(actionjson);
	
	var getinfojson = PowerViewGet(cmd);
	if (getinfojson != null){
		strvalue = getinfojson.Param;
		//alert(strvalue);
		if(strvalue == "Off"){
			value =0;			
		}
		if(strvalue == "On"){
			value =1;			
		}		
	}
	else
	{
		
	}
	return value;
}









//获得参数1，并写到table中展示
function initExposure()
{
	var actionjson = {"Factory":"POWER_VIEW",
			  "Type":"PV8340-F2",
			  "Action_Item":"Exposure_Mode",
			  "Param":"0"
			  };
	var cmd = JSON.stringify(actionjson);
	$.get(c_iniUrl+GetSetterCmdKV("camera_parameters_get",cmd),function(data){
		var returnValue;
		if ((data.indexOf("OK camera_parameters_get") >= 0)&&(data.indexOf("POWER_VIEW") >= 0) ) {		
			returnValue = data.substring(36);
		}	
		returnValue=JSON.parse(returnValue);//转换为json	
		var strvalue = returnValue.Param;
		
		var value = 0;
		if(strvalue == "Manul"){
			value = 0;
		}
		if(strvalue == "Auto"){
			value = 1;
		}
		if(strvalue == "Shutter_Priority"){
			value = 2;
		}
		if(strvalue == "Aperture_Priority"){
			value = 3;
		}
		//append到td上。
		var obj = CTRLARY["exposure_moudle"];//获得已经配置的对象//默认选择的value是0
		$("#exposuremoudle").append(obj.html);//append到td上，其中exposuremoudle是td的id  exposure_moudle
		//遍历并选中已经获得的参数值
		$("#exposure_moudle").val(value);
		Fixexpose();
	});
}


function PowerViewGetShutter_Moudle()
{
	var value = 0;
	var strvalue = null;
	var cmd = null;
	var i = 0;
	var actionjson = {"Factory":"POWER_VIEW",
			  "Type":"PV8340-F2",
			  "Action_Item":"Shutter",
			  "Param":"0"
			  };
	cmd = JSON.stringify(actionjson);
	
	var getinfojson = PowerViewGet(cmd);
	if (getinfojson != null){
		strvalue = getinfojson.Param;
		//alert(strvalue);
		var array = shuterlist.split(";");	
		
		for(i=0;i<=21;i++){
			if(strvalue ==array[i] )
			{
				value = i;
				break;
			}
		}		
	}
	else
	{
		
	}
	return value;
}


//重构方法,获得参数2
function initShutterMoudle()
{
	var actionjson = {"Factory":"POWER_VIEW",
			  "Type":"PV8340-F2",
			  "Action_Item":"Shutter",
			  "Param":"0"
			  };
	var cmd = JSON.stringify(actionjson);
	$.get(c_iniUrl+GetSetterCmdKV("camera_parameters_get",cmd),function(data){
		var returnValue;
		if ((data.indexOf("OK camera_parameters_get") >= 0)&&(data.indexOf("POWER_VIEW") >= 0) ) {		
			returnValue = data.substring(36);
		}	
		returnValue=JSON.parse(returnValue);//转换为json	
		var strvalue = returnValue.Param;
		var array = shuterlist.split(";");	
		var value = 0;
		for(i=0;i<=21;i++)
		{
			if(strvalue ==array[i] )
			{
				value = i;
				break;
			}
		}		
		//append到td上。
		var obj = CTRLARY["shutter_set"];//获得已经配置的对象,默认选择的value是0
		$("#shutter_container").append(obj.html);//append到td上，其中exposuremoudle是td的id
		//遍历并选中已经获得的参数值
		$("#shutter_set").val(value);
	});	
}


//增益参数获得方法重构
function initGainMoudle()
{
	var actionjson = {"Factory":"POWER_VIEW",
			  "Type":"PV8340-F2",
			  "Action_Item":"Gain",
			  "Param":"0"
			  };
	var cmd = JSON.stringify(actionjson);
	$.get(c_iniUrl+GetSetterCmdKV("camera_parameters_get",cmd),function(data){
		var returnValue;
		if ((data.indexOf("OK camera_parameters_get") >= 0)&&(data.indexOf("POWER_VIEW") >= 0) ) {		
			returnValue = data.substring(36);
		}	
		returnValue=JSON.parse(returnValue);//转换为json	
		var strvalue = returnValue.Param;
		var value = 0;
		var array = gain_list.split(";");	
		
		for(i=0;i<=15;i++){
			if(strvalue ==array[i] )
			{
				value = i;
				break;
			}
		}
	
		//append到td上。
		var obj = CTRLARY["gain_set"];//获得已经配置的对象,默认选择的value是0
		$("#gain_set_container").append(obj.html);//append到td上
		//遍历并选中已经获得的参数值
		$("#gain_set").val(value);
	});	
}


//初始化光圈
function initApertureMoudle()
{
	var actionjson ={"Factory":"POWER_VIEW",
			  "Type":"PV8340-F2",
			  "Action_Item":"Aperture",
			  "Param":"0"
			  };
	var cmd = JSON.stringify(actionjson);
	$.get(c_iniUrl+GetSetterCmdKV("camera_parameters_get",cmd),function(data){
		var returnValue;
		if ((data.indexOf("OK camera_parameters_get") >= 0)&&(data.indexOf("POWER_VIEW") >= 0) ) {		
			returnValue = data.substring(36);
		}	
		returnValue=JSON.parse(returnValue);//转换为json	
		var strvalue = returnValue.Param;
		var value = 0;
		var array = apelist.split(";");	
		for(i=0;i<=15;i++){
			if(strvalue ==array[i] )
			{
				value = i;
				break;
			}
		}
	
		//append到td上。
		var obj = CTRLARY["aperture"];//获得已经配置的对象,默认选择的value是0
		$("#aperture_container").append(obj.html);//append到td上
		//遍历并选中已经获得的参数值
		$("#aperture").val(value);
	});
}


//光圈模式重构
function initFocus_Mode()
{
	var actionjson ={"Factory":"POWER_VIEW",
			  "Type":"PV8340-F2",
			  "Action_Item":"Focus_Mode",
			  "Param":"0"
			  };
	var cmd = JSON.stringify(actionjson);
	$.get(c_iniUrl+GetSetterCmdKV("camera_parameters_get",cmd),function(data){
		var returnValue;
		if ((data.indexOf("OK camera_parameters_get") >= 0)&&(data.indexOf("POWER_VIEW") >= 0) ) {		
			returnValue = data.substring(36);
		}	
		returnValue=JSON.parse(returnValue);//转换为json	
		var strvalue = returnValue.Param;
		var value = 0;
		if(strvalue == "Auto"){
			value = 0;
		}
		if(strvalue == "Manul"){
			value = 1;
		}
		if(strvalue == "A_key_focus"){
			value = 2;
		}
	
		//append到td上。
		var obj = CTRLARY["focus_mode"];//获得已经配置的对象,默认选择的value是0
		$("#focus_mode_container").append(obj.html);//append到td上
		//遍历并选中已经获得的参数值
		$("#focus_mode").val(value);
	});
}

//聚焦距离
function initFocus_Extremes()
{
	var actionjson ={"Factory":"POWER_VIEW",
			  "Type":"PV8340-F2",
			  "Action_Item":"Focus_Extremes",
			  "Param":"0"
			  };
	var cmd = JSON.stringify(actionjson);
	$.get(c_iniUrl+GetSetterCmdKV("camera_parameters_get",cmd),function(data){
		var returnValue;
		if ((data.indexOf("OK camera_parameters_get") >= 0)&&(data.indexOf("POWER_VIEW") >= 0) ) {		
			returnValue = data.substring(36);
		}	
		returnValue=JSON.parse(returnValue);//转换为json	
		var strvalue = returnValue.Param;
		var value = 0;
		
		var array = focusextremeslist.split(";");	
		
		for(i=0;i<=11;i++){
			if(strvalue ==array[i] )
			{
				value = i;
				break;
			}
		}	
	
		//append到td上。
		var obj = CTRLARY["focus_extremes"];//获得已经配置的对象,默认选择的value是0
		$("#focus_extremes_container").append(obj.html);//append到td上
		//遍历并选中已经获得的参数值
		$("#focus_extremes").val(value);
	});
}

//白平衡代码重构
function initWhite_Balance()
{
	var actionjson ={"Factory":"POWER_VIEW",
			  "Type":"PV8340-F2",
			  "Action_Item":"White_Balance",
			  "Param":"0"
			  };
	var cmd = JSON.stringify(actionjson);
	$.get(c_iniUrl+GetSetterCmdKV("camera_parameters_get",cmd),function(data){
		var returnValue;
		if ((data.indexOf("OK camera_parameters_get") >= 0)&&(data.indexOf("POWER_VIEW") >= 0) ) {		
			returnValue = data.substring(36);
		}	
		returnValue=JSON.parse(returnValue);//转换为json	
		var strvalue = returnValue.Param;
		var value = 0;
		
		var array = swhite_balancelist.split(";");	
		
		for(i=0;i<=6;i++){
			if(strvalue ==array[i] )
			{
				value = i;
				break;
			}
		}
		//append到td上。
		var obj = CTRLARY["white_balance"];//获得已经配置的对象,默认选择的value是0
		$("#white_balance_container").append(obj.html);//append到td上
		//遍历并选中已经获得的参数值
		$("#white_balance").val(value);
		Fixawb();
	});
}

//红增益
function initRed_Gain()
{
	var actionjson ={"Factory":"POWER_VIEW",
			  "Type":"PV8340-F2",
			  "Action_Item":"Red_Gain",
			  "Param":"0"
			  };
	var cmd = JSON.stringify(actionjson);
	$.get(c_iniUrl+GetSetterCmdKV("camera_parameters_get",cmd),function(data){
		var returnValue;
		if ((data.indexOf("OK camera_parameters_get") >= 0)&&(data.indexOf("POWER_VIEW") >= 0) ) {		
			returnValue = data.substring(36);
		}	
		returnValue=JSON.parse(returnValue);//转换为json	
		var strvalue = returnValue.Param;
		var value = 0;
		
		value = strvalue;
		//append到td上。
		var obj = CTRLARY["red_gain"];//获得已经配置的对象,默认选择的value是0
		$("#red_gain_container").prepend(obj.html);//append到td上
		//遍历并选中已经获得的参数值
		$("#red_gain").val(value);
	});
}

//蓝增益
function initBlue_Gain()
{
	var actionjson ={"Factory":"POWER_VIEW",
			  "Type":"PV8340-F2",
			  "Action_Item":"Blue_Gain",
			  "Param":"0"
			  };
	var cmd = JSON.stringify(actionjson);
	$.get(c_iniUrl+GetSetterCmdKV("camera_parameters_get",cmd),function(data){
		var returnValue;
		if ((data.indexOf("OK camera_parameters_get") >= 0)&&(data.indexOf("POWER_VIEW") >= 0) ) {		
			returnValue = data.substring(36);
		}	
		returnValue=JSON.parse(returnValue);//转换为json	
		var strvalue = returnValue.Param;
		var value = 0;
		
		value = strvalue;
		//append到td上。
		var obj = CTRLARY["blue_gain"];//获得已经配置的对象,默认选择的value是0
		$("#blue_gain_container").prepend(obj.html);//append到td上
		//遍历并选中已经获得的参数值
		$("#blue_gain").val(value);
	});	
}

//日夜模式初始化
function initDay_Night()
{
	var actionjson = {"Factory":"POWER_VIEW",
			  "Type":"PV8340-F2",
			  "Action_Item":"Day_Night_Mode",
			  "Param":"0"
			  };
	var cmd = JSON.stringify(actionjson);
	$.get(c_iniUrl+GetSetterCmdKV("camera_parameters_get",cmd),function(data){
		var returnValue;
		if ((data.indexOf("OK camera_parameters_get") >= 0)&&(data.indexOf("POWER_VIEW") >= 0) ) {		
			returnValue = data.substring(36);
		}	
		returnValue=JSON.parse(returnValue);//转换为json	
		var strvalue = returnValue.Param;
		var value = 0;
		
		//alert(strvalue);
		if(strvalue == "Day"){
			value = 0;
		}
		if(strvalue == "Night"){
			value = 1;
		}
		if(strvalue == "Auto"){
			value = 2;
		}		
		//append到td上。
		var obj = CTRLARY["daynight"];//获得已经配置的对象,默认选择的value是0
		$("#daynight_container").prepend(obj.html);//append到td上
		//遍历并选中已经获得的参数值
		$("#daynight").val(value);
	});	
}
//日夜转换，敏感度
function initDNSensitivity()
{
	var actionjson = {"Factory":"POWER_VIEW",
			  "Type":"PV8340-F2",
			  "Action_Item":"Day_Night_Sensitivity",
			  "Param":"0"
			  };
	var cmd = JSON.stringify(actionjson);
	$.get(c_iniUrl+GetSetterCmdKV("camera_parameters_get",cmd),function(data){
		var returnValue;
		if ((data.indexOf("OK camera_parameters_get") >= 0)&&(data.indexOf("POWER_VIEW") >= 0) ) {		
			returnValue = data.substring(36);
		}	
		returnValue=JSON.parse(returnValue);//转换为json	
		var strvalue = returnValue.Param;
		var value = 0;
		
		value = strvalue;
		//append到td上。
		var obj = CTRLARY["dnsensitivity"];//获得已经配置的对象,默认选择的value是0
		$("#dnsensitivity_container").prepend(obj.html);//append到td上
		//遍历并选中已经获得的参数值
		$("#dnsensitivity").val(value);
	});	
}


function initGamma()
{
	var actionjson = {"Factory":"POWER_VIEW",
			  "Type":"PV8340-F2",
			  "Action_Item":"Gamma",
			  "Param":"0"
			  };
	var cmd = JSON.stringify(actionjson);
	$.get(c_iniUrl+GetSetterCmdKV("camera_parameters_get",cmd),function(data){
		var returnValue;
		if ((data.indexOf("OK camera_parameters_get") >= 0)&&(data.indexOf("POWER_VIEW") >= 0) ) {		
			returnValue = data.substring(36);
		}	
		returnValue=JSON.parse(returnValue);//转换为json	
		var strvalue = returnValue.Param;
		var value = 0;
		
		value = strvalue;
		//append到td上。
		var obj = CTRLARY["gamma"];//获得已经配置的对象,默认选择的value是0
		$("#gamma_container").prepend(obj.html);//append到td上
		//遍历并选中已经获得的参数值
		$("#gamma").val(value);
	});		
}


function initBlc()
{
	
	var actionjson =  {"Factory":"POWER_VIEW",
			  "Type":"PV8340-F2",
			  "Action_Item":"BLC",
			  "Param":"0"
			  };
	var cmd = JSON.stringify(actionjson);
	$.get(c_iniUrl+GetSetterCmdKV("camera_parameters_get",cmd),function(data){
		var returnValue;
		if ((data.indexOf("OK camera_parameters_get") >= 0)&&(data.indexOf("POWER_VIEW") >= 0) ) {		
			returnValue = data.substring(36);
		}	
		returnValue=JSON.parse(returnValue);//转换为json	
		var strvalue = returnValue.Param;
		var value = 0;
		
		if(strvalue == "Off"){
			value = 0;
		}
		if(strvalue == "On"){
			value = 1;
		}
		//append到td上。
		var obj = CTRLARY["blc"];//获得已经配置的对象,默认选择的value是0
		$("#blc_container").append(obj.html);//append到td上
		//遍历并选中已经获得的参数值
		$("#blc").val(value);
	});	

}


function initDenoise()
{
	var actionjson =  {"Factory":"POWER_VIEW",
			  "Type":"PV8340-F2",
			  "Action_Item":"Denoising",
			  "Param":"0"
			  };
	var cmd = JSON.stringify(actionjson);
	$.get(c_iniUrl+GetSetterCmdKV("camera_parameters_get",cmd),function(data){
		var returnValue;
		if ((data.indexOf("OK camera_parameters_get") >= 0)&&(data.indexOf("POWER_VIEW") >= 0) ) {		
			returnValue = data.substring(36);
		}	
		returnValue=JSON.parse(returnValue);//转换为json	
		var strvalue = returnValue.Param;
		var value = 0;
		value = strvalue;
		//append到td上。
		var obj = CTRLARY["denoising"];//获得已经配置的对象,默认选择的value是0
		$("#denoising_container").append(obj.html);//append到td上
		//遍历并选中已经获得的参数值
		$("#denoising").val(value);
	});	
}


function initTBrightness()
{
	var actionjson =  {"Factory":"POWER_VIEW",
			  "Type":"PV8340-F2",
			  "Action_Item":"Target_Brightness",
			  "Param":"0"
			  };
	var cmd = JSON.stringify(actionjson);
	$.get(c_iniUrl+GetSetterCmdKV("camera_parameters_get",cmd),function(data){
		var returnValue;
		if ((data.indexOf("OK camera_parameters_get") >= 0)&&(data.indexOf("POWER_VIEW") >= 0) ) {		
			returnValue = data.substring(36);
		}	
		returnValue=JSON.parse(returnValue);//转换为json	
		var strvalue = returnValue.Param;
		var value = 0;
		value = strvalue;
		//append到td上。
		var obj = CTRLARY["tbrightness"];//获得已经配置的对象,默认选择的value是0
		$("#tbrightness_container").prepend(obj.html);//append到td上
		//遍历并选中已经获得的参数值
		$("#tbrightness").val(value);
	});	

}


function initSharpness()
{
	
	var actionjson = {"Factory":"POWER_VIEW",
			  "Type":"PV8340-F2",
			  "Action_Item":"Sharpness",
			  "Param":"0"
			  };
	var cmd = JSON.stringify(actionjson);
	$.get(c_iniUrl+GetSetterCmdKV("camera_parameters_get",cmd),function(data){
		var returnValue;
		if ((data.indexOf("OK camera_parameters_get") >= 0)&&(data.indexOf("POWER_VIEW") >= 0) ) {		
			returnValue = data.substring(36);
		}	
		returnValue=JSON.parse(returnValue);//转换为json	
		var strvalue = returnValue.Param;
		var value = 0;
		value = strvalue;
		//append到td上。
		var obj = CTRLARY["sharpness"];//获得已经配置的对象,默认选择的value是0
		$("#sharpness_container").prepend(obj.html);//append到td上
		//遍历并选中已经获得的参数值
		$("#sharpness").val(value);
	});	
	
}


function initSaturation()
{
	var actionjson ={"Factory":"POWER_VIEW",
			  "Type":"PV8340-F2",
			  "Action_Item":"Saturation",
			  "Param":"0"
			  };
	var cmd = JSON.stringify(actionjson);
	$.get(c_iniUrl+GetSetterCmdKV("camera_parameters_get",cmd),function(data){
		var returnValue;
		if ((data.indexOf("OK camera_parameters_get") >= 0)&&(data.indexOf("POWER_VIEW") >= 0) ) {		
			returnValue = data.substring(36);
		}	
		returnValue=JSON.parse(returnValue);//转换为json	
		var strvalue = returnValue.Param;
		var value = 0;
		value = strvalue;
		//append到td上。
		var obj = CTRLARY["saturation"];//获得已经配置的对象,默认选择的value是0
		$("#saturation_container").prepend(obj.html);//append到td上
		//遍历并选中已经获得的参数值
		$("#saturation").val(value);
	});
}


function initContrast()
{
	var actionjson ={"Factory":"POWER_VIEW",
			  "Type":"PV8340-F2",
			  "Action_Item":"Contrast",
			  "Param":"0"
			  };
	var cmd = JSON.stringify(actionjson);
	$.get(c_iniUrl+GetSetterCmdKV("camera_parameters_get",cmd),function(data){
		var returnValue;
		if ((data.indexOf("OK camera_parameters_get") >= 0)&&(data.indexOf("POWER_VIEW") >= 0) ) {		
			returnValue = data.substring(36);
		}	
		returnValue=JSON.parse(returnValue);//转换为json	
		var strvalue = returnValue.Param;
		var value = 0;
		value = strvalue;
		//append到td上。
		var obj = CTRLARY["contrast"];//获得已经配置的对象,默认选择的value是0
		$("#contrast_container").prepend(obj.html);//append到td上
		//遍历并选中已经获得的参数值
		$("#contrast").val(value);
	});
}


function initDeffect()
{
	var actionjson ={"Factory":"POWER_VIEW",
			  "Type":"PV8340-F2",
			  "Action_Item":"Digital_Effects",
			  "Param":"0"
			  };
	var cmd = JSON.stringify(actionjson);
	$.get(c_iniUrl+GetSetterCmdKV("camera_parameters_get",cmd),function(data){
		var returnValue;
		if ((data.indexOf("OK camera_parameters_get") >= 0)&&(data.indexOf("POWER_VIEW") >= 0) ) {		
			returnValue = data.substring(36);
		}	
		returnValue=JSON.parse(returnValue);//转换为json	
		var strvalue = returnValue.Param;
		var value = 0;
		if(strvalue == "Off"){
			value =0;			
		}
		if(strvalue == "180_Flip"){
			value =1;			
		}
		if(strvalue == "Flip_Vertical"){
			value =2;			
		}
		if(strvalue == "Flip_Horizontal"){
			value =3;			
		}
		//append到td上。
		var obj = CTRLARY["deffect"];//获得已经配置的对象,默认选择的value是0
		$("#deffect_container").append(obj.html);//append到td上
		//遍历并选中已经获得的参数值
		$("#deffect").val(value);
	});

}


function initFogPenetration()
{
	var actionjson ={"Factory":"POWER_VIEW",
			  "Type":"PV8340-F2",
			  "Action_Item":"Fog_Penetration",
			  "Param":"0"
			  };
	var cmd = JSON.stringify(actionjson);
	$.get(c_iniUrl+GetSetterCmdKV("camera_parameters_get",cmd),function(data){
		var returnValue;
		if ((data.indexOf("OK camera_parameters_get") >= 0)&&(data.indexOf("POWER_VIEW") >= 0) ) {		
			returnValue = data.substring(36);
		}	
		returnValue=JSON.parse(returnValue);//转换为json	
		var strvalue = returnValue.Param;
		var value = 0;
		if(strvalue == "Off"){
			value =false;			
		}
		if(strvalue == "On"){
			value =true;			
		}		
		//append到td上。
		var obj = CTRLARY["fogpenetration"];//获得已经配置的对象,默认选择的value是0
		$("#fogpenetration_container").append(obj.html);//append到td上
		//遍历并选中已经获得的参数值
		$("#fogpenetration").attr("checked",value);
	});
}


function initFreeze()
{
	var actionjson = {"Factory":"POWER_VIEW",
			  "Type":"PV8340-F2",
			  "Action_Item":"Freeze",
			  "Param":"0"
			  };
	var cmd = JSON.stringify(actionjson);
	$.get(c_iniUrl+GetSetterCmdKV("camera_parameters_get",cmd),function(data){
		var returnValue;
		if ((data.indexOf("OK camera_parameters_get") >= 0)&&(data.indexOf("POWER_VIEW") >= 0) ) {		
			returnValue = data.substring(36);
		}	
		returnValue=JSON.parse(returnValue);//转换为json	
		var strvalue = returnValue.Param;
		var value = 0;
		if(strvalue == "Off"){
			value =false;			
		}
		if(strvalue == "On"){
			value =true;			
		}		
		//append到td上。
		var obj = CTRLARY["freeze"];//获得已经配置的对象,默认选择的value是0
		$("#freeze_container").append(obj.html);//append到td上
		//遍历并选中已经获得的参数值
		$("#freeze").attr("checked",value);
	});
	
}

function initStrongHibition()
{
	var actionjson = {"Factory":"POWER_VIEW",
			  "Type":"PV8340-F2",
			  "Action_Item":"Strong_Hibition",
			  "Param":"0"
			  };
	var cmd = JSON.stringify(actionjson);
	$.get(c_iniUrl+GetSetterCmdKV("camera_parameters_get",cmd),function(data){
		var returnValue;
		if ((data.indexOf("OK camera_parameters_get") >= 0)&&(data.indexOf("POWER_VIEW") >= 0) ) {		
			returnValue = data.substring(36);
		}	
		returnValue=JSON.parse(returnValue);//转换为json	
		var strvalue = returnValue.Param;
		var value = 0;
		if(strvalue == "Off"){
			value =false;			
		}
		if(strvalue == "On"){
			value =true;			
		}		
		//append到td上。
		var obj = CTRLARY["stronghibition"];//获得已经配置的对象,默认选择的value是0
		$("#stronghibition_container").append(obj.html);//append到td上
		//遍历并选中已经获得的参数值
		$("#stronghibition").attr("checked",value);
	});
}


function initZoomMag()
{
	var actionjson = {"Factory":"POWER_VIEW",
			  "Type":"PV8340-F2",
			  "Action_Item":"Zoom_Logo",
			  "Param":"0"
			  };
	var cmd = JSON.stringify(actionjson);
	$.get(c_iniUrl+GetSetterCmdKV("camera_parameters_get",cmd),function(data){
		var returnValue;
		if ((data.indexOf("OK camera_parameters_get") >= 0)&&(data.indexOf("POWER_VIEW") >= 0) ) {		
			returnValue = data.substring(36);
		}	
		returnValue=JSON.parse(returnValue);//转换为json	
		var strvalue = returnValue.Param;
		var value = 0;
		if(strvalue == "Off"){
			value =false;			
		}
		if(strvalue == "On"){
			value =true;			
		}	
		//append到td上。
		var obj = CTRLARY["zoommag"];//获得已经配置的对象,默认选择的value是0
		$("#zoommag_container").append(obj.html);//append到td上
		//遍历并选中已经获得的参数值
		$("#zoommag").attr("checked",value);
	});

}