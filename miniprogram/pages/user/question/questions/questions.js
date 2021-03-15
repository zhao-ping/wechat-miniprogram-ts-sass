"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../../../../utilTs/util");
Page({
    data: {
        info: null,
        items: null,
        tabIndex: 0,
    },
    changeTabIndex: function (e) {
        this.setData({ tabIndex: e.detail });
    },
    getInfo: function () {
        var _this = this;
        util_1.getData("/static_service/v1/allow/article/question/list", {
            success: function (r) {
                var items = r.data.map(function (item) { return item.article_class_name; });
                _this.setData({ items: items });
                _this.setData({ info: r.data });
            }
        });
    },
    onLoad: function () {
        this.getInfo();
    }
});
