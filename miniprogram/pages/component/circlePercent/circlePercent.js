"use strict";
Component({
    properties: {
        lineWidth: {
            type: Number,
            value: 0.1,
        },
        bgColor: {
            type: String,
            value: "#eaeaea",
        },
        color: {
            type: String,
            value: "#4d89ff",
        },
        title: {
            type: String,
            value: ""
        },
        percent: {
            type: Number,
            value: 0.5
        },
    },
    data: {
        width: 80,
    },
    lifetimes: {
        ready: function () {
            this.draw();
        }
    },
    methods: {
        draw: function () {
            var _this = this;
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
                    ctx.font = width * 0.2 + "px sans-serif";
                    ctx.fillStyle = "#2f2f2f";
                    ctx.fillText(_this.data.title, width / 2, width / 2);
                    ctx.lineWidth = width * _this.data.lineWidth;
                    var startDeg = -0.5 * Math.PI;
                    ctx.strokeStyle = _this.data.bgColor;
                    ctx.beginPath();
                    ctx.arc(width / 2, width / 2, (width - ctx.lineWidth) / 2, 0, Math.PI * 2, false);
                    ctx.stroke();
                    ctx.strokeStyle = _this.data.color;
                    ctx.beginPath();
                    ctx.arc(width / 2, width / 2, width / 2 - ctx.lineWidth / 2, startDeg, Math.PI * 2 * _this.data.percent + startDeg, false);
                    ctx.stroke();
                });
            }).exec();
        }
    }
});
