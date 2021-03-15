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
var ts_md5_1 = require("ts-md5");
var util_1 = require("../../../utilTs/util");
var app = getApp();
var _password = (function (_super) {
    __extends(_password, _super);
    function _password() {
        var _this = _super.call(this) || this;
        _this.data = __assign(__assign({}, _this.data), { m: null, mobile: null, code: null, password: null, confirmPassword: null, lastTime: 0 });
        return _this;
    }
    _password.prototype.getCode = function () {
        var _this = this;
        util_1.getData("/user_service/v1/allow/msg/send", {
            method: "POST",
            data: { mobile: "" + this.data.mobile, type: 2, },
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
    _password.prototype.setPassword = function () {
        var _this = this;
        if (!this.data.mobile) {
            util_1.toast("请输入手机号");
            return;
        }
        if (!this.data.code) {
            util_1.toast("请输入验证码");
            return;
        }
        if (!this.data.password) {
            util_1.toast("请输入密码");
            return;
        }
        if (this.data.password != this.data.comfirmPassword) {
            util_1.toast("两次密码不一致");
            return;
        }
        var data = {
            "mobile": "" + this.data.mobile,
            "code": this.data.code,
            "password": ts_md5_1.Md5.hashStr(this.data.password)
        };
        util_1.getData(this.data.globalUserInfo ? "/user_service/v1/auth/user/update_password" : "/user_service/v1/allow/user/forget_password", {
            method: "PUT",
            data: data,
            success: function (r) {
                util_1.toast("您已成功设置密码！");
                _this.getGlobalUserInfo(function () {
                    util_1.event.push("updateUserState");
                });
                setTimeout(function () {
                    wx.navigateBack();
                }, 1500);
            }
        });
    };
    _password.prototype.initInfo = function () {
        if (app.globalData.user_info) {
            this.set({ userInfo: app.globalData.user_info });
            this.set({ mobile: app.globalData.user_info.mobile_encryption });
            wx.setNavigationBarTitle({ title: this.data.globalUserInfo.user_state == 2 ? '设置密码' : '修改密码' });
        }
    };
    _password.prototype.onInit = function () {
        this.initInfo();
        util_1.event.on(this, "updateUserState", this.initUserInfo);
    };
    return _password;
}(util_1.GlobalUserInfoPage));
Page(new _password());
