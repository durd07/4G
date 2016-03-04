//路段线的接口方法
//1、r：画布
//2、x1,y1:锚点 x2,y2：锚点
//3、设置锚点样式接口 参数要是json格式
function RoadLine(r, cw,ch,x1, y1, x2, y2) {
    var CANVAS_WIDTH = cw;
    var CANVAS_HEIGHT = ch;

    this.dbClickHandler = null;
    //线段双击回调函数
    this.lineNo = 0;
    //当前车道线的顺序，设计上要根据拖动点位判断
    this.lineStyle = {
        "stroke-width" : "6",
        stroke : "white",
        fill : "white",
        "stroke-opacity" : "0.5"
    };
    //绘制线路的样式。
    this.lineSelectedStyle = {
        stroke : "white"
    };
    
    this.getDrawInfo = function(){
        return line.attr();
    };

    this.itemSelect = function() {
        if (circleAncher) {
            circleAncher.show();
        } else {
            var length = line.getTotalLength();
            var fromPoint = line.getPointAtLength(0);
            var toPoint = line.getPointAtLength(length);
            circleAncher = new CircleAncher(r, line, fromPoint.x, fromPoint.y, toPoint.x, toPoint.y);
        }
        line.attr(this.lineSelectedStyle);
    };
    this.itemUnSelect = function() {
        if (circleAncher) {
            circleAncher.hidden();
        }
        line.attr(this.lineStyle);
    };
    var that = this;
    var circleAncher = null;

    var path = ["M", x1.toFixed(3), y1.toFixed(3), "L", x2.toFixed(3), y2.toFixed(3)].join(",");
    var line = r.path(path).attr(this.lineStyle).toBack().dblclick(function() {
        if (that.dbClickHandler) {
            that.dbClickHandler();
        }
        that.itemSelect();
    });

    line.drag(function(dx, dy) {
        var fromPoint = {
            x : this.oFrom.x + dx,
            y : this.oFrom.y + dy
        };
        var toPoint = {
            x : this.oTo.x + dx,
            y : this.oTo.y + dy
        };
        path = ["M", fromPoint.x.toFixed(3), fromPoint.y.toFixed(3), "L", toPoint.x.toFixed(3), toPoint.y.toFixed(3)].join(",");
        line.attr({
            path : path
        });
        var ddx = dx - (this.dx || 0);
        var ddy = dy - (this.dy || 0);
        this.dx = dx;
        this.dy = dy;
        if (circleAncher) {
            circleAncher.updateCordinate(ddx, ddy);
        }

    }, function() {
        var length = this.getTotalLength();
        this.oFrom = this.getPointAtLength(0);
        this.oTo = this.getPointAtLength(length);
        this.attr({
            "cursor" : "move"
        });
        this.dx = 0;
        this.dy = 0;
    }, function() {
        this.attr({
            "cursor" : "default"
        });
    });

    function CircleAncher(r, line, x1, y1, x2, y2) {
        var R = 6;
        this.ancherStyle = {
            fill : "#0F0",
            stroke : "none"
        };
        //锚点默认的样式
        //设置样式方法
        this.setAncherStyle = function(value) {
            this.ancherStyle = value;
            set.attr(value);
        };

        this.hidden = function() {
            for (var i = 0; i < set.length; i++) {
                set[i].hide();
            }
        };
        this.show = function() {
            for (var i = 0; i < set.length; i++) {
                set[i].show();
            }
        };
        this.updateCordinate = function(dx, dy) {
            for (var i = 0; i < set.length; i++) {
                var x = set[i].attr("cx") + dx;
                var y = set[i].attr("cy") + dy;
                set[i].attr({
                    cx : x,
                    cy : y
                });
            }

        };

        var dragger = function() {
            this.ox = this.attr("cx");
            this.oy = this.attr("cy");
            this.attr({
                "cursor" : "move"
            });
        }, move = function(dx, dy) {
            var att = {
                cx : Math.min(Math.max(this.ox + dx, R), CANVAS_WIDTH - R / 2),
                cy : Math.min(Math.max(this.oy + dy, R), CANVAS_HEIGHT - R / 2)
            };
            this.attr(att);
            var path = ["M,", ancher1.attr("cx").toFixed(3), ancher1.attr("cy").toFixed(3), "L,", ancher2.attr("cx").toFixed(3), ancher2.attr("cy").toFixed(3)].join(",");
            line.attr({
                path : path
            });
        }, up = function() {
            this.attr({
                "cursor" : "default"
            });
        };
        var ancher1 = r.circle(x1, y1, R);
        var ancher2 = r.circle(x2, y2, R);
        var set = r.set();
        set.push(ancher1, ancher2);
        set.attr(this.ancherStyle);
        set.drag(move, dragger, up);
    }

}
