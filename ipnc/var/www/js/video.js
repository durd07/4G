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
	//这里打补丁，监听组播地址是否有效，监听焦点离开
	$("#umipaddr1,#umipaddr2").focusout(function() {
	    var ip_1 = $(this).val().substr(0,3);
	    if(parseInt(ip_1) < 224 || parseInt(ip_1) > 239)
	    {
	        alert("组播地址不正确，请重新输入。");
	    }
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
	//显示div和隐藏div
	$("#video_stream_1").css("display","none");
	$("#video_stream_2").css("display","none");
	$("#video_stream_3").css("display","none");
	$("#video_stream_"+target_stream_id.substring(target_stream_id.length-1,target_stream_id.length)).css("display","block");
}


