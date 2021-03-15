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
var _page = (function (_super) {
    __extends(_page, _super);
    function _page() {
        var _this = _super.call(this) || this;
        _this.data = __assign(__assign({}, _this.data), { info: null, zhaoshengTab: 0 });
        return _this;
    }
    _page.prototype.attentSchool = function () {
        var _this = this;
        util_1.getData("/user_service/v1/auth/attention/school/" + this.data.info.school_id, {
            method: this.data.info.is_attention ? "DELETE" : "POST",
            success: function (r) {
                _this.data.info.is_attention = !_this.data.info.is_attention;
                _this.set({ info: _this.data.info });
            }
        });
    };
    _page.prototype.toPossibility = function () {
        switch (this.data.globalUserInfo.prov_model_ex) {
            case 1:
                wx.navigateTo({ url: "/pages/school/possiblity/possibility?school_id=" + this.data.info.school_id });
                break;
            default: wx.navigateTo({ url: "/pages/school/majorGroup/majorGroup?school_id=" + this.data.info.school_id });
        }
    };
    _page.prototype.toSchoolData = function (e) {
        var _this = this;
        var dataset = e.currentTarget.dataset;
        wx.setStorage({
            key: "schoolDataTab",
            data: dataset.tab,
            success: function (r) {
                wx.navigateTo({ url: "/pages/school/data/data?school_id=" + _this.data.info.school_id });
            }
        });
    };
    _page.prototype.contact = function () {
        var _a, _b;
        if (((_a = this.data.info) === null || _a === void 0 ? void 0 : _a.contact_list.length) == 1) {
            wx.makePhoneCall({
                phoneNumber: (_b = this.data.info) === null || _b === void 0 ? void 0 : _b.contact_list[0].v
            });
        }
    };
    _page.prototype.copyWebsite = function () {
        var _a;
        wx.setClipboardData({
            data: (_a = this.data.info) === null || _a === void 0 ? void 0 : _a.official_website,
            success: function (res) {
                wx.getClipboardData({
                    success: function (res) {
                        wx.showToast({ title: "复制成功！" });
                    }
                });
            }
        });
    };
    _page.prototype.changeTab = function (e) {
        var dataset = e.currentTarget.dataset;
        this.set({ zhaoshengTab: dataset.tab });
    };
    _page.prototype.getInfo = function (options) {
        var _this = this;
        util_1.getData("/static_service/v1/allow/school/" + options.school_id + "/school_info", {
            success: function (r) {
                var schoolContentLength = 40;
                r.data.school_content = r.data.school_content.length > schoolContentLength ? r.data.school_content.substr(0, schoolContentLength) + '···' : r.data.school_content;
                _this.set({ info: r.data });
            }
        });
    };
    _page.prototype.openPdf = function (e) {
        var dataset = e.currentTarget.dataset;
        wx.showLoading({ title: "\u52A0\u8F7D\u4E2D\uFF0C\u8BF7\u7A0D\u540E\u00B7\u00B7\u00B7" });
        wx.downloadFile({
            url: dataset.pdf.ex,
            success: function (res) {
                var filePath = res.tempFilePath;
                wx.openDocument({
                    filePath: filePath,
                    success: function (res) {
                        wx.hideLoading();
                    }
                });
            }
        });
    };
    _page.prototype.onInit = function (options) {
        if (!options.school_id) {
            options = { school_id: options.notification_id };
        }
        this.getInfo(options);
    };
    return _page;
}(util_1.GlobalUserInfoPage));
Page(new _page());
