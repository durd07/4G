var myMenu; //资源列表对象
var dev_type = device_type;
var jx = C_Movement;

// Basic Configuration - 云台1,松下机芯使用，现在基本不使用了
var ytbase_config_json = [

	{"title":"video","content":[{"label":"video","url":"video.htm", "target":"right_iframe"},
								  {"label":"osd_set","url":"osd.htm", "target":"right_iframe"}]},
	{"title":"camera","content":[{"label":"camera_para","url":"image.htm", "target":"right_iframe"}]},
	{"title":"network","content":[{"label":"network_para","url":"net.htm", "target":"right_iframe"}]},								
	{"title":"system","content":[{"label":"sysinfo","url":"sysinfo.htm" ,"target":"right_iframe"},
								  {"label":"sys_maintain","url":"smaintain.htm", "target":"right_iframe"},
								  {"label":"time_set","url":"sdt.htm", "target":"right_iframe"},								 
								  {"label":"log","url":"aevt.htm" ,"target":"right_iframe"}]}
];


// Basic Configuration - 云台2，动力视讯机芯使用
var pvytbase_config_json = [
	{"title":"video","content":[{"label":"video","url":"video_power.htm", "target":"right_iframe"},
								  {"label":"osd_set","url":"osd_power.htm", "target":"right_iframe"}]},
	{"title":"camera","content":[{"label":"camera_para","url":"image_power.htm", "target":"right_iframe"}]},
	{"title":"network","content":[{"label":"network_para","url":"net.htm", "target":"right_iframe"}]},								
	{"title":"system","content":[{"label":"sysinfo","url":"sysinfo.htm" ,"target":"right_iframe"},
								  {"label":"sys_maintain","url":"smaintain.htm", "target":"right_iframe"},
								  {"label":"time_set","url":"sdt.htm", "target":"right_iframe"},								 
								  {"label":"local_config","url":"localconfig.html", "target":"right_iframe"},								 
								  {"label":"log","url":"aevt.htm" ,"target":"right_iframe"}]}
];


// Basic Configuration - 枪机基础信息配置
var qjbase_config_json = [
	{"title":"video","content":[{"label":"video","url":"video.htm", "target":"right_iframe"},
								  {"label":"osd_set","url":"osd.htm", "target":"right_iframe"}]},
	{"title":"camera","content":[{"label":"camera_para","url":"image_qj.htm", "target":"right_iframe"}]},
	{"title":"network","content":[{"label":"network_para","url":"net.htm", "target":"right_iframe"}]},
								  
	{"title":"system","content":[{"label":"sysinfo","url":"sysinfo.htm" ,"target":"right_iframe"},
								  {"label":"sys_maintain","url":"smaintain.htm", "target":"right_iframe"},
								  {"label":"time_set","url":"sdt.htm", "target":"right_iframe"},
								  {"label":"local_config","url":"localconfig.html", "target":"right_iframe"},								 
								  {"label":"log","url":"aevt.htm" ,"target":"right_iframe"}]}
];


//Advance Configuration -云台
var ytadvance_config_json = [
	{"title":"secure","content":[{"label":"suser","url":"suser.htm", "target":"right_iframe"}]},								  
	{"title":"event","content":[{"label":"alarm_set","url":"aenable.htm", "target":"right_iframe"},
								//{"label":"roi","url":"roi.htm", "target":"right_iframe"},
								{"label":"motion_detect","url":"motion.htm", "target":"right_iframe"},	
								{"label":"pmask","url":"pmask.htm", "target":"right_iframe"}]},
	{"title":"storage","content":[{"label":"storage_range","url":"rsch.htm", "target":"right_iframe"},
								  {"label":"sd_card","url":"setcard.htm", "target":"right_iframe"}]},	
	{"title":"platform","content":[{"label":"platformset","url":"platformset.htm", "target":"right_iframe"}]},
	{"title":"gb_28181","content":[{"label":"gb_28181","url":"gbsip.htm", "target":"right_iframe"}]},
	{"title":"ptz_advance","content":[{"label":"ptz_advance","url":"ptz_function.html", "target":"right_iframe"},
									  {"label":"ptz_schedule","url":"ptz_schedule.htm", "target":"right_iframe"}]}					  
	
];


