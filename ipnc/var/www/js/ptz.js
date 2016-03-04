/*
*获得当前3D开关开启还是关闭,获得后，初始化var里面的参数，备用
*/
function getCurrent3DState()
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
	
	var getinfojson = get3DConfigration(cmd);
	if (getinfojson != null){
		strvalue = getinfojson.Param;
		if(strvalue == "Off"){
			value =0;			
		}
		if(strvalue == "On"){
			value =1;			
		}		
	}
	threeDposition = value; //为全局变量赋值
	return value;
}

/**
发送请求，获取3D定位配置json字符串 。
*/
function get3DConfigration(action_itemjson)
{
	//alert("参数请求URL:"+c_iniUrl + GetSetterCmdKV("camera_parameters_get", action_itemjson));
	SendHttp(c_iniUrl + GetSetterCmdKV("camera_parameters_get", action_itemjson), false, GetResult);
	var txt = g_resultTxt;
	var response = null;
	var back = null;
	var backjson = null;
	if ((txt.indexOf("OK camera_parameters_get") >= 0)&&(txt.indexOf("POWER_VIEW") >= 0) ) {
		back = txt.substring(36);
	}	
	//alert("back"+back);
	backjson=JSON.parse(back);//转换为json
	//alert(backjson);
	return backjson;
}

//点击3D定位按钮，修改相机参数
function change3DState()
{
	var ctrl = null;
	var ctrljson = {"Factory":"POWER_VIEW",
		"Type":"PV8340-F2",
		"Action_Item":"3D_Positioning",
		"Param":"5"
	}; 
	switch (threeDposition){
		case 0: ctrljson.Param = "On";	 break;
		case 1: ctrljson.Param = "Off"; break;		
	} 
	ctrl = JSON.stringify(ctrljson);
	SendHttp(c_iniUrl + GetSetterCmdKV("camera_parameters_set", ctrl), false,change3DPositionCallBack);	
	
}

function change3DPositionCallBack()
{
	var obj = parent.document.getElementById("vlc") ;
	if (g_SubmitHttp.readyState == 4) {
		if (g_SubmitHttp.status == 200) {
			var txt = g_SubmitHttp.responseText;
			if (txt.indexOf("NG") >= 0) {
				g_httpOK = false;
				WS(GL("fail_"));
			}
			else
			{
				//MY_SUBMIT_OK();
				g_httpOK = true;
				WS(GL("ok_"));
				
				//reloadPage = $(window.parent.parent.document).find("#right_frame").attr("src");	
				if(threeDposition==1)
				{
					threeDposition = 0;	
					parent.document.TDPosition = 0;
					obj.IsDrawRect = 0;
				}
				else
				{
					threeDposition = 1;	
					parent.document.TDPosition = 1;
					obj.IsDrawRect = 1;
				}
				enable3DButton(threeDposition);//按钮开还是关
				
			}
		}
		else
		{
			alert(GL("err_submit_fail"));
			g_httpOK = false;
			WS(GL("fail_"));
		}
	}
  
}

//变更按钮的选中状态
function enable3DButton(value)
{
	if(value) //打开
	{
		$("#switch_3d").css({"background-image":"url(images/3D_on.png)"});
	}
	else  //关闭
	{
		$("#switch_3d").css({"background-image":"url(images/3D_off.png)"});
	}
}


//ptz界面初始化的时候调用。
$(document).ready(function(){
	//生成预置位数组，根据动态获取的已经设置的预置位来展示
	persetCtrl.init(null);
	$("#preset_container").append(persetCtrl.tableHtmlTag());
	
	//添加鼠标点击事件
	$("#preset_table tr").click(function(){
		persetCtrl.itemClick(this);
	});
	
	//添加鼠标经过
	$("#preset_table tr").mouseover(function(){
		$(this).addClass("preset_table_tr_hover");
	});
	//添加鼠标移开
	$("#preset_table tr").mouseout(function(){
		$(this).removeClass("preset_table_tr_hover");
	});
	
	
	//因为参数读取异步调用,每个回调函数内部处理业务，这点还需要注意。
	getParamsByAjax();
	
});


/*
读取红外、激光状态
*/
function getParamsByAjax()
{
	//读取红外状态
	var requestStr = {"Factory":"MINKING",
					  "Type":"TC26",
					  "Action_Item":"Ir_State",
					  "Param":"0"
					  };
	var cmd = JSON.stringify(requestStr);//字符串化
	$.get(c_iniUrl+GetSetterCmdKV("camera_parameters_get",cmd),function(data){
		var back;
		if ((data.indexOf("OK camera_parameters_get") >= 0)&&(data.indexOf("POWER_VIEW") >= 0) ) {		
			back = data.substring(36);
		}	
		if(back!=undefined)
		{
			back=JSON.parse(back);//转换为json
			if(back.Param)
			{
				PTZ_Ctrl.setRedLightState(back.Param);
			}
		}
	});
	
	
	//读取激光状态
	var requestStr = {"Factory":"MINKING",
					  "Type":"TC26",
					  "Action_Item":"Laser_State",
					  "Param":"0"
					  };
	var cmd = JSON.stringify(requestStr);//字符串化
	$.get("/vb.htm?language=ie"+"&camera_parameters_get="+cmd,function(data){
		var back;
		if ((data.indexOf("OK camera_parameters_get") >= 0)&&(data.indexOf("POWER_VIEW") >= 0) ) {		
			back = data.substring(36);
		}	
		if(back!=undefined)
		{
			back=JSON.parse(back);//转换为json
			if(back.Param)
			{
				PTZ_Ctrl.setLaserState(back.Param);
			}
		}
	});
}



