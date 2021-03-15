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
var wechatInfo;
var _bindMobile = (function (_super) {
    __extends(_bindMobile, _super);
    function _bindMobile() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.data = {
            session: null,
            wechatInfo: wechatInfo,
            step: 1,
            mobile: null,
            code: "",
            lastTime: 0,
        };
        return _this;
    }
    _bindMobile.prototype.submit = function () {
        var _this = this;
        util_1.getData("/user_service/v1/allow/wechat/applet_register", {
            method: "POST",
            data: {
                mobile: this.data.mobile,
                code: this.data.code,
                session_data: this.data.session,
                iv: this.data.wechatInfo.iv,
                encrypted_data: this.data.wechatInfo.encryptedData,
            },
            success: function (r) {
                util_1.event.push("updateUserState");
                util_1.tim && util_1.tim.logout();
                util_1.initTim();
                if (_this.data.mobile) {
                    _this.toast("您已成功绑定手机号！");
                }
                setTimeout(function () {
                    if (r.data.has_base_info) {
                        wx.switchTab({ url: "/pages/home/home/home" });
                    }
                    else {
                        wx.navigateTo({ url: "/pages/login/setInfo/setInfo" });
                    }
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
    _bindMobile.prototype.onShow = function () {
        wx.hideHomeButton();
    };
    _bindMobile.prototype.onInit = function (e) {
        var _this = this;
        wx.getUserInfo({
            success: function (r) {
                _this.set({ wechatInfo: r });
            }
        });
        wx.getStorage({
            key: "session_data",
            success: function (r) {
                _this.set({ session: r.data });
                wx.removeStorage({ key: "session_data" });
            }
        });
    };
    return _bindMobile;
}(util_1.BasePage));
Page(new _bindMobile());
