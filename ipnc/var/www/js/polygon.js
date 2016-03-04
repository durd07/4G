//多边形需要一个rect舞台canvas，因为svg这里没有添加click监听，在rect上添加监听。
//对外接口样式、双击回调。
//开发中需要添加数组获得。
function Polygon(r, canvas) {
    //未选中的多边形样式
    this.unselect_style = {
        fill : "none",
        stroke : "#3b7842",
        opacity : "1",
        "stroke-width" : "5"
    };
    this.select_style = {
        fill : "none",
        stroke : "#5baa64",
        opacity : "1",
        "stroke-width" : "5"
    };
    //忘记设计了，额。不搞 了
    this.dragStyle = {
        opacity : "0.3"
    };
    this.selected = false;
    this.remove = function() {
        polygon.remove();
        for (var i = 0; i < ancherArray.length; i++) {
            ancherArray[i].remove();
        }
        canvas.remove();
    };
    this.dbClickHandler = null;

    var ancherPointArray = [];
    var ancherMaxLength = 10;
    //锚点最大个数
    var ancherArray = [];
    //锚点集合
    var that = this;
    var polygon = null;
    var mouseCircle = null;

    //为多边形提供一个舞台。（svg没有click监听）
    canvas.attr({
        stroke : "none",
        fill : "none",
        opacity : "0"
    }).toBack();
    canvas.click(function(ev){alert("?");});
    //启动绘制
    this.startDraw = function() {
        canvas.click(function(ev) {
            if (ancherPointArray.length < ancherMaxLength) {
                that.addAncherPoint([ev.offsetX, ev.offsetY]);
                if (ancherPointArray.length == ancherMaxLength) {
                    that.endDraw();
                }
            }
        }).mousemove(function(ev) {
            //绘制鼠标跟随小圆圈
            if (mouseCircle) {
                mouseCircle.attr({
                    cx : ev.offsetX,
                    cy : ev.offsetY
                });
                mouseCircle.attr({
                    fill : "white",
                    "fill-opacity" : "0.3",
                    stroke : "#6cc",
                    "stroke-width" : "2"
                });
            } else {
                mouseCircle = r.circle(ev.offsetX, ev.offsetY, 4).toBack();
            }
        });
    };
    //结束绘制
    this.endDraw = function() {
        canvas.unclick();
        canvas.unmousemove();
        if(mouseCircle)
        {
            mouseCircle.remove();
        }
        this.itemSelect();
    };

    /**
     *添加描点，重点API
     */
    this.addAncherPoint = function(value) {
        ancherPointArray.push(value);
        this.updatePolygon(ancherPointArray);
    };

    this.updatePolygon = function(array) {
        
        var tmpArr = ["M"];
        for (var i = 0; i < array.length; i++) {
            if (i == 1) {
                tmpArr.push("L");
                tmpArr.push(array[1]);
            } else {
                tmpArr.push(array[i]);
            }
        }
        tmpArr.push("Z");
        if (polygon) {
            polygon.attr({
                path : tmpArr
            });
        } else {
            polygon = r.path(tmpArr).attr(this.unselect_style).dblclick(function() {
                that.endDraw();
                if (that.dbClickHandler) {
                    that.dbClickHandler();
                }
                that.itemUnSelect();
                that.itemSelect();
            });
            polygon.drag(move, start, up);
        }
    };

    var move = function(dx, dy) {
        var ddx = dx - (this.dx || 0);
        var ddy = dy - (this.dy || 0);
        this.dx = dx;
        this.dy = dy;
        updateAncherPointArray(ddx, ddy);
    }, start = function() {
        this.dx = 0;
        this.dy = 0;
        this.attr({
            "cursor" : "move"
        });
    }, up = function() {
        this.attr({
            "cursor" : "default"
        });
    };
    this.itemSelect = function() {
        //显示锚点
        if (ancherArray.length != 0) {
            for (var i = 0; i < ancherArray.length; i++)
                ancherArray[i].show();
        } else {
            for (var i = 0; i < ancherPointArray.length; i++) {
                var ancher = new PolygonAncher(r, ancherPointArray[i][0], ancherPointArray[i][1]);
                ancher.no = i;
                ancher.moveHandler = moveHandler;
                ancherArray.push(ancher);
            }
        }
        polygon.attr(this.select_style);
        this.selected = true;
    };
    this.itemUnSelect = function() {
        if (ancherArray != 0) {
            for (var i = 0; i < ancherArray.length; i++) {
                ancherArray[i].hidden();
            }
        }
        polygon.attr(this.unselect_style);
        this.selected = false;
    };

    this.setDrawState = function(value) {
        this.drawState = value;
    };

    var updateAncherPointArray = function(dx, dy) {
        for (var i = 0; i < ancherPointArray.length; i++) {
            ancherPointArray[i][0] = ancherPointArray[i][0] + dx;
            ancherPointArray[i][1] = ancherPointArray[i][1] + dy;
        }
        that.updatePolygon(ancherPointArray);

        for (var j = 0; j < ancherArray.length; j++) {
            var ancher = ancherArray[j];
            ancher.ancher.attr({
                cx : ancherPointArray[j][0],
                cy : ancherPointArray[j][1]
            });
        }
    };

    var moveHandler = function(no, x, y) {
        ancherPointArray[no][0] = x;
        ancherPointArray[no][1] = y;
        that.updatePolygon(ancherPointArray);
    };

    /**
     *获取多边形点位信息，取y最小为优先 
     */
    this.getDrawInfo = function(){
        var length = ancherPointArray.length;
        var index = 0;
        var minYObj = ancherPointArray[0];
        for(var i = 1; i< length; i++)
        {
            var a = ancherPointArray[i];
            if(a[1] < minYObj[1])
            {
                index = i;
                minYObj = a;
            }
            else if(a[1]==minYObj[1])
            {
                if(a[0] < minYObj[0])
                {
                    index = i;
                    minYObj = a;
                }
            }
        }
        
        var arr = [];
        for(var i=0; i<length; i++)
        {
            if((index+i) < length )
            {
                arr[i] = ancherPointArray[index+i];
            }
            else
            {
                arr[i] = ancherPointArray[i-(length-index)];
            }
        }
        return arr;        
    };
}

function PolygonAncher(r, x, y) {
    var R = 5;
    //锚点半径
    var that = this;
    this.ancher_style = {
        fill : "#0F0",
        stroke : "none"
    };
    this.moveHandler = null;
    //拖动回调函数。
    this.remove = function() {
        this.ancher.remove();
    };

    this.no = 0;
    // 多边形的第几个锚点。
    this.ancher = r.circle(x, y, R).attr(this.ancher_style).drag(function(dx, dy) {
        var cx = this.ox + dx;
        var cy = this.oy + dy;
        this.attr({
            cx : cx,
            cy : cy
        });
        that.moveHandler(that.no, cx, cy);
    }, function(x, y) {
        this.ox = this.attr("cx");
        this.oy = this.attr("cy");

    }, function() {
    });

    this.hidden = function() {
        this.ancher.hide();
    };
    this.show = function() {
        this.ancher.show();
    };

};