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
var _zhiyuan = (function (_super) {
    __extends(_zhiyuan, _super);
    function _zhiyuan() {
        var _this = _super.call(this) || this;
        _this.data = __assign(__assign({}, _this.data), { info: null, safeTop: null });
        return _this;
    }
    _zhiyuan.prototype.getZhiyuanInfo = function () {
        var _this = this;
        util_1.getData("/data_service/v1/auth/application/total_info", {
            success: function (r) {
                _this.set({ info: r.data });
                app.globalData.user_info = __assign(__assign({}, app.globalData.user_info), r.data);
            }
        });
    };
    _zhiyuan.prototype.onInit = function () {
        this.getZhiyuanInfo();
        util_1.event.on(this, "updateUserInfo,batchMajor,beixuanSchool,beixuanMajor,zhiyuan", this.getZhiyuanInfo);
    };
    _zhiyuan.prototype.onShow = function () {
        var _this = this;
        wx.getSystemInfo({
            success: function (r) {
                _this.set({ safeTop: r.safeArea.top + 'px' });
            }
        });
    };
    return _zhiyuan;
}(util_1.GlobalUserInfoPage));
Page(new _zhiyuan());
