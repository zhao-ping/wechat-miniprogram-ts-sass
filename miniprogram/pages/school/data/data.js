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
var school_id, info, popupMajor;
var tabType;
(function (tabType) {
    tabType[tabType["schoolAdmit"] = 0] = "schoolAdmit";
    tabType[tabType["majorAdmit"] = 1] = "majorAdmit";
    tabType[tabType["plan"] = 2] = "plan";
})(tabType || (tabType = {}));
;
var schoolAdmit, majorAdmit, plan;
var _page = (function (_super) {
    __extends(_page, _super);
    function _page() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.data = {
            tab: null,
            info: info,
            schoolAdmit: schoolAdmit,
            majorAdmit: majorAdmit,
            plan: plan,
            popupMajor: popupMajor,
            scrollLeft: 0,
        };
        return _this;
    }
    _page.prototype.beixuanSchool = function () {
        var _this = this;
        var data = {
            school_id: this.data.info.school_id
        };
        var table;
        if (this.data.info.page_model == 4) {
            table = this.data.plan.tables[0];
            data.subject_group_id = table.subject_group_id;
            data.admit_order_type = table.admit_order_type;
        }
        else if (this.data.info.page_model == 1) {
            if (this.data.tab == tabType.schoolAdmit) {
                table = this.data.schoolAdmit.tables[0];
            }
            else if (this.data.tab == tabType.majorAdmit) {
                table = this.data.majorAdmit.tables[0];
            }
            else {
                table = this.data.plan.tables[0];
            }
            data.admit_order_type = table.admit_order_type;
        }
        else {
            return;
        }
        util_1.getData("/data_service/v1/auth/alternative/school", {
            method: table.is_alternative ? 'DELETE' : 'POST',
            data: data,
            success: function (r) {
                if (_this.data.info.page_model == 4) {
                    table.is_alternative = !table.is_alternative;
                    _this.set({ plan: _this.data.plan });
                }
                else if (_this.data.info.page_model == 1) {
                    var is_alternative = !table.is_alternative;
                    if (_this.data.schoolAdmit && _this.data.schoolAdmit.tables[0].admit_order_type == table.admit_order_type) {
                        _this.data.schoolAdmit.tables[0].is_alternative = is_alternative;
                        _this.set({ schoolAdmit: _this.data.schoolAdmit });
                    }
                    if (_this.data.majorAdmit && _this.data.majorAdmit.tables[0].admit_order_type == table.admit_order_type) {
                        _this.data.majorAdmit.tables[0].is_alternative = is_alternative;
                        _this.set({ majorAdmit: _this.data.majorAdmit });
                    }
                    if (_this.data.plan && _this.data.plan.tables[0].admit_order_type == table.admit_order_type) {
                        _this.data.plan.tables[0].is_alternative = is_alternative;
                        _this.set({ plan: _this.data.plan });
                    }
                }
            }
        });
    };
    _page.prototype.beixuanPopMajor = function () {
        var _this = this;
        var data = {
            school_id: this.data.info.school_id,
            admit_order_type: this.data.popupMajor.major_info.admit_order_type,
            major_id: this.data.popupMajor.major_info.major_id,
            match_id: this.data.popupMajor.major_info.match_id,
            subject_group_id: this.data.popupMajor.major_info.subject_group_id,
        };
        util_1.getData("/data_service/v1/auth/alternative/major", {
            method: this.data.popupMajor.is_alternative ? 'DELETE' : "POST",
            data: data,
            success: function (r) {
                _this.data.popupMajor.is_alternative = !_this.data.popupMajor.is_alternative;
                _this.set({ popupMajor: _this.data.popupMajor });
            },
        });
    };
    _page.prototype.getMajorInfo = function (e) {
        var _this = this;
        var c = this.getComp("#popupMajor");
        c.toShow();
        var item = this.getElDataSet(e).item;
        if (this.data.popupMajor && item.major_id == this.data.popupMajor.major_info.major_id)
            return;
        util_1.getData("/data_service/v1/auth/school/" + this.data.info.school_id + "/major_score/" + item.major_id, {
            data: {
                school_id: this.data.info.school_id,
                subject_group_id: item.subject_group_id,
                major_id: item.major_id,
                match_id: item.match_id,
                admit_order_type: item.admit_order_type,
            },
            success: function (r) {
                var major = {
                    subject_equal: r.data.subject_equal,
                    is_alternative: r.data.is_alternative,
                    major_info: {
                        admit_order_type: item.admit_order_type,
                        major_id: r.data.major_id,
                        major_name: r.data.major_name,
                        match_id: r.data.match_id,
                        subject_group_id: r.data.subject_group_id,
                        subject_limit_id: r.data.subject_limit_id,
                    },
                    msg_info: {
                        major_tag: r.data.major_tag,
                        is_base_major: r.data.is_base_major,
                        major_warning: r.data.major_warning,
                        subjects: r.data.subjects,
                    },
                    tables: r.data.major_line_info_table,
                };
                _this.set({
                    popupMajor: __assign(__assign({}, major), { no_school_link: true, has_beixuan: true }),
                });
            },
        });
    };
    _page.prototype.reSearch = function (e) {
        if (this.data.tab == tabType.plan) {
            this.getPlan(e.detail);
        }
        else if (this.data.tab == tabType.majorAdmit) {
            this.getMajorAdmit(e.detail);
        }
        else if (this.data.tab == tabType.schoolAdmit) {
            this.getSchoolAdmit(e.detail);
        }
    };
    _page.prototype.changeSchool = function (e) {
        var dataset = e.currentTarget.dataset;
        school_id = dataset.schoolid;
        this.set({ plan: null });
        this.set({ majorAdmit: null });
        this.set({ schoolAdmit: null });
        this.setTab();
    };
    _page.prototype.setTab = function (e) {
        if (e) {
            this.set({ tab: e.detail });
            wx.setStorage({
                key: "schoolDataTab",
                data: this.data.tab,
            });
        }
        if (this.data.tab == tabType.plan && !this.data.plan) {
            this.getPlan();
        }
        else if (this.data.tab == tabType.majorAdmit && !this.data.majorAdmit) {
            this.getMajorAdmit();
        }
        else if (this.data.tab == tabType.schoolAdmit && !this.data.schoolAdmit) {
            this.getSchoolAdmit();
        }
    };
    _page.prototype.getPlan = function (filter) {
        var _this = this;
        var url = this.data.plan
            ? "/data_service/v1/auth/school/" + school_id + "/plan/table"
            : "/data_service/v1/auth/school/" + school_id + "/plan/v2";
        util_1.getData(url, {
            data: filter || {},
            success: function (r) {
                if (r.data.base_data) {
                    _this.set({ info: r.data.base_data });
                    _this.set({ plan: r.data });
                    wx.setNavigationBarTitle({ title: r.data.base_data.school_name });
                }
                else {
                    _this.data.plan.tables = r.data;
                    _this.set({ plan: _this.data.plan });
                }
            },
        });
    };
    _page.prototype.getMajorAdmit = function (filter) {
        var _this = this;
        var url = this.data.majorAdmit
            ? "/data_service/v1/auth/school/" + school_id + "/major_score/table"
            : "/data_service/v1/auth/school/" + school_id + "/major_score/v2";
        util_1.getData(url, {
            data: filter || {},
            success: function (r) {
                if (r.data.base_data) {
                    _this.set({ info: r.data.base_data });
                    _this.set({ majorAdmit: r.data });
                    wx.setNavigationBarTitle({ title: r.data.base_data.school_name });
                }
                else {
                    _this.data.majorAdmit.tables = r.data;
                    _this.set({ majorAdmit: _this.data.majorAdmit });
                }
            },
        });
    };
    _page.prototype.getSchoolAdmit = function (filter) {
        var _this = this;
        var url = this.data.schoolAdmit
            ? "/data_service/v1/auth/school/" + school_id + "/line_table"
            : "/data_service/v1/auth/school/" + school_id + "/line/v2";
        util_1.getData(url, {
            data: filter || {},
            success: function (r) {
                if (r.data.base_data) {
                    _this.set({ info: r.data.base_data });
                    _this.set({ schoolAdmit: r.data });
                    wx.setNavigationBarTitle({ title: r.data.base_data.school_name });
                }
                else {
                    _this.data.schoolAdmit.tables = r.data;
                    _this.set({ schoolAdmit: _this.data.schoolAdmit });
                }
            },
        });
    };
    _page.prototype.onInit = function (options) {
        school_id = options.school_id;
        this.set({ tab: wx.getStorageSync("schoolDataTab") || 0 });
        this.setTab();
    };
    return _page;
}(util_1.GlobalUserInfoPage));
Page(new _page());
