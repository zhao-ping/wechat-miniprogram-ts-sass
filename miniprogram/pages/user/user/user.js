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
var _user = (function (_super) {
    __extends(_user, _super);
    function _user() {
        var _this = _super.call(this) || this;
        _this.data = __assign(__assign({}, _this.data), { info: null });
        return _this;
    }
    _user.prototype.getUserInfo = function () {
        var _this = this;
        util_1.getData("/user_service/v1/auth/user/info", {
            success: function (r) {
                _this.set({ info: r.data });
                app.globalData.user_info = __assign(__assign({}, app.globalData.user_info), r.data);
            }
        });
    };
    _user.prototype.onInit = function () {
        this.getUserInfo();
        util_1.event.on(this, "updateUserInfo", this.getUserInfo);
    };
    _user.prototype.onShow = function () {
        this.set({ unreadCount: app.timInfo.unreadCount });
    };
    return _user;
}(util_1.GlobalUserInfoPage));
Page(new _user());
