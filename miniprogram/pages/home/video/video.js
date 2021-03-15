"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../../../utilTs/util");
var _video = (function (_super) {
    __extends(_video, _super);
    function _video() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.data = {
            video_id: null,
            info: null,
            list: null,
            index: 0,
            activeId: null,
            scrollViewHeight: null,
        };
        return _this;
    }
    _video.prototype.change = function (e) {
        var video = this.getElDataSet(e).video;
        util_1.getData("/static_service/v1/auth/video/play", {
            data: {
                pre_video_id: this.data.video_id,
                video_id: video.video_id,
            }
        });
        wx.redirectTo({
            url: "/pages/home/video/video?video_id=" + video.video_id
        });
    };
    _video.prototype.getInfo = function (video_id) {
        var _this = this;
        util_1.getData("/static_service/v1/auth/video/detail", {
            data: { video_id: video_id },
            success: function (r) {
                var id = r.data.current_video.video_id;
                var index = r.data.topic_list.list.findIndex(function (item) { return item.video_id == id; });
                _this.set({ activeId: r.data.current_video.video_id });
                var list = [];
                r.data.topic_list.list.map(function (item) {
                    list.push({ id: item.video_id, url: item.url, objectFit: "contain" });
                });
                _this.set({ list: list });
                _this.set({ info: r.data });
                _this.set({ index: index });
                _this.setHeight();
            }
        });
    };
    _video.prototype.onInit = function (e) {
        this.set({ video_id: e.video_id });
        this.getInfo(e.video_id);
    };
    _video.prototype.setHeight = function () {
        var _this = this;
        setTimeout(function () {
            var app = getApp();
            var query = wx.createSelectorQuery();
            query.select("#video").boundingClientRect(function (r) {
                var h = app.systemInfo.windowHeight - r.height;
                _this.set({ scrollViewHeight: h });
            }).exec();
        }, 10);
    };
    _video.prototype.onShow = function () {
    };
    return _video;
}(util_1.BasePage));
Page(new _video());
