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
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../../../utilTs/util");
var messageInterval;
var _home = (function (_super) {
    __extends(_home, _super);
    function _home() {
        var _this = _super.call(this) || this;
        _this.data = __assign(__assign({}, _this.data), {
            info: null,
            messageIndex: 0,
            suxueRecommend: null,
            playingVideoIndex: null,
        });
        return _this;
    }
    _home.prototype.changeVideo = function (e) {
        var index = this.getElDataSet(e).index;
        var video = this.data.info.menu_video[index];
        if (video.is_detail) {
            wx.navigateTo({
                url: "/pages/home/video/video?video_id=" + video.video_id,
            });
        }
        else {
            if (this.data.playingVideoIndex != null) {
                util_1.getData("/static_service/v1/auth/video/play", {
                    data: {
                        pre_video_id: this.data.info.menu_video[this.data.playingVideoIndex].video_id,
                        video_id: video.video_id,
                    }
                });
            }
            this.set({ playingVideoIndex: index });
        }
    };
    _home.prototype.getInfo = function () {
        var _this = this;
        util_1.getData("/static_service/v1/allow/index/info", {
            success: function (r) {
                _this.set({ info: r.data });
                var messageIndex = 0;
                var messageLength = _this.data.info.index_message_list.length;
                messageInterval = setInterval(function () {
                    if (_this.data.messageIndex < messageLength - 1) {
                        messageIndex = _this.data.messageIndex + 1;
                    }
                    else {
                        messageIndex = 0;
                    }
                    _this.set({ messageIndex: messageIndex });
                }, 5000);
            }
        });
    };
    _home.prototype.goSuxuePage = function () {
        wx.navigateTo({ url: "/pages/article/suxueTypes/suxueTypes" });
    };
    _home.prototype.onHide = function () {
        clearInterval(messageInterval);
    };
    _home.prototype.onShow = function () {
        this.getSuxueRecommend();
    };
    _home.prototype.getSuxueRecommend = function () {
        var _this = this;
        util_1.getData("/static_service/v1/auth/quality_article/recommend", {
            success: function (r) {
                _this.set({ suxueRecommend: null });
                _this.set({ suxueRecommend: r.data });
            }
        });
    };
    _home.prototype.onInit = function () {
        var _this = this;
        this.getInfo();
        util_1.event.on(this, "updateUserInfo", function () {
            _this.getInfo();
            _this.getSuxueRecommend();
        });
    };
    return _home;
}(util_1.GlobalUserInfoPage));
Page(new _home());
