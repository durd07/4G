//添加命名空间，在这个对象上，开发出入口
var Entrance = {};

//这里是存放图形绘制的元素
Entrance.graphicBox = {
    Rects : [],
    Lines : [],
    Polygons : []
};

//这是测试json数据
Entrance.module = {
    version : 1.1,
    method : "set",
    devicetype : 5,
    content : {
        graphics : {
            dest : ['dsp'],
            param : {
                polygon : {
                    pointCount:4,
                    pointArr:[
                        {
                            x:50*2,
                            y:200*2
                        },
                        {
                            x:600*2,
                            y:200*2
                        },
                        {
                            x:600*2,
                            y:450*2
                        },{
                            x:50*2,
                            y:450*2
                        }
                    ]
                },
                leftLineInfo : {
                    startPoint : {
                        x : 32 * 2,
                        y : 390 * 2
                    },
                    endPoint : {
                        x : 620 * 2,
                        y : 390 * 2
                    }
                }
            }
        },
        basicParam : {
            dest : ['arm', 'dsp'],
            param : {
                pointcode : '900000008020',
                pointname : '门口',
                direction : 10,
                devicecode : '3702020101',
                loglevel : 4 //日志级别需要枚举
            }
        },
        cameraParam : {
            dest : ['dsp'],
            param : {
                picQuality : 70,
                picSizeUpperLimit : 0,
                picResolution : {
                    width : 1280,
                    height : 960
                }
            }
        },
        resumeParam : {
            dest : ['arm'],
            param : {
                isBrokenResume : 1,
                loopCoverThreshold : 7
            }
        },
        vehicleOverlay : {
            dest : ['dsp'],
            param : {
                isOverlay : 0,
                color : {
                    r : 255,
                    g : 0,
                    b : 0
                },
                fontSize : 32,
                isOverlayTime : 0,
                isPointName : 0,
                isDeviceCode : 0,
                isDirection : 0,
                isCarno : 0,
                isPlatecolor : 0,
                isLicenseType : 0,
                isVehicleModel : 0,
                isCarcolor : 0,
                isCarlogo : 0,
                isSecurityCode : 0
            }
        }
    }
};

/**
 * 绑定事件用的方法，简单的处理可在这里面完成，
 * 对于复杂点的，需要单独抽取出方法
 */
Entrance.bindEvent = function() {
    //保存按钮点击事件监听
    $("#entrance_saveBtn").click(function() {
        //因为这个方法比较复杂，抽取出来
        Entrance.save();
    });
};

/**
 * 加载初始化方法放到这里，包括Ajax请求，赋值
 */
Entrance.init = function() {
    //初始化tab页调用方法
    Entrance.tabs.call($("#entrance_tabs"), "entrance_tab_content");
    //初始化字体颜色选择器
    Entrance.loadColorPicker();
    //AJAX请求JSON对象，请求后对每个Tab页赋值
    var call = {
        version : 1.1,
        method : "get",
        devicetype : 5
    };
    var cmd = JSON.stringify(call);
    $.get(c_iniUrl + GetSetterCmdKV("IntelligentInfo", cmd), function(data) {
        var reg = /intelligentinfo(.+)/i;
        // var back = data.substring(34).rtrim();
        var arr = reg.exec(data);
        var back = decodeURIComponent(arr[1]);
        var result = eval('(' + back + ')');
        Entrance.loadData(result);
    });
    //视频播放
    VideoActiveXControl.videoPlay(1, 0, 300);
    //添加定时器，截图用
    setTimeout(function() {
        Entrance.setBackgroundFilter();
    }, 2000);
};

/**
 * 设置配置背景图片
 */
Entrance.setBackgroundFilter = function() {
    var localFile = LocalConfigCtrl.readConfigFromLocalFile();
    var path = localFile.snapPicRoot + localFile.entranceBackgroundImage;
    VideoActiveXControl.snapShot(path);
    document.getElementById("entrance_backgroundImage").style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + path + "',sizingMethod='scale')";
    VideoActiveXControl.videoStop();
};
/**
 * 初始化颜色选择器，初始化颜色红色
 */
