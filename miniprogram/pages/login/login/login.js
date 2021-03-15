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
var ts_md5_1 = require("ts-md5");
var app = getApp();
var _login = (function (_super) {
    __extends(_login, _super);
    function _login() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.data = {
            authUserInfo: true,
            loginType: 0,
            step: 1,
            lastTime: 60,
            mobile: "13980478084",
            password: "123456",
            code: "",
        };
        return _this;
    }
    _login.prototype.onShow = function () {
        wx.hideHomeButton();
        app.conf.requestHeader.token = "";
        this.clearSomeStorage();
    };
    _login.prototype.changeLoginType = function () {
        var type = this.data.loginType == 0 ? 1 : 0;
        this.set({ loginType: type });
        this.set({ step: 1 });
    };
    _login.prototype.getCode = function () {
        var _this = this;
        util_1.getData("/user_service/v1/allow/msg/send", {
            method: "POST",
            data: { mobile: this.data.mobile, type: 1, },
            success: function (r) {
                _this.set({ "step": 2 });
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
    _login.prototype.navigatePage = function (data) {
        if (!data.has_base_info || data.is_new_user) {
            wx.navigateTo({ url: "/pages/login/setInfo/setInfo" });
        }
        else {
            var newLginInfo = {
                user_id: data.user_id,
                type: "mobilePassword",
            };
            wx.setStorage({
                key: "loginInfo",
                data: newLginInfo,
            });
            this.getUserInfo();
        }
    };
    _login.prototype.login = function () {
        var _this = this;
        if (this.data.loginType == 0 && this.data.step == 1) {
            this.getCode();
            return;
        }
        var data = { mobile: this.data.mobile, };
        if (!util_1.isMobile(this.data.mobile)) {
            util_1.toast("请输入正确的手机号码");
            return;
        }
        if (this.data.loginType == 0) {
            if (!this.data.code) {
                util_1.toast("请输入验证码");
                return;
            }
            data.code = this.data.code;
        }
        else {
            if (!this.data.password) {
                util_1.toast("请输入密码");
                return;
            }
            data.password = ts_md5_1.Md5.hashStr(this.data.password);
        }
        util_1.getData("/user_service/v1/allow/login", {
            method: "POST",
            data: data,
            success: function (r) {
                util_1.event.push("updateUserInfo");
                util_1.tim && util_1.tim.logout();
                util_1.initTim();
                _this.navigatePage(r.data);
            }
        });
    };
    _login.prototype.getUserInfo = function () {
        util_1.getData("/user_service/v1/auth/user/info", {
            success: function (r) {
                wx.setStorageSync("userInfo", r.data);
                app.globalData.user_info = __assign(__assign({}, app.globalData.user_info || {}), r.data);
                util_1.event.push("updateScore,updataUserInfo");
                wx.switchTab({ url: "/pages/home/home/home" });
            }
        });
    };
    _login.prototype.wechatLogin = function () {
        var _this = this;
        wx.showLoading({ title: "登录中，请稍后..." });
        wx.getUserInfo({
            success: function (r) {
                wx.login({
                    success: function (res) {
                        if (res.code) {
                            util_1.getData("/user_service/v1/allow/wechat/applet_login", {
                                method: "POST",
                                data: {
                                    code: res.code,
                                    encrypted_data: r.encryptedData,
                                    iv: r.iv,
                                },
                                success: function (r) {
                                    wx.hideLoading();
                                    wx.setStorage({ key: "session_data", data: r.data.session_data });
                                    if (r.data.is_bind) {
                                        util_1.event.push("updateUserInfo");
                                        util_1.tim && util_1.tim.logout();
                                        util_1.initTim();
                                        _this.navigatePage(r.data.login_register_data);
                                    }
                                    else {
                                        wx.navigateTo({ url: "/pages/login/bingMobile/bindMobile" });
                                    }
                                }
                            });
                        }
                        else {
                            util_1.toast("获取微信信息失败，请重试！");
                        }
                    }
                });
            },
            complete: function (r) {
            }
        });
    };
    _login.prototype.onInit = function () {
        var _this = this;
        wx.getSetting({
            success: function (r) {
                if (r.authSetting) {
                    _this.set({ authUserInfo: false });
                }
            }
        });
    };
    return _login;
}(util_1.BasePage));
Page(new _login());