//预置位相关的调用CTRL
var persetCtrl = 
{
	table_id : "preset_table", //定义这个是为了修改方便,CSS修改的话，这里要对应上。
	presetArray : [], //默认是空值
	clickItem : null,
	init : function(array){
		
		for(var i=1; i<65 ; i++)
		{
			var vo = new PreSet(i,"预置位"+i,false);
			
			this.presetArray.push(vo);
		}
		
		this.tableHtmlTag();	
	},
	tableHtmlTag : function(){//这里生成html标签
		var htmlTag = '<table id="'+this.table_id+'" width="100%">';
		for(var i = 0; i< this.presetArray.length; i++)
		{
			var vo = this.presetArray[i];

			htmlTag += "<tr>";
			htmlTag += '	<td style="text-align:center; width:50px;">'+vo.no+'</td>'+
						'	<td>'+vo.name+'</td><td class="operation_td"></td><td style="display:none;" >'+vo.isSetted+'</td>';
			htmlTag += "</tr>";
			
		}
		htmlTag += '</table> ';
		return htmlTag;
	},
	itemClick : function(that){
		var _item = that;
		var no = $(_item).find('td:eq(0)').text();
		var name = $(_item).find('td:eq(1)').text();
		var setted = $(_item).find('td:eq(3)').text();
		var vo = new PreSet(no,name,setted);
		this.clickItem = vo;
		
		$('#'+this.table_id+' tr').each(function(){
			$(this).removeClass("selected_tr");
			$(this).find('td:eq(2)').empty();
		});
		
		$(_item).addClass("selected_tr");
		
		var operatorImgHtml = '<img id="goPresetBtn" src="images/gotoPreset.gif" title="调用"  height="15px" width="15px" onclick="persetCtrl.callPreset()" />'+
                               ' <img id="editBtn" src="images/edit.gif"  title="设置" height="15px" width="15px"  onclick="persetCtrl.setPerset()" />'+
                               ' <img id="cleanBtn" src="images/clean.gif"  title="清除"  height="15px" width="15px"  onclick="persetCtrl.deletePreset()" />';
		$(_item).find('td:eq(2)').append(operatorImgHtml);
	
	},
	callPreset : function()
	{
		if(this.clickItem == undefined)
		{
			return;
		}
		this.clickItem.callPreset();
	},
	setPerset : function()
	{
		if(this.clickItem == undefined)
		{
			return;
		}
		this.clickItem.setPerset();
	},
	deletePreset : function()
	{
		if(this.clickItem == undefined)
		{
			return;
		}
		this.clickItem.deletePreset();
	}
};



//预置位构造函数
function PreSet(no,name,isSetted)
{
	this.no = no; 
	this.name = name;
	this.isSetted = isSetted;
	this.callPresetNo = parseInt(this.no) +16;
	this.callPreset = function(){
		SendHttp(c_iniUrl + GetSetterCmdKV("go_prepos_set", this.callPresetNo ), false);
	};
	this.setPerset = function(){
		if(vmorvp == 4)
		{
			if (Checkprepos() == false)
			return ;
			else
			{
				

				SendHttp(c_iniUrl + GetSetterCmdKV("add_prepos_set", this.callPresetNo ), false,SendImgCallBack);
			}
		}
		else 
		{

			SendHttp(c_iniUrl + GetSetterCmdKV("add_prepos_set", this.callPresetNo ), false,SendImgCallBack);
		}
	};
	this.deletePreset = function(){
		if(vmorvp == 4){
			if (Checkprepos() == false)
				return ;
			else
			{
				SendHttp(c_iniUrl + GetSetterCmdKV("del_prepos_set", this.callPresetNo ), false,SendImgCallBack);
			}
		}
		else
		{
			SendHttp(c_iniUrl + GetSetterCmdKV("del_prepos_set", this.callPresetNo ), false,SendImgCallBack);
		}

	};
}