Entrance.loadColorPicker = function() {
    $.fn.jPicker.defaults.images.clientPath = '../images/';

    $('#Entrance_fontColor').jPicker({
        window : {
            position : {
                x : 'screenCenter',
                y : 125
            }
        }
    }, function(color, context) {
        var all = color.val('all');
        var rgb = 'RGB( ' + all.r + "," + all.g + "," + all.b + ")";
        $("#Entrance_fontColor").attr("r", all.r);
        $("#Entrance_fontColor").attr("g", all.g);
        $("#Entrance_fontColor").attr("b", all.b);
        $("#Entrance_fontColor").val(rgb);
    });
};

/**
 * 加载参数到每个tab页，包括如下：
 * 1、基本参数。
 * 2、图形参数。
 * 3、叠加信息。
 * 4、图片质量。
 */
Entrance.loadData = function(data) {
    //data = Entrance.module;
    //加载图形配置
    var width = data.content.cameraParam.param.picResolution.width / 2;
    var height = data.content.cameraParam.param.picResolution.height / 2;
    $("#entrance_backgroundImage").css({
        width : width,
        height : height,
        background : "black"
    });
    //这里是最重要的图形叠加
    var r = new Raphael("entrance_backgroundImage", width, height);
    Entrance.drawGraphic(r, width, height, data.content.graphics.param);

    //加载基本参数
    $("#Entrance_pointname").val(data.content.basicParam.param.pointname);
    $("#Entrance_pointcode").val(data.content.basicParam.param.pointcode);
    $("#Entrance_direction").val(data.content.basicParam.param.direction);
    $("#Entrance_devicecode").val(data.content.basicParam.param.devicecode);
    $("#Entrance_logLevel").val(data.content.basicParam.param.loglevel);
    $("input:radio[name='group_brokeResume']").eq(!(+data.content.resumeParam.param.isBrokenResume)).attr("checked", true);
    $("#Entrance_loopCoverThreshold").val(data.content.resumeParam.param.loopCoverThreshold);

    //图片质量
    $("#Entrance_picQuality").val(data.content.cameraParam.param.picQuality);
    $("#Entrance_picUpperLimit").val(data.content.cameraParam.param.picSizeUpperLimit);
    $("#Entrance_imageResolution").val(+(data.content.cameraParam.param.picResolution.height == 1080));

    //加载叠加信息tab页内容
    $("input:radio[name='group_overlayEnable']").eq(!(+data.content.vehicleOverlay.param.isOverlay)).attr("checked", true);
    $("#Entrance_fontSize").val(data.content.vehicleOverlay.param.fontSize);
    //字体颜色，这里特殊对待
    $.jPicker.List[0].color.active.val('rgb', {
        r : data.content.vehicleOverlay.param.color.r,
        g : data.content.vehicleOverlay.param.color.g,
        b : data.content.vehicleOverlay.param.color.b
    });
    $("input:radio[name='group_isTime']").eq(!(+data.content.vehicleOverlay.param.isOverlayTime)).attr("checked", true);
    $("input:radio[name='group_isPointname']").eq(!(+data.content.vehicleOverlay.param.isPointName)).attr("checked", true);
    $("input:radio[name='group_isDevicecode']").eq(!(+data.content.vehicleOverlay.param.isDeviceCode)).attr("checked", true);
    $("input:radio[name='group_isDirection']").eq(!(+data.content.vehicleOverlay.param.isDirection)).attr("checked", true);
    $("input:radio[name='group_isCarno']").eq(!(+data.content.vehicleOverlay.param.isCarno)).attr("checked", true);
    $("input:radio[name='group_isPlatecolor']").eq(!(+data.content.vehicleOverlay.param.isPlatecolor)).attr("checked", true);
    $("input:radio[name='group_isLicense']").eq(!(+data.content.vehicleOverlay.param.isLicenseType)).attr("checked", true);
    $("input:radio[name='group_isVehicleModel']").eq(!(+data.content.vehicleOverlay.param.isVehicleModel)).attr("checked", true);
    $("input:radio[name='group_isCarcolor']").eq(!(+data.content.vehicleOverlay.param.isCarcolor)).attr("checked", true);
    $("input:radio[name='group_isCarlogo']").eq(!(+data.content.vehicleOverlay.param.isCarlogo)).attr("checked", true);
    $("input:radio[name='group_isSecurityCode']").eq(!(+data.content.vehicleOverlay.param.isSecurityCode)).attr("checked", true);
};

