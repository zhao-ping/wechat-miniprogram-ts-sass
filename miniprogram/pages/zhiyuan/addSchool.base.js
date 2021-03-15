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
exports.AddSchoolBase = void 0;
var scoreChoose_base_1 = require("../../utilTs/scoreChoose.base");
var util_1 = require("../../utilTs/util");
var AddSchoolBase = (function (_super) {
    __extends(AddSchoolBase, _super);
    function AddSchoolBase(listApi, type) {
        var _this = _super.call(this, listApi, type) || this;
        _this.listApi = listApi;
        _this.type = type;
        _this.data = __assign(__assign({}, _this.data), { isZhiyuanPage: true, uca_id: null, statusBarHeight: 0 });
        return _this;
    }
    AddSchoolBase.prototype.toApplication = function () {
        wx.navigateBack();
    };
    AddSchoolBase.prototype.addMajor = function (e) {
        var _this = this;
        var _a = this.getElDataSet(e), item = _a.item, index = _a.index;
        var url, data;
        if (item.is_application_checked) {
            url = "/data_service/v1/auth/application/school/del";
            data = {
                uca_id: this.data.uca_id,
                ucas_id: item.ucas_id,
            };
        }
        else {
            url = "/data_service/v1/auth/application/school/add";
            data = {
                uca_id: this.data.uca_id,
                school_id: item.school_id,
                subject_group_id: item.subject_group_id,
                subject_limit_id: item.subject_limit_id,
                major_id: item.major_id,
                match_id: item.match_id,
                sort_index: this.data.sort_index,
            };
        }
        util_1.getData(url, {
            method: item.is_application_checked ? "DELETE" : 'POST',
            data: data,
            success: function (r) {
                _this.data.list[index].ucas_id = r.data.ucas_id;
                _this.data.list[index].is_application_checked = !item.is_application_checked;
                _this.set({ list: _this.data.list });
            }
        });
    };
    AddSchoolBase.prototype.addSchool = function (e) {
        var _this = this;
        var _a = this.getElDataSet(e), item = _a.item, index = _a.index;
        var url = item.is_application_checked ? "/data_service/v1/auth/application/school/del" : "/data_service/v1/auth/application/school/add";
        var data;
        if (item.is_application_checked) {
            url = "/data_service/v1/auth/application/school/del";
            data = {
                uca_id: this.data.uca_id,
                ucas_id: item.ucas_id,
                school_id: item.school_id,
                subject_group_id: item.subject_group_id,
            };
        }
        else {
            url = "/data_service/v1/auth/application/school/add";
            data = {
                uca_id: this.data.uca_id,
                school_id: item.school_id,
                subject_group_id: item.subject_group_id,
                subject_limit_id: item.subject_limit_id,
                major_id: item.major_id,
                match_id: 1,
                sort_index: this.data.sort_index,
                is_adjust: true,
                adjust_type: null,
            };
        }
        util_1.getData(url, {
            data: data,
            method: item.is_application_checked ? "DELETE" : "POST",
            success: function (r) {
                _this.data.list[index].is_application_checked = !item.is_application_checked;
                _this.set({ list: _this.data.list });
                if (_this.data.sort_index) {
                    wx.navigateBack();
                }
                else {
                    _this.data.list[index].ucas_id = r.data.ucas_id;
                }
            }
        });
    };
    AddSchoolBase.prototype.onInit = function (e) {
        this.set({ uca_id: e.uca_id ? Number(e.uca_id) : 0 });
        this.set({ sort_index: e.sort_index ? Number(e.sort_index) : 0 });
        this.getList();
    };
    AddSchoolBase.prototype.onShow = function () {
        var app = getApp();
        this.set({ statusBarHeight: app.systemInfo.statusBarHeight });
    };
    return AddSchoolBase;
}(scoreChoose_base_1.ScoreChooseBase));
exports.AddSchoolBase = AddSchoolBase;
