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
var app = getApp();
var _logoff = (function (_super) {
    __extends(_logoff, _super);
    function _logoff() {
        var _this = _super.call(this) || this;
        _this.data = __assign(__assign({}, _this.data), { code: null, lastTime: 0 });
        return _this;
    }
    _logoff.prototype.getCode = function () {
        var _this = this;
        util_1.getData("/user_service/v1/allow/msg/send", {
            method: "POST",
            data: { mobile: "" + this.data.userInfo.mobile_encryption, type: 3, },
            success: function (r) {
                _this.data.lastTime = 60;
                var timeInter = setInterval(function () {
                    if (_this.data.lastTime >= 1) {
                        _this.set({ "lastTime": _this.data.lastTime - 1 });
                    }
                    else {
                        clearInterval(timeInter);
                    }
                }, 1000);
            }
        });
    };
    _logoff.prototype.logoff = function () {
        var _this = this;
        wx.showModal({
            title: "",
            content: "注销帐号后，你的信息、付费内容以及权益都将失效！你确定要注销吗",
            success: function () {
                util_1.getData("/user_service/v1/auth/user/logoff", {
                    method: "DELETE",
                    data: {
                        code: _this.data.code,
                        mobile: "" + _this.data.userInfo.mobile_encryption,
                    },
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
    };
    _logoff.prototype.onInit = function () {
        this.set({ userInfo: app.globalData.user_info });
    };
    return _logoff;
}(util_1.GlobalUserInfoPage));
Page(new _logoff());