/**
 * 绘制图形元素
 */
Entrance.drawGraphic = function(r, w, h, graphics) {
    var polygonPoints = graphics.polygon.pointArr;
    var lindInfo = graphics.leftLineInfo;

    //绘制多边形
    var rectEle = r.rect(0,0,w,h);
    var polygon = new Polygon(r,rectEle);
    for(var i = 0; i<polygonPoints.length; i++)
    {
        var point = polygonPoints[i];
        polygon.addAncherPoint([point.x/2,point.y/2]);
    }
    
    polygon.getDrawInfo();
    var line = new RoadLine(r, w, h, lindInfo.startPoint.x / 2, lindInfo.startPoint.y / 2, lindInfo.endPoint.x / 2, lindInfo.endPoint.y / 2);
    polygon.dbClickHandler = function() {
        Entrance.graphicBoxDbClickHandler();
    };
    line.dbClickHandler = function() {
        Entrance.graphicBoxDbClickHandler();
    };
    Entrance.graphicBox.Polygons.push(polygon);
    Entrance.graphicBox.Lines.push(line);
};
/**
 * 图像双击自定义事件
 */
Entrance.graphicBoxDbClickHandler = function() {
    Entrance.graphicBox.Lines[0].itemUnSelect();
    Entrance.graphicBox.Polygons[0].itemUnSelect();
};

/**
 * 点击保存后，上传参数
 */
