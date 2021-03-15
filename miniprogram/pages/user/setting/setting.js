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
var app = getApp();
var _setting = (function (_super) {
    __extends(_setting, _super);
    function _setting() {
        return _super.call(this) || this;
    }
    _setting.prototype.logout = function () {
        app.conf.requestHeader.token = "";
        this.clearSomeStorage();
        wx.navigateTo({ url: "/pages/login/login/login" });
    };
    _setting.prototype.logoff = function () {
        var _this = this;
        if (this.data.globalUserInfo.user_state != 1) {
            wx.navigateTo({ url: "/pages/user/logoff/logoff" });
        }
        else {
            wx.showModal({
                title: "",
                content: "注销帐号后，你的信息、付费内容以及权益都将失效！你确定要注销吗",
                success: function () {
                    util_1.getData("/user_service/v1/auth/user/logoff", {
                        method: "DELETE",
                        success: function (r) {
                            util_1.toast("您已成功注销账户");
                            app.conf.requestHeader.token = "";
                            _this.clearSomeStorage();
                            setTimeout(function () {
                                wx.navigateTo({ url: "/pages/login/login/login" });
                            }, 2000);
                        }
                    });
                }
            });
        }
    };
    _setting.prototype.onInit = function () {
        var _this = this;
        util_1.event.on(this, "updateUserState", function () {
            _this.set({ globalUserInfo: app.globalData.user_info });
        });
    };
    return _setting;
}(util_1.GlobalUserInfoPage));
Page(new _setting());