/*
梳理代码暂时把图标的控制放到这里，PTZ其他方法如云台转动，以后再梳理。
*/
var PTZ_Ctrl = {
	current_redLight_state : 0,  //1:on  0:off  2:auto
	current_laser_state : 0,  //1:on  0:off 2:auto
	
	setRedLightState:function(value){
		this.current_redLight_state = value;
		//对应按钮颜色变化
		if(value==1)
		{
			$("#red_td_1").removeClass();//2、改变图标为开启，改变自动图标为关闭。
			$("#red_td_1").addClass("red_ligth_1_on");
			$("#red_td_2").removeClass();
			$("#red_td_2").addClass("red_ligth_2_off");
		}
		else if(value==2)
		{
			$("#red_td_1").removeClass();
			$("#red_td_1").addClass("red_ligth_1_off");
			$("#red_td_2").removeClass();
			$("#red_td_2").addClass("red_ligth_2_on");
		}
	},
	setLaserState : function(value){
		this.current_laser_state = value;
		if(value==1)
		{
			$("#laser_td_1").removeClass();//2、改变图标为开启，改变自动图标为关闭。
			$("#laser_td_1").addClass("laser_1_on");
			$("#laser_td_2").removeClass();
			$("#laser_td_2").addClass("laser_2_off");
		}
		else if(value==2)
		{
			$("#laser_td_1").removeClass();
			$("#laser_td_1").addClass("laser_1_off");
			$("#laser_td_2").removeClass();
			$("#laser_td_2").addClass("laser_2_on");
		}
	},
	
	brush:function(){
		Turn_On();
	},
	//红外点击
	redLightClick : function(){
		if(this.current_redLight_state==0 || this.current_redLight_state==2)
		{
			this.current_redLight_state = 1;//1、变化当前状态为开启，
			$("#red_td_1").removeClass();//2、改变图标为开启，改变自动图标为关闭。
			$("#red_td_1").addClass("red_ligth_1_on");
			$("#red_td_2").removeClass();
			$("#red_td_2").addClass("red_ligth_2_off");
			Turn_OnIR();
		}
		else
		{
			this.current_redLight_state = 0;//1、变化当前状态为关闭。
			$("#red_td_1").removeClass();//2、改变图标为关闭，改变自动图标为关闭。
			$("#red_td_1").addClass("red_ligth_1_off");
			$("#red_td_2").removeClass();
			$("#red_td_2").addClass("red_ligth_2_off");
			Turn_OffIR();
		}
	},
	//红外自动点击
	redLightAutoClick: function(){
		if(this.current_redLight_state == 2)
		{
			//变化自动图标、灯光图标为灰色，
			this.current_redLight_state = 0; //改变状态为关闭
			$("#red_td_1").removeClass();
			$("#red_td_1").addClass("red_ligth_1_off");
			$("#red_td_2").removeClass();
			$("#red_td_2").addClass("red_ligth_2_off");
			Turn_OffIR();
		}
		else if(this.current_redLight_state == 0 || this.current_redLight_state == 1)
		{
			//变化自动图标为开启，灯光图为灰色，调用红外自动方法，状态改为自动
			this.current_redLight_state = 2; 
			$("#red_td_1").removeClass();
			$("#red_td_1").addClass("red_ligth_1_off");
			$("#red_td_2").removeClass();
			$("#red_td_2").addClass("red_ligth_2_on");
			Turn_autoIR();
		}
	},
	//激光点击
	laserClick : function(){
		if(this.current_laser_state==0 || this.current_laser_state==2)
		{
			this.current_laser_state = 1;//1、变化当前状态为开启，
			$("#laser_td_1").removeClass();//2、改变图标为开启，改变自动图标为关闭。
			$("#laser_td_1").addClass("laser_1_on");
			$("#laser_td_2").removeClass();
			$("#laser_td_2").addClass("laser_2_off");
			Turn_Onlaser();
		}
		else
		{
			this.current_laser_state = 0;//1、变化当前状态为关闭。
			$("#laser_td_1").removeClass();//2、改变图标为关闭，改变自动图标为关闭。
			$("#laser_td_1").addClass("laser_1_off");
			$("#laser_td_2").removeClass();
			$("#laser_td_2").addClass("laser_2_off");
			Turn_Offlaser();
		}
	},
	//激光自动点击
	laserAutoClick: function(){
		if(this.current_laser_state == 2)
		{
			//变化自动图标、灯光图标为灰色，
			this.current_laser_state = 0; //改变状态为关闭
			$("#laser_td_1").removeClass();
			$("#laser_td_1").addClass("laser_1_off");
			$("#laser_td_2").removeClass();
			$("#laser_td_2").addClass("laser_2_off");
			Turn_Offlaser();
		}
		else if(this.current_laser_state == 0 || this.current_laser_state == 1)
		{
			//变化自动图标为开启，灯光图为灰色，调用红外自动方法，状态改为自动
			this.current_laser_state = 2; 
			$("#laser_td_1").removeClass();
			$("#laser_td_1").addClass("laser_1_off");
			$("#laser_td_2").removeClass();
			$("#laser_td_2").addClass("laser_2_on");
			Turn_autolaser();
		}
	},
};