Entrance.save = function() {
    var dto = Entrance.module.content;
    //维持着json结构，重新赋值即可。不需要改变结构
    //绘图参数封装
    var polygonArr = Entrance.graphicBox.Polygons[0].getDrawInfo();
    var line = Entrance.graphicBox.Lines[0].getDrawInfo();
    var linePath = line.path + "";
    linePath = linePath.replace(/,,/g, ",");
    var tempArr = linePath.split(",");
    dto.graphics.param.leftLineInfo.startPoint.x = +(tempArr[1] * 2);
    dto.graphics.param.leftLineInfo.startPoint.y = +(tempArr[2] * 2);
    dto.graphics.param.leftLineInfo.endPoint.x = +(tempArr[4] * 2);
    dto.graphics.param.leftLineInfo.endPoint.y = +(tempArr[5] * 2);
    dto.graphics.param.polygon.pointCount = polygonArr.length;
    dto.graphics.param.polygon.pointArr = [];
    for(var i = 0 ; i<polygonArr.length; i++)
    {
        var x = +(polygonArr[i][0] * 2);
        var y = +(polygonArr[i][1] * 2);
        dto.graphics.param.polygon.pointArr.push({x:x,y:y});
    }

    //下面是基本参数的封装
    dto.basicParam.param.pointname = $("#Entrance_pointname").val().trim();
    dto.basicParam.param.pointcode = $("#Entrance_pointcode").val();
    dto.basicParam.param.direction = +$("#Entrance_direction").val();
    dto.basicParam.param.devicecode = $("#Entrance_devicecode").val();
    dto.basicParam.param.loglevel = +$("#Entrance_logLevel").val();
    dto.resumeParam.param.isBrokenResume = +$('input:radio[name="group_brokeResume"]:checked').val();
    dto.resumeParam.param.loopCoverThreshold = +$("#Entrance_loopCoverThreshold").val();

    //叠加信息参数封装
    dto.vehicleOverlay.param.isOverlay = +$('input:radio[name="group_overlayEnable"]:checked').val();
    var fontColor = $.jPicker.List[0].color.active.val('rgb');
    dto.vehicleOverlay.param.color.r = +fontColor.r;
    dto.vehicleOverlay.param.color.g = +fontColor.g;
    dto.vehicleOverlay.param.color.b = +fontColor.b;
    dto.vehicleOverlay.param.fontSize = +$("#Entrance_fontSize").val();
    dto.vehicleOverlay.param.isOverlayTime = +$('input:radio[name="group_isTime"]:checked').val();
    dto.vehicleOverlay.param.isPointName = +$('input:radio[name="group_isPointname"]:checked').val();
    dto.vehicleOverlay.param.isDeviceCode = +$('input:radio[name="group_isDevicecode"]:checked').val();
    dto.vehicleOverlay.param.isDirection = +$('input:radio[name="group_isDirection"]:checked').val();
    dto.vehicleOverlay.param.isCarno = +$('input:radio[name="group_isCarno"]:checked').val();
    dto.vehicleOverlay.param.isPlatecolor = +$('input:radio[name="group_isPlatecolor"]:checked').val();
    dto.vehicleOverlay.param.isLicenseType = +$('input:radio[name="group_isLicense"]:checked').val();
    dto.vehicleOverlay.param.isVehicleModel = +$('input:radio[name="group_isVehicleModel"]:checked').val();
    dto.vehicleOverlay.param.isCarcolor = +$('input:radio[name="group_isCarcolor"]:checked').val();
    dto.vehicleOverlay.param.isCarlogo = +$('input:radio[name="group_isCarlogo"]:checked').val();
    dto.vehicleOverlay.param.isSecurityCode = +$('input:radio[name="group_isSecurityCode"]:checked').val();

    //图片质量
    dto.cameraParam.param.picQuality = +$("#Entrance_picQuality").val();
    dto.cameraParam.param.picSizeUpperLimit = +$("#Entrance_picUpperLimit").val();
    dto.cameraParam.param.picResolution.width = +$("#Entrance_imageResolution").find("option:selected").attr("w");
    dto.cameraParam.param.picResolution.height = +$("#Entrance_imageResolution").find("option:selected").attr("h");

    Entrance.module.method = "set";
    //调用保存的方法
    var cmd = JSON.stringify(Entrance.module);
    cmd  = encodeURIComponent(cmd);
    $.get(c_iniUrl + GetSetterCmdKV("IntelligentInfo", cmd), function(data) {
        alert("保存成功！");
    });

};

/**
 * tab页方法,这个方法可以通用，暂时不抽取
 */
Entrance.tabs = function(content) {
    var content = $("#" + content);
    var tab = this;
    var firstTab = $(tab).find("ul li a:first").attr("data");

    //为a标签添加事件代理
    $(tab).delegate("ul li a", "click", function() {
        var data = $(this).attr("data");
        //拿到点击的data后，触发响应的事件
        $(tab).trigger('tab_click', data);
        content.trigger("tab_click", data);
    });

    //为tab标签添加监听事件，用于样式控制
    $(tab).bind("tab_click", function(e, data) {
        $(tab).find("a").each(function(index) {
            $(this).removeClass('active');
            if ($(this).attr("data") == data) {
                $(this).addClass('active');
            };
        });
    });

    //为conetent添加自定义事件，同样用于样式控制
    content.bind("tab_click", function(e, data) {
        $(content).children().each(function(index) {
            $(this).css("display", "none");
            if ($(this).attr("data") == data) {
                $(this).css("display", "");
            }
        });
    });

    //初始化加载第一个标签
    $(tab).trigger('tab_click', firstTab);
    content.trigger("tab_click", firstTab);
};

$(document).ready(function() {

    Entrance.init();
    Entrance.bindEvent();
});
