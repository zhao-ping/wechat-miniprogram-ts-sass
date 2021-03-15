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
var _contactUs = (function (_super) {
    __extends(_contactUs, _super);
    function _contactUs() {
        var _this = _super.call(this) || this;
        _this.data = __assign(__assign({}, _this.data), { info: null });
        return _this;
    }
    _contactUs.prototype.contact = function (e) {
        var _a = e.currentTarget.dataset, type = _a.type, value = _a.value;
        switch (type) {
            case 1:
                wx.setClipboardData({
                    data: value,
                    success: function (res) {
                        util_1.toast("您已成功复制微信号");
                    }
                });
                break;
            case 2:
                wx.makePhoneCall({
                    phoneNumber: value
                });
                break;
            default:
                this.contactMe();
        }
    };
    _contactUs.prototype.contactMe = function () {
        if (this.data.globalUserInfo.user_state == 1) {
            wx.showModal({
                title: "",
                content: "\u8BF7\u5148\u7ED1\u5B9A\u624B\u673A\u53F7",
                success: function (e) {
                    if (e.confirm) {
                        wx.navigateTo({ url: "/pages/user/bindMobile/bindMobile" });
                    }
                }
            });
        }
        else {
            wx.showModal({
                title: "",
                content: "\u8BF7\u5BA2\u670D\u8054\u7CFB\u6211\"\u7533\u8BF7\u6210\u529F\u540E\uFF0C\u5BA2\u670D\u4F1A\u5C3D\u5FEB\u8054\u7CFB\u60A8\uFF0C\u8BF7\u8010\u5FC3\u7B49\u5F85\uFF01",
                success: function () {
                    util_1.getData("/static_service/v1/auth/service/connect_me", {
                        success: function (r) {
                            util_1.toast("申请成功，客服会尽快联系您，请耐心等待！");
                        }
                    });
                }
            });
        }
    };
    _contactUs.prototype.getInfo = function () {
        var _this = this;
        util_1.getData("/static_service/v1/allow/service/customer_service", {
            success: function (r) {
                _this.set({ info: r.data });
            }
        });
    };
    _contactUs.prototype.onInit = function () {
        var _this = this;
        this.getInfo();
        util_1.event.on(this, "updateUserState", function () {
            _this.getInfo();
        });
    };
    return _contactUs;
}(util_1.GlobalUserInfoPage));
Page(new _contactUs());
