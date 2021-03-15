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
function colorRgb(color) {
    color = color.toLowerCase();
    var pattern = /^#([0-9|a-f]{3}|[0-9|a-f]{6})$/;
    if (color && pattern.test(color)) {
        if (color.length == 4) {
            color = '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
        }
        var colorNew = [];
        for (var i = 1; i < 7; i += 2) {
            colorNew.push(parseInt("0x" + color.slice(i, i + 2)));
        }
        return "RGB(" + colorNew.join(",") + ")";
    }
    return color;
}
;
Component({
    properties: {
        datas: null,
    },
    data: {
        width: 80,
        height: 80,
    },
    lifetimes: {
        ready: function () {
            this.init();
        }
    },
    methods: {
        init: function () {
            var _this = this;
            var chartContainer = this.createSelectorQuery();
            chartContainer.select('#chartContainer').boundingClientRect(function (r) {
                var width = r.width, height = width * 0.5;
                _this.setData({ width: width });
                _this.setData({ height: height });
                var canvasQuery = _this.createSelectorQuery();
                canvasQuery.select("#lineCanvas").fields({ node: true, size: true })
                    .exec(function (res) {
                    var canvas = res[0].node;
                    var ctx = canvas.getContext('2d');
                    var dpr = wx.getSystemInfoSync().pixelRatio;
                    var fontSizeRate = (width < 320 ? 0.78 : (width > 414 ? 1 : width / 414)), left = fontSizeRate * 20, right = width - left, dataLeft = left * 2, dataRight = width - dataLeft, dataTop = fontSizeRate * 50, bottom = height - fontSizeRate * 30, dataBottom = bottom - fontSizeRate * 20;
                    var isAnd = wx.getSystemInfoSync().system.indexOf("iOS") == -1;
                    dpr = isAnd ? dpr : 1;
                    canvas.width = width * dpr;
                    canvas.height = width * 0.5 * dpr;
                    ctx.scale(dpr, dpr);
                    var d = __assign({ lineAreaPercent: 0.3, xtag: '', xaxis: [], dataTag: '', datas: [], subDataTag: '', subDatas: [], color: "#3F9FF8", subDataColor: "#999", reverse: false }, _this.data.datas);
                    var reverse = d.reverse, xaxis = d.xaxis, xtag = d.xtag, datas = d.datas, dataTag = d.dataTag, subDatas = d.subDatas, subDataTag = d.subDataTag, color = d.color, dataColor = d.dataColor, subDataColor = d.subDataColor, lineAreaPercent = d.lineAreaPercent;
                    var dataValue = datas;
                    dataColor = color;
                    ctx.clearRect(0, 0, width, height);
                    ctx.strokeStyle = "#eaeaea";
                    ctx.lineWidth = height * 0.003;
                    ctx.beginPath();
                    ctx.moveTo(left, bottom);
                    ctx.lineTo(right, bottom);
                    ctx.stroke();
                    var xPoints = [];
                    ctx.fillStyle = "#999";
                    ctx.textAlign = "center";
                    ctx.textBaseline = "top";
                    ctx.font = fontSizeRate * 14 + "px  Helvetica";
                    var dataLength = xaxis.length;
                    var everyX = (dataRight - dataLeft) / 2;
                    if (dataLength > 1) {
                        everyX = (dataRight - dataLeft) / (dataLength - 1);
                        for (var i = 0; i < xaxis.length; i++) {
                            var x = dataLeft + i * everyX;
                            xPoints.push(x);
                            ctx.beginPath();
                            ctx.fillText(xaxis[i] + xtag, x, bottom + fontSizeRate * 8);
                            ctx.fill();
                        }
                    }
                    else {
                        var x = dataLeft + everyX;
                        xPoints = [dataLeft + (dataRight - dataLeft) * 0.5];
                        ctx.beginPath();
                        ctx.fillText(xaxis[0] + xtag, x, bottom + fontSizeRate * 8);
                        ctx.fill();
                    }
                    var max = Math.max.apply(Math, __spread(datas));
                    var min = Math.min.apply(Math, __spread(datas));
                    var randYPercent = 0.2;
                    var everyH = 0;
                    if (max != min) {
                        if (lineAreaPercent) {
                            randYPercent = lineAreaPercent;
                        }
                        else {
                            randYPercent = (max - min) / max;
                        }
                        everyH = randYPercent * (dataBottom - dataTop) / (max - min);
                    }
                    var movedH = (dataBottom - dataTop) * (1 - randYPercent) / 2;
                    dataBottom = dataBottom - movedH;
                    dataTop = dataTop + movedH;
                    var yPoints = [];
                    ctx.beginPath();
                    var grd = ctx.createLinearGradient(0, dataTop, 0, bottom);
                    var rgbaColor = colorRgb(color).replace("RGB", "RGBA");
                    grd.addColorStop(0, rgbaColor.replace(')', ',0.14)'));
                    grd.addColorStop(1, rgbaColor.replace(')', ',0)'));
                    ctx.fillStyle = grd;
                    ctx.moveTo(dataRight, bottom);
                    ctx.lineTo(dataLeft, bottom);
                    if (dataLength > 1) {
                        datas.map(function (item, i) {
                            var y;
                            if (reverse) {
                                y = dataTop + (item - min) * everyH;
                            }
                            else {
                                y = dataBottom - (item - min) * everyH;
                            }
                            yPoints.push(y);
                            ctx.lineTo(xPoints[i], y);
                        });
                    }
                    else {
                        var y = void 0;
                        if (reverse) {
                            y = dataTop;
                        }
                        else {
                            y = dataBottom;
                        }
                        yPoints.push(y);
                        ctx.lineTo(dataLeft, y);
                        ctx.lineTo(dataRight, y);
                    }
                    ctx.closePath();
                    ctx.fill();
                    ctx.beginPath();
                    ctx.strokeStyle = color;
                    ctx.lineWidth = fontSizeRate * 2;
                    if (dataLength > 1) {
                        datas.map(function (item, i) {
                            if (i == 0) {
                                ctx.moveTo(xPoints[i], yPoints[i]);
                            }
                            else {
                                ctx.lineTo(xPoints[i], yPoints[i]);
                            }
                        });
                    }
                    else {
                        var y = dataBottom;
                        ctx.moveTo(dataLeft, y);
                        ctx.lineTo(dataRight, y);
                    }
                    ctx.stroke();
                    ctx.textAlign = "center";
                    ctx.textBaseline = "bottom";
                    ctx.font = fontSizeRate * 16 + "px  Helvetica";
                    dataValue.map(function (item, i) {
                        ctx.beginPath();
                        ctx.fillStyle = "#fff";
                        ctx.arc(xPoints[i], yPoints[i], fontSizeRate * 4.5, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.stroke();
                        ctx.fillStyle = dataColor;
                        if (subDataTag != '') {
                            ctx.font = fontSizeRate * 18 + "px  Helvetica";
                            ctx.fillText(item + dataTag, xPoints[i], yPoints[i] - fontSizeRate * 30);
                            ctx.font = fontSizeRate * 14 + "px  Helvetica";
                            ctx.fillStyle = subDataColor;
                            ctx.fillText("(" + subDatas[i] + subDataTag + ")", xPoints[i], yPoints[i] - fontSizeRate * 10);
                        }
                        else {
                            ctx.fillText(item + dataTag, xPoints[i], yPoints[i] - fontSizeRate * 10);
                        }
                    });
                });
            }).exec();
        }
    }
});
