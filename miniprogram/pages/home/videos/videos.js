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
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../../../utilTs/util");
var _videos = (function (_super) {
    __extends(_videos, _super);
    function _videos() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.data = {
            playingVideoIndex: null,
            types: null,
            tabIndex: 0,
            list: null,
            listPage: {
                page: 0, page_count: 1
            }
        };
        return _this;
    }
    _videos.prototype.videoDetail = function (e) {
        var index = this.getElDataSet(e).index;
        var video = this.data.list[index];
        if (video.is_detail) {
            wx.navigateTo({
                url: "/pages/home/video/video?video_id=" + video.video_id,
            });
        }
        else {
            if (this.data.playingVideoIndex != null) {
                util_1.getData("/static_service/v1/auth/video/play", {
                    data: {
                        pre_video_id: this.data.list[this.data.playingVideoIndex].video_id,
                        video_id: video.video_id,
                    }
                });
            }
            this.set({ playingVideoIndex: index });
        }
    };
    _videos.prototype.changeTab = function (data) {
        this.set({ tabIndex: data.detail });
        this.set({ list: null });
        this.set({ listPage: { page: 0, page_count: 1 } });
        this.getList();
    };
    _videos.prototype.getTypes = function () {
        var _this = this;
        util_1.getData("/static_service/v1/auth/video/title", {
            success: function (r) {
                _this.set({ types: r.data });
                _this.set({ type: r.data[0] });
                _this.getList();
            }
        });
    };
    _videos.prototype.getList = function () {
        var _this = this;
        if (this.data.listPage.page >= this.data.listPage.page_count)
            return;
        util_1.getData("/static_service/v1/auth/video/page", {
            data: {
                limit: 5,
                page: this.data.listPage.page + 1,
                class_id: this.data.types[this.data.tabIndex].class_id,
            },
            success: function (r) {
                if (r.pager.page == 1) {
                    _this.data.list = r.data;
                }
                else {
                    _this.data.list = __spread(_this.data.list, r.data);
                }
                _this.set({ list: _this.data.list });
                _this.set({ listPage: r.pager });
            }
        });
    };
    _videos.prototype.onInit = function () {
        this.getTypes();
    };
    return _videos;
}(util_1.BasePage));
Page(new _videos());
