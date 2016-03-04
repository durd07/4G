var PtzFunc = {};
var speedyt = 30;
InitLoad(); //网页加载就开始调用,每个页面都是


//命名空间
var selectCtrl = {};
selectCtrl.initSelect = function(content){
	var element = $(this);
	content = $(content);
	element.bind("change",function(){
		var data_name = element.find("option:selected").attr("data");
		element.trigger("select.change",data_name);
	});	
	
	//为element绑定事件处理函数
	element.bind("select.change",function(e,data_name){
		content.find("[data]").css("display","none");
		content.find("[data='"+data_name+"']").css("display","block");
	});
	
	var firstData = element.find("option:selected").attr("data");
	element.trigger("select.change",firstData);
};


PtzFunc.init = function()
{
	//showConfig($("#nav_div").find("span:eq(0)")[0],"#Cruise_Config");	
	//生成云台速度
	$( "#yt_speed" ).slider({
		range: "min",
		animate: "fast",
		min: 1,
		max: 63,
		value: 30,
		slide: function( event, ui ) {
			$( "#yt_speed_val" ).val( ui.value );
			speedyt = ui.value;
		}
	});
	$( "#yt_speed_val" ).val( $( "#yt_speed" ).slider( "value" ) );
	//生成预置位select
	generatorPresetSelect(); 
	adaptionComponent("ocx_container","vlc",16/9,0,150); 
	//守望里面的选择类型切换方法调用，动态换select
	selectCtrl.initSelect.call($("#watch_func"),"#watch_config_td");
	$("#watch_config_save").click(function(){
		WatchCtrl.Watch_Config();
	});
	
	//添加验证
	$("#stop_time").keypress(function(e) {
	    var keycode = e.keyCode;
		if($("#stop_time").val().length > 3)
		{
		    return false;
		}
	});
};

function onLoad()
{
	//开始播放视频。 
	VideoActiveXControl.videoPlay(1,0,300);//这里不使用3d定位、视频缓存时间默认300 
}

function showConfig(that,target)
{
	$("#nav_div span").each(function(){
		$(this).removeClass();	
	});
	$(that).addClass("selected_span");
	
	$("#func_container div").each(function(){
		$(this).css("display","none");
	});
	$(target).css("display","");
}

function PtzStop()
{  		
	PtzStop_PV();	
}

function PtzStop_PV()
{
	SendHttp(c_iniUrl + GetSetterCmdKV("ptz_stop_set", speedyt), false);
}

function PtzControl(command)
{
	switch(command)
	{
		case 'U' : SendHttp(c_iniUrl + GetSetterCmdKV("ptz_up_set", speedyt), false);  break;
		case 'D' : SendHttp(c_iniUrl + GetSetterCmdKV("ptz_down_set", speedyt), false);  break;
		case 'L' : SendHttp(c_iniUrl + GetSetterCmdKV("ptz_left_set", speedyt), false);  break;
		case 'R' : SendHttp(c_iniUrl + GetSetterCmdKV("ptz_right_set", speedyt), false);  break;
		
		case 'RU' : SendHttp(c_iniUrl + GetSetterCmdKV("ptz_right_up_set", speedyt), false);  break;
		case 'RD' : SendHttp(c_iniUrl + GetSetterCmdKV("ptz_right_down_set", speedyt), false);  break;
		case 'LU' : SendHttp(c_iniUrl + GetSetterCmdKV("ptz_left_up_set", speedyt), false);  break;
		case 'LD' : SendHttp(c_iniUrl + GetSetterCmdKV("ptz_left_down_set", speedyt), false);  break;
		default : PtzStop(); break;
	}
}
function generatorPresetSelect()
{
	var htmlText = '<select onChange="goPreset(this);" onclick="goPreset(this);">';
	for(var i = 1; i<65; i++)
	{
		htmlText += '<option value="'+i+'">预置位'+i+'</option>';
	}
	htmlText += '</select>';
	$("#preset_td").append(htmlText);
	
}
function goPreset(target)
{
	var no = parseInt(+$(target).val()+16);
	SendHttp(c_iniUrl + GetSetterCmdKV("go_prepos_set", no), false);
}

