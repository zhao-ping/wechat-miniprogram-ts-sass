"use strict";
Component({
    options: {
        addGlobalClass: true,
    },
    properties: {
        lineWidth: {
            type: Number,
            value: 0.08,
        },
        bgColor: {
            type: String,
            value: "#eaeaea",
        },
        color: {
            type: String,
            value: "#999",
        },
        title: {
            type: String,
            value: ""
        },
        percent: {
            type: Number,
            value: 0
        },
    },
    data: {
        percent: null,
        width: 80,
    },
    lifetimes: {
        ready: function () {
            this.init();
        }
    },
    methods: {
        init: function () {
            var _this = this;
            var _a = this.data, lineWidth = _a.lineWidth, bgColor = _a.bgColor, color = _a.color, percent = _a.percent;
            var circlePercentContainer = this.createSelectorQuery();
            circlePercentContainer.select('#circlePercentContainer').boundingClientRect(function (r) {
                var width = r.width;
                _this.setData({ width: width });
                var canvasQuery = _this.createSelectorQuery();
                canvasQuery.select("#canvas").fields({ node: true, size: true })
                    .exec(function (res) {
                    var canvas = res[0].node;
                    var ctx = canvas.getContext('2d');
                    var dpr = wx.getSystemInfoSync().pixelRatio;
                    var isAnd = wx.getSystemInfoSync().system.indexOf("iOS") == -1;
                    dpr = isAnd ? dpr : 1;
                    canvas.width = width * dpr;
                    canvas.height = width * dpr;
                    ctx.scale(dpr, dpr);
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.font = width * 0.12 + "px sans-serif";
                    ctx.fillStyle = "#999";
                    ctx.fillText("录取率", width / 2, width * 0.9);
                    ctx.lineCap = 'round';
                    ctx.lineWidth = width * lineWidth;
                    var fullDeg = Math.PI * 2 * 0.8;
                    var startDeg = 0.5 * Math.PI + (2 * Math.PI - fullDeg) / 2;
                    ctx.strokeStyle = bgColor;
                    ctx.beginPath();
                    ctx.arc(width / 2, width / 2, (width - ctx.lineWidth) / 2, startDeg, startDeg + fullDeg, false);
                    ctx.stroke();
                    ctx.strokeStyle = color;
                    ctx.beginPath();
                    ctx.arc(width / 2, width / 2, width / 2 - ctx.lineWidth / 2, startDeg, startDeg + fullDeg * percent, false);
                    ctx.stroke();
                });
            }).exec();
        }
    }
});
