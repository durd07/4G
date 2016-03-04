//page's init function
$(document).ready(function() {
    //1、get video_cache configuration
    get_ocx_cache();
    //2、获得模拟视频配置参数
    getAVConfig();
});

//读取得控件视频缓存时间
function get_ocx_cache() {
    var requestStr = {
        "Factory" : "POWER_VIEW",
        "Type" : "PV8340-F2",
        "Action_Item" : "Cache_Settings",
        "Param" : "0"
    };
    var cmd = JSON.stringify(requestStr);
    //字符串化
    $.get(c_iniUrl + GetSetterCmdKV("camera_parameters_get", cmd), function(data) {
        var back;
        if ((data.indexOf("OK camera_parameters_get") >= 0) && (data.indexOf("POWER_VIEW") >= 0)) {
            back = data.substring(36);
        }
        back = JSON.parse(back);
        //转换为json
        $("#cache").val(back.Param);
        //设置input值
    });
};

/**
 *获得模拟视频配置参数
 */
function getAVConfig() {
    var requestStr = {
        "Factory" : "-1",
        "Type" : "-1",
        "Action_Item" : "av_config_all",
        "Param" : ""
    };
    var cmd = JSON.stringify(requestStr);

    $.get(c_iniUrl + GetSetterCmdKV("analog_videoconfig_get", cmd), function(data) {
        var back;
        var reg = /analog_videoconfig_get(.+)/i;
        var arr = reg.exec(data);
        if (arr != null && arr[1] != null) {
            back = JSON.parse(arr[1]);
        }
        //转换为json
        var param = back.Param;
        //设置input值
        $("#av_brightness").val(+param.substr(0, 3));
        $("#av_contrast").val(+param.substr(3, 3));
        $("#av_saturation").val(+param.substr(6, 3));
        $("#av_hue").val(+param.substr(9, 3));
    });
};

//设置控件缓存时间调用方法
function set_ocx_cache() {
    var value = $("#cache").val();
    if (!Validator.isNumber(value)) {
        alert("无效输入");
        return;
    }
    var settingStr = {
        "Factory" : "POWER_VIEW",
        "Type" : "PV8340-F2",
        "Action_Item" : "Cache_Settings",
        "Param" : value
    };
    var cmd = JSON.stringify(settingStr);
    //字符串化
    $.get(c_iniUrl + GetSetterCmdKV("camera_parameters_set", cmd), function(data) {
        alert('OK');
    });
}

/**
 *保存模拟视频参数配置
 */
function save_av_config() {
    var brightnessValue = FixNum($("#av_brightness").val(), 3);
    var contrastValue = FixNum($("#av_contrast").val(), 3);
    var saturationValue = FixNum($("#av_saturation").val(), 3);
    var hueValue = FixNum($("#av_hue").val(), 3);

    var value = brightnessValue + contrastValue + saturationValue + hueValue;

    var settingStr = {
        "Factory" : "-1",
        "Type" : "-1",
        "Action_Item" : "av_config_all",
        "Param" : value
    };
    var cmd = JSON.stringify(settingStr);
    //发送接口
    $.get(c_iniUrl + GetSetterCmdKV("analog_videoconfig_set", cmd), function(data) {
        alert(data);
    });

};