//自适应接口调用
function adaptionComponent(container,target,radio,margin_w,margin_h)
{
	var width = document.getElementById(container).offsetWidth - margin_w;
	var height = document.getElementById(container).offsetHeight-margin_h;
	

	if(width/height > radio)
	{
		target_width = height*radio;
		target_height = height;
		$("#"+target).css({"width":target_width,"height":target_height,"position":"absolute","left":(width-target_width)/2,"top":0});	
		$("#"+target).css("width:"+height*radio+"  height:"+height+ "  left:"+(width-target_width)/2 +  "  top:0");
	}
	else if(width/height < radio) 
	{
		target_width = width;
		target_height = width / radio;
		$("#"+target).css({"width":width,"height": width / radio,"position":"absolute","left":0,"top": (height-target_height)/2});
		$("#"+target).css("width:"+width+"  height:"+ width / radio+ "  left:0"+ "  top:"+(height-target_height)/2);
		
	}
}

/*
*具体接口含义请参考文档说明
*/
var CruiseCtrl = {	
	Cruise_Config : function(){
		var lineno = $("#cruise_config_line").val();
		var presetno = FixNum(+$("#preset_td").find("select").val()+16,3);
		if(+$("#stop_time").val() > 120)
		{
		    alert('时间最长120秒。');
		    return;
		}
		var time = FixNum($("#stop_time").val(),3);
		var param = lineno+presetno+time+"";
		//ajax发送请求
		var requestStr = {"Factory":"MINKING",
				"Type":"TC26",
				"Action_Item":"Cruise_Config",
				"Param":param
		};
		var cmd = JSON.stringify(requestStr);//字符串化
		$.get("/vb.htm?language=ie"+"&ptz_parameters_set="+cmd,function(data){});
	},
	Cruise_Start : function(){
		var param = parseInt($("#cruise_line").val())+"";
		var requestStr = {"Factory":"MINKING",
				"Type":"TC26",
				"Action_Item":"Cruise_Start",
				"Param":param
		};
		var cmd = JSON.stringify(requestStr);//字符串化
		$.get("/vb.htm?language=ie"+"&ptz_parameters_set="+cmd,function(data){});
	},
	Cruise_Stop : function(){
		var requestStr = {"Factory":"MINKING",
				"Type":"TC26",
				"Action_Item":"Cruise_Stop",
				"Param":"0"
		};
		var cmd = JSON.stringify(requestStr);//字符串化
		$.get("/vb.htm?language=ie"+"&ptz_parameters_set="+cmd,function(data){});
	},
	Cruise_Clear : function(){
		var lineno = parseInt($("#cruise_config_line").val())+"";
		var requestStr = {"Factory":"MINKING",
				"Type":"TC26",
				"Action_Item":"Cruise_Clear",
				"Param":lineno
		};
		var cmd = JSON.stringify(requestStr);//字符串化
		$.get("/vb.htm?language=ie"+"&ptz_parameters_set="+cmd,function(data){});
	}
};

