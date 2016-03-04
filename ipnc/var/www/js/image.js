var target_stream_id;
/*
*JQuery 监听点击tab点击事件。
*/
$(document).ready(function(){
	//初始化展示第一个码流
	init();
	$("#tab_container span").click(function(){
		target_stream_id = $(this).attr('id');
		tabClickEffect();
	});
	
	var Accordion = function(el, multiple) {
		this.el = el || {};
		this.multiple = multiple || false;

		// Variables privadas
		var links = this.el.find('.link');
		// Evento
		links.on('click', {el: this.el, multiple: this.multiple}, this.dropdown)
	}

	Accordion.prototype.dropdown = function(e) {
		var $el = e.data.el;
			$this = $(this),
			$next = $this.next();

		$next.slideToggle();
		$this.parent().toggleClass('open');

		if (!e.data.multiple) {
			$el.find('.submenu').not($next).slideUp().parent().removeClass('open');
		};
	}	

	var accordion = new Accordion($('#accordion'), false);
 
});


//初始化函数，展示第一个码流
function init()
{
	//默认先打开第一个码流
	target_stream_id = document.getElementById("stream_1").id;
	tabClickEffect();
	
}

//tab点击效果变化
function tabClickEffect()
{
	//查找所有span
	span_array = $("#tab_container").children();
	for(i=0; i<span_array.length;i++)
	{
		if(target_stream_id==span_array[i].id)
		{
			
			$("#"+span_array[i].id).css({
					"font-weight":"bold",
					"background":"#999",
					"":""
				 });
		}
		else
		{
			$("#"+span_array[i].id).css({
					"font-weight":"normal",
					"background":"#333"
				 });
		}
	}
}

function flashLightSet(value)
{
	var requestStr;
	if(value==3)
	{
		$("#flash_config_tr").slideDown("fast",function(){
				$("#flash_config_tr td").css({dislplay:"block",border:"none"});
			});
		var coordinates = $("#province option:selected").attr("coordinates");
		requestStr = {
							"destination":"VD",
							"method":"setFlashConfig",
							"param":{
								"mode":"3",
								"longitude":coordinates.split(",")[0]+"", 
		                        "latitude":coordinates.split(",")[1]+""
							}
					  }

		var cmd = JSON.stringify(requestStr);//字符串化
		$.get("/vb.htm?language=ie"+"&flash_ctrl="+cmd,function(data){
			var back;
			if ((data.indexOf("OK flash_ctrl") >= 0) ) {		
				back = data.substring(25);
			}	
			back=JSON.parse(back);//转换为json
			$("#sunrise").html(back.result.sunrise);	
			$("#sunset").html(back.result.sunset);	
		});	
		
	}
	else
	{
		$("#flash_config_tr").slideUp("fast");
		requestStr = {
							"destination":"VD",
							"method":"setFlashConfig",
							"param":{
								"mode":value+""	  
							}
						}

		var cmd = JSON.stringify(requestStr);//字符串化
		$.get("/vb.htm?language=ie"+"&flash_ctrl="+cmd,function(data){});
			
	}
}


