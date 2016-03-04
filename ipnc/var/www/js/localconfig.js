//本地化配置命名空间
var LocalConfig = {};

LocalConfig.showMessage = function(result)
{
    if(result == true)
    {
        alert("保存成功.");
    }
    else
    {
       alert("保存失败。"); 
    }
};

$(document).ready(function() {
    var config = LocalConfigCtrl.readConfigFromLocalFile();
    
    $("#localconfig_input_snapshot").val(config.snapPicRoot.replace(/\\\\/g,"\\"));
    $("#localconfig_input_videorecord").val(config.videoRecordRoot.replace(/\\\\/g,"\\"));
    
    //浏览截图
    $("#localconfig_browse_snapshot").click(function() {
        $("#localconfig_input_snapshot").val(LocalConfigCtrl.browseLocalFileSystem());
    });
    //浏览录像本地化
    $("#localconfig_browse_videorecord").click(function() {
        $("#localconfig_input_videorecord").val(LocalConfigCtrl.browseLocalFileSystem());
    });
    //写文件
    $("#localconfig_saveBtn").click(function() {
        try
        {
            var snapPath = $("#localconfig_input_snapshot").val();
            var videoPath = $("#localconfig_input_videorecord").val();
            LocalConfigCtrl.writeLocalFile(snapPath,videoPath);
            LocalConfig.showMessage(true);
        }catch(e)
        {
            LocalConfig.showMessage(false);
        }
        
    });
});
