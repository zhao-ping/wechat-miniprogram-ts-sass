"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../../../utilTs/util");
Page({
    data: {
        default: null,
        info: null,
    },
    changeAdmit: function (e) {
        var admit_order_type = e.currentTarget.dataset.admit;
        this.getInfo(admit_order_type);
    },
    getInfo: function (admit_order_type) {
        var _this = this;
        var data = {
            limit: 200,
            admit_order_type: admit_order_type,
        };
        util_1.getData("/data_service/v1/auth/choose_subject/can_choose", {
            data: data,
            success: function (r) {
                _this.setData({ info: r.data });
                var c = _this.selectComponent("#percent");
                c.draw();
            }
        });
    },
    onLoad: function () {
        this.getInfo();
    }
});