//Advance Configuration -枪机
var qjadvance_config_json = [
	{"title":"secure","content":[{"label":"suser","url":"suser.htm", "target":"right_iframe"}]},	
	{"title":"event","content":[{"label":"alarm_set","url":"aenable.htm", "target":"right_iframe"},
								//{"label":"roi","url":"roi.htm", "target":"right_iframe"},
								{"label":"motion_detect","url":"motion.htm", "target":"right_iframe"},	
								{"label":"pmask","url":"pmask.htm", "target":"right_iframe"}]},
	{"title":"storage","content":[{"label":"storage_range","url":"rsch.htm", "target":"right_iframe"},
								  {"label":"sd_card","url":"setcard.htm", "target":"right_iframe"}]},	
	
	{"title":"platform","content":[{"label":"platformset","url":"platformset.htm", "target":"right_iframe"}]},
								  
	{"title":"gb_28181","content":[{"label":"gb_28181","url":"gbsip.htm", "target":"right_iframe"}]}
];

//出入口高级配置
var entrance_advance_config_json = [
	{"title":"secure","content":[{"label":"suser","url":"suser.htm", "target":"right_iframe"}]},	
	{"title":"event","content":[{"label":"alarm_set","url":"aenable.htm", "target":"right_iframe"},
								{"label":"motion_detect","url":"motion.htm", "target":"right_iframe"},	
								{"label":"pmask","url":"pmask.htm", "target":"right_iframe"}]},
	{"title":"storage","content":[{"label":"storage_range","url":"rsch.htm", "target":"right_iframe"},
								  {"label":"sd_card","url":"setcard.htm", "target":"right_iframe"}]},	
	{"title":"platform","content":[{"label":"platformset","url":"platformset.htm", "target":"right_iframe"}]},
	{"title":"gb_28181","content":[{"label":"gb_28181","url":"gbsip.htm", "target":"right_iframe"}]},
	{"title":"intelligent_config","content":[{"label":"intelligent_config","url":"intelligent/entrance_config.html", "target":"right_iframe"}]}
];


/*
*添加菜单点击事件。
*初始化加载菜单的功能。
*/
$(document).ready(function(){	
	init();
	$("#menu1").click(function(){
		hidenTree();
		if((dev_type == 3)||(dev_type == 4)){			
			
			if(jx == 1){
				$("#right_frame").attr("src","preview.htm");
			}
			if(jx ==2){
				$("#right_frame").attr("src","preview_power.htm");
			}
		}
		else {
			$("#right_frame").attr("src","preview.htm");
		}
		
		//新增选中效果
		addSelectedClassToMenu(this);
	});
  
	$("#menu2").click(function(){
		showTree();
		if(dev_type==1){//枪机	
			showResourceTree(qjbase_config_json);
		}
		if(dev_type==2 ||dev_type==5){//枪机卡口 + 出入口，暂时没有差异，以后差异大了，就换网页
			showResourceTree(qjbase_config_json);
		}
		if(dev_type==3){//云台 机芯-1  机芯-2
			if(jx == 1){
				showResourceTree(ytbase_config_json);
			}
			if(jx ==2){
				showResourceTree(pvytbase_config_json);
			}
		}
		if(dev_type==4){//设备类型	
			if(jx == 1){
				showResourceTree(ytbase_config_json);
			}
			if(jx ==2){
				showResourceTree(pvytbase_config_json);
			}
		}
		
		//默认显示页
		if((dev_type == 3)||(dev_type == 4)){			
			if(jx == 1){
				$("#right_frame").attr("src","video.htm");
			}
			if(jx == 2){
				$("#right_frame").attr("src","video_power.htm"); 
			}
		}
		else{
			$("#right_frame").attr("src","video.htm");
		}	
		
		addSelectedClassToMenu(this);
		//默认选中树形列表的第一个
		$("#menu a:first").addClass("selected_div_a");
		
	});
	
	
	$("#menu3").click(function(){
		showTree();
	    if(dev_type==1){//设备类型	park
			showResourceTree(qjadvance_config_json);
		}
		if(dev_type==2 ){//设备类型	VM
			showResourceTree(qjadvance_config_json);
		}
		if(dev_type==3){//设备类型	VM_P
			showResourceTree(ytadvance_config_json);
		}
		if(dev_type==4){//设备类型	VP
			showResourceTree(ytadvance_config_json);
		}			 
		if(dev_type==5){//设备类型	出入口
			showResourceTree(entrance_advance_config_json);
		}
		
		//默认点击后，展示user配置页面
		$("#right_frame").attr("src","suser.htm");
		
		addSelectedClassToMenu(this);
		//默认选中树形列表的第一个
		$("#menu a:first").addClass("selected_div_a");
	});
	
});