var LearnCtrl = {
	Learn_Begin : function(value){
		var requestStr = {"Factory":"MINKING",
						  "Type":"TC26",
						  "Action_Item":"Learn_Begin",
						  "Param":value+""
						  };
		var cmd = JSON.stringify(requestStr);//字符串化
		$.get("/vb.htm?language=ie"+"&ptz_parameters_set="+cmd,function(data){});	
	},
	Learn_End : function(){
		var requestStr = {"Factory":"MINKING",
					  "Type":"TC26",
					  "Action_Item":"Learn_End",
					  "Param":"0"
					  };
		var cmd = JSON.stringify(requestStr);//字符串化
		$.get("/vb.htm?language=ie"+"&ptz_parameters_set="+cmd,function(data){});	
	},
	Play_Start : function(value){
		var requestStr = {"Factory":"MINKING",
						  "Type":"TC26",
						  "Action_Item":"Play_Start",
						  "Param":value+""
						  };
		var cmd = JSON.stringify(requestStr);//字符串化
		$.get("/vb.htm?language=ie"+"&ptz_parameters_set="+cmd,function(data){});	
	},
	Play_Stop : function(){
		var requestStr = {"Factory":"MINKING",
					  "Type":"TC26",
					  "Action_Item":"Play_Stop",
					  "Param":"0"
					  };
		var cmd = JSON.stringify(requestStr);//字符串化
		$.get("/vb.htm?language=ie"+"&ptz_parameters_set="+cmd,function(data){});	
	},
	Remove_Learn : function(value){
		var requestStr = {"Factory":"MINKING",
						  "Type":"TC26",
						  "Action_Item":"Remove_Learn",
						  "Param":value+""
						  };
		var cmd = JSON.stringify(requestStr);//字符串化
		$.get("/vb.htm?language=ie"+"&ptz_parameters_set="+cmd,function(data){});	
	}
};

var ScanCtrl = {
	Scan_Config_Begin:function(value){
		var requestStr = {"Factory":"MINKING",
						  "Type":"TC26",
						  "Action_Item":"Scan_Config_Begin",
						  "Param":"1"
						  };
		var cmd = JSON.stringify(requestStr);//字符串化
		$.get("/vb.htm?language=ie"+"&ptz_parameters_set="+cmd,function(data){});	
	},
	Scan_Config_End:function(value){
		var requestStr = {"Factory":"MINKING",
						  "Type":"TC26",
						  "Action_Item":"Scan_Config_End",
						  "Param":"1"
						  };
		var cmd = JSON.stringify(requestStr);//字符串化
		$.get("/vb.htm?language=ie"+"&ptz_parameters_set="+cmd,function(data){});
	},
	Scan_Start:function(value){
		var requestStr = {"Factory":"MINKING",
						  "Type":"TC26",
						  "Action_Item":"Scan_Start",
						  "Param":"1"
						  };
		var cmd = JSON.stringify(requestStr);//字符串化
		$.get("/vb.htm?language=ie"+"&ptz_parameters_set="+cmd,function(data){});
	},
	Scan_Stop:function(value){
		var requestStr = {"Factory":"MINKING",
						  "Type":"TC26",
						  "Action_Item":"Scan_Stop",
						  "Param":"0"
						  };
		var cmd = JSON.stringify(requestStr);//字符串化
		$.get("/vb.htm?language=ie"+"&ptz_parameters_set="+cmd,function(data){});
	}
	
};

//守望接口
var WatchCtrl = {
	Watch_Config : function(){
		var value = $("#watch_time").val();
		if(!Validator.isNumber(value))
		{
			alert("时间输入无效");
		}
		if(value<5 || value > 720)
		{
		    alert('时间范围在5~720秒之间。');
		}
		value = FixNum(value,3);
		var mode = $("#watch_func").val();
		var data_name = $("#watch_func").find("option:selected").attr("data");
		var subno = $("#watch_config_td").find(">[data='"+data_name+"']").val();
		value = value + "" + mode+""+subno;
		var requestStr = {"Factory":"MINKING",
						  "Type":"TC26",
						  "Action_Item":"Watch_Config",
						  "Param":value+""
						  };
		var cmd = JSON.stringify(requestStr);//字符串化
		$.get("/vb.htm?language=ie"+"&ptz_parameters_set="+cmd,function(data){});
	},
	Watch_Open: function(){
		var requestStr = {"Factory":"MINKING",
						  "Type":"TC26",
						  "Action_Item":"Watch_Open",
						  "Param":"0"
						  };
		var cmd = JSON.stringify(requestStr);//字符串化
		$.get("/vb.htm?language=ie"+"&ptz_parameters_set="+cmd,function(data){});
	},
	Watch_Close: function(){
		var requestStr = {"Factory":"MINKING",
						  "Type":"TC26",
						  "Action_Item":"Watch_Close",
						  "Param":"0"
						  };
		var cmd = JSON.stringify(requestStr);//字符串化
		$.get("/vb.htm?language=ie"+"&ptz_parameters_set="+cmd,function(data){});
	}
};

