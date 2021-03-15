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
var history = wx.getStorageSync("searchSchoolPossibilityHistory");
var app = getApp();
var _searchSchoolPossibility = (function (_super) {
    __extends(_searchSchoolPossibility, _super);
    function _searchSchoolPossibility() {
        var _this = _super.call(this) || this;
        _this.data = __assign(__assign({}, _this.data), { school_name: "", search: [], history: [] });
        return _this;
    }
    _searchSchoolPossibility.prototype.clearHistory = function () {
        this.set({ history: [] });
        wx.removeStorageSync('searchSchoolPossibilityHistory');
    };
    _searchSchoolPossibility.prototype.chooseSchool = function (e) {
        var dataset = e.currentTarget.dataset;
        var school = dataset.school;
        var newHistory = util_1.refreshHistory(this.data.history, school);
        this.set({ history: newHistory });
        wx.setStorageSync("searchSchoolPossibilityHistory", newHistory);
        if (this.data.globalUserInfo.prov_model == 4 || this.data.globalUserInfo.prov_model == 3) {
            wx.navigateTo({ url: "/pages/school/majorGroup/majorGroup?school_id=" + school.school_id + "&admit_order_type=" + school.admit_order_type });
        }
        else if (this.data.globalUserInfo.prov_model == 1) {
            wx.navigateTo({ url: "/pages/school/possiblity/possibility?school_id=" + school.school_id + "&admit_order_type=" + school.admit_order_type });
        }
    };
    _searchSchoolPossibility.prototype.toSearch = function () {
        var _this = this;
        util_1.getData("/data_service/v1/auth/school/probability_search", {
            data: { school_name: this.data.school_name, limit: 50, },
            success: function (r) {
                _this.set({ search: r.data });
            }
        });
    };
    _searchSchoolPossibility.prototype.onInit = function () {
        if (!app.globalData.user_info) {
            wx.navigateTo({ url: '/pages/login/login/login' });
        }
        if (history) {
            this.set({ history: history });
        }
    };
    return _searchSchoolPossibility;
}(util_1.GlobalUserInfoPage));
Page(new _searchSchoolPossibility());