/*
1、初始化调用，初始化界面隐藏树状结构。
2、根据权限控制菜单的显示和隐藏
3、改变显示的title
*/
function init()
{
	hidenTree();
	if((dev_type == 3)||(dev_type == 4)){
		if(jx == 1){
			$("#right_frame").attr("src","preview.htm");
			}
		if(jx ==2){//
			$("#right_frame").attr("src","preview_power.htm");
		}
	}
	else{
		$("#right_frame").attr("src","preview.htm");
	}
	//控制菜单的显示和隐藏
	if(loginauth == 1)
	{
		$("#menu2").css({"border-right":"1px solid #aaa"});
		$("#menu3").css({"display":"none","border-right":"1px solid #aaa"});
	}
	//改变标题
	Title_change();
}
/**
*展示预览界面，因为这个界面没有资源树，所以这里把树隐藏
**/
function hidenTree()
{
	$("#main_body_left_tree").animate({
			left:'-160px'
		},
		0,
		'swing',
		function(){ 
			$("#main_frame_inner_html").css("margin-left","0");
			$("#main_body_left_tree").hide();
		}
	);
}

//显示Tree
function showTree()
{
	$("#main_body_left_tree").animate({
		left:'0'},
		40,
		 'swing',
		 function(){ 
			$("#main_frame_inner_html").css("margin-left","160px");
			$("#main_body_left_tree").show();
		 }
	 );
}

//改变标题栏显示title
function Title_change()
{		
	switch(device_type)	
	{
		case '1' : document.title = GL("parking_detection_ipc"); break;
		case '2' : document.title = GL("vehicle_detect_ipc");    break;
		case '3' : document.title = GL("vehicle_detect_ptz_ipc");break;
		case '4' : document.title = GL("illegal_park_detect");   break;
		default:  document.title = "IP Camera Configuration";    break;
	}
}

//选择语言下拉框
function LangChange()
{
  if (g_s_mui == 2)
    document.getElementById("lang").selectedIndex = 0;
  else
    document.getElementById("lang").selectedIndex = 1;
}

/**
*创建树形列表
**/
function showResourceTree(jsonObj)
{
	$("#menu").remove();
	htmlStr = "<div id='menu' class='sdmenu'>";
	for(i = 0 ; i<jsonObj.length;i++)
	{
		title = GL(jsonObj[i].title);
	  	nodeArray = jsonObj[i].content;
	  	htmlStr+="<div class='collapsed'>";
	  	htmlStr+="<span>"+title+"</span>";
	  	for(j=0; j<nodeArray.length; j++)
	 	{
		 	 htmlStr+="<a href='"+nodeArray[j].url+"' target='"+nodeArray[j].target+"' class='tree_href'>"+GL(nodeArray[j].label)+"</a>";
	 	}
	  	htmlStr+="</div>";
	}
	htmlStr += "</div>"  
	$("#main_body_left_tree").append(htmlStr); 
	myMenu = new SDMenu("menu");
	myMenu.init();
}


function addSelectedClassToMenu(target)
{
	$("#menu1").removeClass("menu_selected");
	$("#menu2").removeClass("menu_selected");
	$("#menu3").removeClass("menu_selected");
	$(target).addClass("menu_selected");
}