//zoom相关操作
var zoomCtrl = {
	tele:function(){
		var ctrl = null;
		var ctrljson = {"Factory":"POWER_VIEW",
					  "Type":"PV8340-F2",
					  "Action_Item":"Zoom_Near",
					  "Param":"5"
					  };
		var speedjx = Math.min(speedyt,7);
	
		ctrljson.Param = speedjx.toString();
			ctrl = JSON.stringify(ctrljson);
		SendHttp(c_iniUrl + GetSetterCmdKV("camera_parameters_set", ctrl), false);		
	},
	wide:function(){
		
		var ctrl = null;
		var ctrljson = {"Factory":"POWER_VIEW",
					  "Type":"PV8340-F2",
					  "Action_Item":"Zoom_Far",
					  "Param":"5"
					  };
			var speedjx = Math.min(speedyt,7);
			ctrljson.Param = speedjx.toString();
			ctrl = JSON.stringify(ctrljson);
		SendHttp(c_iniUrl + GetSetterCmdKV("camera_parameters_set", ctrl), false);				  
			
	},
	zoomStop:function(){
		
		var ctrl = null;
		var ctrljson = {"Factory":"POWER_VIEW",
					  "Type":"PV8340-F2",
					  "Action_Item":"Zoom_Stop",
					  "Param":"5"
					  };
		var speedjx = Math.min(speedyt,7);
		ctrljson.Param = speedjx.toString();
		ctrl = JSON.stringify(ctrljson);
		SendHttp(c_iniUrl + GetSetterCmdKV("camera_parameters_set", ctrl), false);	
			
	}
};

//聚焦相关操作
var focusCtrl = {
	near : function(){
		var ctrl = null;
		var ctrljson = {"Factory":"POWER_VIEW",
					  "Type":"PV8340-F2",
					  "Action_Item":"Focus_Near",
					  "Param":"5"
					  };
			var speedjx = Math.min(speedyt,7);
			ctrljson.Param = speedjx.toString();
			ctrl = JSON.stringify(ctrljson);
			//alert(ctrl);
		SendHttp(c_iniUrl + GetSetterCmdKV("camera_parameters_set", ctrl), false);				
		
	},
	far : function(){
		var ctrl = null;
		var ctrljson = {"Factory":"POWER_VIEW",
					  "Type":"PV8340-F2",
					  "Action_Item":"Focus_Far",
					  "Param":"5"
					  };
			var speedjx =Math.min(speedyt,7);
			ctrljson.Param = speedjx.toString();
			ctrl = JSON.stringify(ctrljson);
			//alert(ctrl);
		SendHttp(c_iniUrl + GetSetterCmdKV("camera_parameters_set", ctrl), false);			
		
	},
	focusStop : function(){
		var ctrl = null;
		var ctrljson = {"Factory":"POWER_VIEW",
					  "Type":"PV8340-F2",
					  "Action_Item":"Focus_Stop",
					  "Param":"5"
					  };
			ctrljson.Param = Math.min(speedyt,7).toString();
			ctrl = JSON.stringify(ctrljson);
			//alert(ctrl);
		SendHttp(c_iniUrl + GetSetterCmdKV("camera_parameters_set", ctrl), false);				
	}
};

/**
 *初始化调用 
 */
$(document).ready(function(){
    onLoad();
    PtzFunc.init();
    $(window).resize(function() {
        setTimeout(function(){adaptionComponent("ocx_container","vlc",16/9,0,150);},10);
    });
});
