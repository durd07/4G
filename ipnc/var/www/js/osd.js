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


