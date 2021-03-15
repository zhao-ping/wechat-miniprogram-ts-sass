"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var ctx;
var datas = [];
Component({
    options: {
        addGlobalClass: true,
    },
    properties: {
        lineWidth: {
            type: Number,
            value: 0.2,
        },
        items: {
            type: Array,
            value: []
        },
        index: {
            type: Number,
            value: 0,
        }
    },
    data: {
        startAngle: -0.5 * Math.PI,
        offset: 0.25,
        index: 0,
        width: 0,
        canvasWidth: 0,
        datas: datas,
    },
    lifetimes: {
        ready: function () {
            this.init();
        }
    },
    methods: {
        calculate: function () {
            var datas = [];
            var startAngle = this.data.startAngle;
            this.data.items.map(function (item, i) {
                var newItem = __assign(__assign({ startAngle: startAngle, endAngle: startAngle + Math.PI * 2 * (item.v / 100) }, item), { percent: item.v % 100 });
                datas.push(newItem);
                startAngle = newItem.endAngle;
            });
            this.setData({ datas: datas });
        },
        draw: function () {
            var _this = this;
            ctx.clearRect(0, 0, this.data.width, this.data.width);
            var width = this.data.width, lineWidth = width * this.data.lineWidth, offset = lineWidth * this.data.offset, r = (width - lineWidth) / 2 - offset, center = [width / 2, width / 2];
            ctx.lineWidth = lineWidth;
            this.data.datas.map(function (item, i) {
                ctx.beginPath();
                ctx.strokeStyle = item.color;
                var itemCenter = [];
                if (i == _this.data.index) {
                    var offsetAngle = item.startAngle + (item.endAngle - item.startAngle) / 2;
                    var degree = offsetAngle - _this.data.startAngle;
                    if (-0.5 * Math.PI <= offsetAngle && offsetAngle < 0) {
                        itemCenter = [
                            center[0] + offset * Math.sin(degree),
                            center[0] - offset * Math.cos(degree),
                        ];
                    }
                    else if (0 <= offsetAngle && offsetAngle < 0.5 * Math.PI) {
                        itemCenter = [
                            center[0] + offset * Math.sin(Math.PI - degree),
                            center[0] + offset * Math.cos(Math.PI - degree),
                        ];
                    }
                    else if (0.5 * Math.PI <= offsetAngle && offsetAngle < Math.PI) {
                        itemCenter = [
                            center[0] - offset * Math.sin(degree - Math.PI),
                            center[0] + offset * Math.cos(degree - Math.PI),
                        ];
                    }
                    else if (Math.PI <= offsetAngle && offsetAngle < 1.5 * Math.PI) {
                        itemCenter = [
                            center[0] - offset * Math.sin(-degree),
                            center[0] - offset * Math.cos(-degree),
                        ];
                    }
                }
                var c = (i == _this.data.index ? itemCenter : center);
                ctx.arc.apply(ctx, __spread(c, [r, item.startAngle, item.endAngle, false]));
                ctx.stroke();
            });
        },
        init: function () {
            var _this = this;
            var canvasContainer = this.createSelectorQuery();
            canvasContainer.select("#canvasContainer").boundingClientRect(function (r) {
                var width = r.width;
                _this.setData({ width: width });
                var canvasQuery = _this.createSelectorQuery();
                _this.setData({ width: r.width });
                canvasQuery.select("#canvas").fields({ node: true, size: true })
                    .exec(function (res) {
                    var canvas = res[0].node;
                    ctx = canvas.getContext('2d');
                    var dpr = wx.getSystemInfoSync().pixelRatio;
                    var isAnd = wx.getSystemInfoSync().system.indexOf("iOS") == -1;
                    dpr = isAnd ? dpr : 1;
                    canvas.width = width * dpr;
                    canvas.height = width * dpr;
                    _this.setData({ canvasWidth: canvas.width });
                    ctx.scale(dpr, dpr);
                    ctx.fillRect(0, 0, width, width);
                    _this.calculate();
                    _this.draw();
                });
            }).exec();
        },
        changeByTab: function (e) {
            var _a = __read([e.currentTarget.offsetLeft + this.data.width / 2, e.currentTarget.offsetTop + this.data.width / 2], 2), x0 = _a[0], y0 = _a[1];
            var _b = __read([e.detail.x, e.detail.y], 2), x1 = _b[0], y1 = _b[1];
            var angle = Math.atan((y1 - y0) / (x1 - x0));
            if (x1 < x0) {
                angle = Math.PI + angle;
            }
            for (var i = 0; i < this.data.datas.length; i++) {
                var item = this.data.datas[i];
                if (item.startAngle < angle && item.endAngle >= angle) {
                    this.changeByIndex(i);
                    break;
                }
            }
        },
        changeByIndex: function (i) {
            this.setData({ index: i });
            this.draw();
        }
    }
});
