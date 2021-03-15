"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../../../utilTs/util");
Page({
    data: {
        info: null,
    },
    getInfo: function (school_id) {
        var _this = this;
        util_1.getData("/static_service/v1/allow/school/" + school_id + "/campus_scenery", {
            success: function (r) {
                _this.setData({ info: r.data });
            }
        });
    },
    onLoad: function (options) {
        this.getInfo(options.school_id);
    },
    previewImage: function (e) {
        var dataset = e.currentTarget.dataset;
        var list = this.data.info.attach_list.map(function (item) { return item.v; });
        wx.previewImage({
            current: dataset.url,
            urls: list,
            success: function (result) {
                console.log("success");
            },
            fail: function () {
                console.log("fail");
            },
            complete: function () { }
        });
    }
});
