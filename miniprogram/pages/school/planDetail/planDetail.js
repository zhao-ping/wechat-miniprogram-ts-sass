"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../../../utilTs/util");
Page({
    data: {
        info: null,
    },
    getInfo: function (id) {
        var _this = this;
        util_1.getData("/static_service/v1/allow/school/admissions_guide/" + id, {
            success: function (r) {
                _this.setData({ info: r.data });
            }
        });
    },
    onLoad: function (options) {
        this.getInfo(options.id);
    }
});
