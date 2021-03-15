"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../../../utilTs/util");
Page({
    data: {
        tab: 0,
        info: null,
    },
    changeTab: function (e) {
        this.setData({ tab: e.detail });
    },
    getInfo: function () {
        var _this = this;
        util_1.getData("/static_service/v1/allow/school/rank/from_list", {
            success: function (r) {
                _this.setData({ info: r.data });
            }
        });
    },
    onLoad: function () {
        this.getInfo();
    }
});
