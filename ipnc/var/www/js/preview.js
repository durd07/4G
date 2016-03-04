//视频图标控制对象
var VideoIconControl = 
{
	state : 0 , // 0:停止  1：正在播放。
	changePic : function(target,imageUrl){
		
		$(target).attr("src",imageUrl);		
	},
	startPlay : function(hidenTarget,showTarget,streamIndex,tdPosition,cache_time){
		this.state = 1; //修改为正在播放。
		
		//隐藏自己，显示stop
		this.showAndHidenObject(hidenTarget,showTarget);
		
		//StartVideoPlayer(selectedStreamIndex,TDPosition,video_cache_time);//播放方法
		
		VideoActiveXControl.videoPlay(streamIndex,tdPosition,cache_time);//使用封装的方法。
			
	},
	stopPlay :  function(hidenTarget,showTarget,startRecordTarget,stopRecordTarget){
		//隐藏自己，显示stop
		this.showAndHidenObject(hidenTarget,showTarget);
		//要停止视频录像
		this.stopRecord(stopRecordTarget,startRecordTarget);
		this.state = 0; //修改为停止播放。
		//停止视频播放
		//StopVideo();
		VideoActiveXControl.videoStop();//使用封装的方法。
	},
	snapPicture : function(){
		if(this.state==0)	
		{
			alert("先播放视频。");
			return;
		}
		//抓图
		VideoActiveXControl.snapShot();
	},
	startRecord : function(hidenTarget,showTarget){
		if(this.state==0)	
		{
			return;
		}
		this.showAndHidenObject(hidenTarget,showTarget);
		VideoActiveXControl.recordVideo();
		
	},
	stopRecord : function(hidenTarget,showTarget){
		if(this.state==0)	
		{
			return;
		}
		//隐藏自己，显示stop
		this.showAndHidenObject(hidenTarget,showTarget);
		//这里放停止录像的方法
		VideoActiveXControl.stopRecordVideo();

	},
	showAndHidenObject : function(hidenTarget,showTarget){
		$(hidenTarget).css({"display":"none"});
		$(showTarget).css({"display":"inline"});
	}
};

//协议控制图标
var protocalIconControl = 
{
	selected_protocal : 1 , // 1 tcp   2 udp
	switchProctocal : function(protocal){
		if(this.selected_protocal == protocal)
		{
			return;
		}
		this.selected_protocal = protocal;
		
		$("#protocal_td_1").removeClass();
		$("#protocal_td_2").removeClass();
		
		if(protocal==1) //选中了TCP
		{
			$("#protocal_td_1").addClass("tcp_style_1");
			$("#protocal_td_2").addClass("tcp_style_2");
			VideoActiveXControl.setProtocol(1);
		}
		else
		{
			$("#protocal_td_1").addClass("udp_style_1");
			$("#protocal_td_2").addClass("udp_style_2");
			VideoActiveXControl.setProtocol(0);
			
		}
		
		
	}
};