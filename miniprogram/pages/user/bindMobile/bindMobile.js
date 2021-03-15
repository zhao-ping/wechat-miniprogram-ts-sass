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
var _bindMobile = (function (_super) {
    __extends(_bindMobile, _super);
    function _bindMobile() {
        var _this = _super.call(this) || this;
        _this.data = __assign(__assign({}, _this.data), { step: 1, mobile: null, code: "", lastTime: 0 });
        return _this;
    }
    _bindMobile.prototype.submit = function () {
        var _this = this;
        if (!this.data.code) {
            this.toast("请输入验证码");
            return;
        }
        util_1.getData("/user_service/v1/auth/user/bind_mobile", {
            method: "PUT",
            data: { mobile: this.data.mobile, code: this.data.code },
            success: function (r) {
                _this.toast("您已成功绑定手机号！");
                _this.getGlobalUserInfo(function () {
                    util_1.event.push("updateUserState");
                });
                setTimeout(function () {
                    wx.navigateBack();
                }, 1500);
            }
        });
    };
    _bindMobile.prototype.getCode = function () {
        var _this = this;
        util_1.getData("/user_service/v1/allow/msg/send", {
            method: "POST",
            data: { mobile: this.data.mobile, type: 1, },
            success: function (r) {
                _this.set({ step: 2 });
                _this.set({ "lastTime": 60 });
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
    _bindMobile.prototype.onInit = function () {
        var app = getApp();
        this.set({ globalUserInfo: app.globalData.user_info });
    };
    return _bindMobile;
}(util_1.GlobalUserInfoPage));
Page(new _bindMobile());
