"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../../../utilTs/util");
Page({
    data: {
        content: null,
        contact: null,
    },
    feedback: function () {
        if (!this.data.content) {
            util_1.toast("请输入反馈内容");
            return;
        }
        var data = {
            content: this.data.content,
            contact: this.data.contact,
        };
        util_1.getData("/user_service/v1/auth/user/feedback", {
            method: "POST",
            data: data,
            success: function (r) {
                util_1.toast("反馈成功");
                setTimeout(function () {
                    wx.switchTab({ url: "/pages/user/user/user" });
                }, 2000);
            }
        });
    }
});
