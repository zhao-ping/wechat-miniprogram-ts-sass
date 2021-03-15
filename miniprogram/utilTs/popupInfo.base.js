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
exports.PopupInfoBase = void 0;
var util_1 = require("./util");
var PopupInfoBase = (function (_super) {
    __extends(PopupInfoBase, _super);
    function PopupInfoBase(listApi, type) {
        var _this = _super.call(this) || this;
        _this.listApi = listApi;
        _this.type = type;
        _this.data = __assign(__assign({}, _this.data), { userInfo: null, showPopupMajor: false, popupMajor: null });
        return _this;
    }
    PopupInfoBase.prototype.toSchoolDetail = function (e) {
        if (!this.data.isZhiyuanPage) {
            var item = this.getElDataSet(e).item;
            wx.navigateTo({ url: "/pages/school/school/school?school_id=" + item.school_id });
        }
    };
    PopupInfoBase.prototype.showMoreMajors = function (e) {
        var _a = this.getElDataSet(e).item, school_id = _a.school_id, subject_group_id = _a.subject_group_id;
        var index = this.getElDataSet(e).index;
        var url = "";
        if (this.data.isZhiyuanPage) {
            url = "/pages/zhiyuan/scoreMajorMoreMajors/scoreMajorMoreMajors?school_id=" + school_id + "&uca_id=" + this.data.uca_id + "&index=" + index + "&isZhiyuanPage=" + this.data.isZhiyuanPage;
        }
        else {
            url = "/pages/zhiyuan/scoreMajorMoreMajors/scoreMajorMoreMajors?school_id=" + school_id + "&admit_order_type=" + this.data.baseInfo.admit_order_type + "&search_tag=1&subject_group_id=" + subject_group_id + "&index=" + index;
        }
        wx.navigateTo({ url: url });
    };
    PopupInfoBase.prototype.getMajorInfo = function (e) {
        var _this = this;
        var _a, _b;
        var c = this.getComp("#popupMajor");
        c.toShow();
        var _c = this.getElDataSet(e).item, school_id = _c.school_id, major_id = _c.major_id, match_id = _c.match_id, subject_group_id = _c.subject_group_id;
        if ((_a = this.data.params) === null || _a === void 0 ? void 0 : _a.school_id) {
            school_id = this.data.params.school_id;
        }
        if ((_b = this.data.params) === null || _b === void 0 ? void 0 : _b.subject_group_id) {
            subject_group_id = this.data.params.subject_group_id;
        }
        if (this.data.popupMajor &&
            school_id == this.data.popupMajor.major_info.school_id &&
            major_id == this.data.popupMajor.major_info.major_id &&
            major_id == this.data.popupMajor.major_info.major_id)
            return;
        util_1.getData("/data_service/v1/auth/school/" + school_id + "/major_score/" + major_id + "/can_up", {
            data: {
                school_id: school_id,
                subject_group_id: subject_group_id,
                major_id: major_id,
                match_id: match_id,
                admit_order_type: this.data.baseInfo ? this.data.baseInfo.admit_order_type : this.data.info.application.admit_order_type,
            },
            success: function (r) {
                _this.set({ popupMajor: r.data });
            },
        });
    };
    PopupInfoBase.prototype.toMoreMajors = function (e) {
        var c = this.getComp("#popupSchool");
        c.toHide();
        var _a = this.data.popupSchool.school_info, school_id = _a.school_id, admit_order_type = _a.admit_order_type, subject_group_id = _a.subject_group_id;
        wx.navigateTo({ url: "/pages/zhiyuan/scoreMajorMoreMajors/scoreMajorMoreMajors?school_id=" + school_id + "&admit_order_type=" + admit_order_type + "&search_tag=1&index=" + this.data.schoolIndex + "&subject_group_id=" + subject_group_id });
    };
    PopupInfoBase.prototype.getSchoolInfo = function (e) {
        var _this = this;
        var c = this.getComp("#popupSchool");
        c.toShow();
        var _a = this.getElDataSet(e).item, school_id = _a.school_id, subject_group_id = _a.subject_group_id, admit_order_type = _a.admit_order_type;
        var schoolIndex = this.getElDataSet(e).index;
        this.data.schoolIndex = schoolIndex;
        if (this.data.popupSchool && (school_id == this.data.popupSchool.school_info.school_id) && (subject_group_id == this.data.popupSchool.school_info.subject_group_id) && (this.data.popupSchool && school_id == this.data.popupSchool.school_info.school_id) && (admit_order_type == this.data.popupSchool.school_info.admit_order_type)) {
            return;
        }
        util_1.getData("/data_service/v1/auth/school/" + school_id + "/line/can_up", {
            data: {
                school_id: school_id,
                subject_group_id: subject_group_id,
                admit_order_type: admit_order_type || (this.data.baseInfo ? this.data.baseInfo.admit_order_type : this.data.info.application.admit_order_type),
            },
            success: function (r) {
                _this.set({ popupSchool: r.data });
            }
        });
    };
    return PopupInfoBase;
}(util_1.GlobalUserInfoPage));
exports.PopupInfoBase = PopupInfoBase;
