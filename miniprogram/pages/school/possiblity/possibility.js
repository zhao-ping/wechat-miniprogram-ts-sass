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
var info, admitIndex, lineChartParams, majors, major_evalution, enroll_evaluation_major_list, searchData, school_probability_info;
var _possibility = (function (_super) {
    __extends(_possibility, _super);
    function _possibility() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.data = {
            scrollViewId: "",
            searchData: searchData,
            admitIndex: admitIndex,
            info: info,
            lineChartParams: lineChartParams,
            majors: majors,
            major_evalution: major_evalution,
            showChao: false,
            majorsBeixuan: false,
            school_probability_info: school_probability_info,
            enroll_evaluation_major_list: enroll_evaluation_major_list,
        };
        return _this;
    }
    _possibility.prototype.clearMajors = function () {
        if (this.data.major_evalution != null) {
            for (var i = 0; i < this.data.major_evalution.major_list.length; i++) {
                this.data.major_evalution.major_list[i]['checked'] = false;
                this.set({ major_evalution: this.data.major_evalution });
            }
        }
        this.getInfo();
    };
    _possibility.prototype.checkMajor = function (e) {
        var dataset = e.currentTarget.dataset;
        var majorIndex = dataset.index;
        var ischecked = this.data.major_evalution.major_list[majorIndex].checked;
        if (!ischecked && this.data.major_evalution.major_list.filter(function (item) { return item.checked; }).length >= this.data.major_evalution.base_info.max_major_num) {
            util_1.toast("\u6700\u591A\u53EA\u80FD\u9009\u62E9" + this.data.major_evalution.base_info.max_major_num + "\u4E2A\u4E13\u4E1A\uFF01");
            return;
        }
        this.data.major_evalution.major_list[majorIndex].checked = !ischecked;
        this.set({ major_evalution: this.data.major_evalution });
    };
    _possibility.prototype.MultyBeixuan = function () {
        var _this = this;
        var formData = [];
        this.data.major_evalution.major_list.map(function (item) {
            if (item.checked) {
                var major = {
                    major_id: item.major_id,
                    match_id: item.match_id,
                    add_or_del: 1,
                    school_id: _this.data.info.school_probability_info.school_id,
                    admit_order_type: _this.data.info.school_probability_info.admit_order_type,
                    subject_group_id: _this.data.info.school_probability_info.subject_group_id,
                };
                formData.push(major);
            }
        });
        util_1.getData('/data_service/v1/auth/alternative/major/batch', {
            method: 'POST',
            data: formData,
            success: function (r) {
                _this.set({ majorsBeixuan: true });
                _this.data.info.school_probability_info.is_alternative = true;
                _this.set({ info: _this.data.info });
            }
        });
    };
    _possibility.prototype.hideMajors = function () {
        var c = this.getComp("#chooseMajor");
        c.toHide();
    };
    _possibility.prototype.showMajors = function () {
        var c = this.getComp("#chooseMajor");
        c.toShow();
        this.getMajors();
        wx.hideHomeButton();
    };
    _possibility.prototype.getMajors = function () {
        var _this = this;
        if (this.data.major_evalution)
            return;
        util_1.getData("/data_service/v1/auth/probability/" + this.data.info.school_probability_info.school_id + "/major_score/can_up", {
            data: {
                limit: 500,
                admit_order_type: this.data.info.school_probability_info.admit_order_type,
                subject_group_id: this.data.info.school_probability_info.subject_group_id,
                search_tag: 2,
            },
            success: function (r) {
                _this.set({ major_evalution: r.data });
            }
        });
    };
    _possibility.prototype.changeAdmit = function (e) {
        this.set({ admitIndex: e.detail.value });
        this.set({ searchData: __assign(__assign({}, this.data.searchData), { admit_order_type: this.data.info.school_probability_info.admit_order_type_list[this.data.admitIndex].v }) });
        this.set({ major_evalution: null });
        this.set({ enroll_evaluation_major_list: null });
        this.getInfo();
    };
    _possibility.prototype.scrollToView = function (e) {
        var dataset = e.currentTarget.dataset;
        this.set({ scrollViewId: dataset.id });
    };
    _possibility.prototype.getInfo = function () {
        var _this = this;
        var url = "/data_service/v1/auth/probability/" + this.data.searchData.school_id + "/enroll_evaluation";
        var data = __assign({}, this.data.searchData);
        var ismajorPossibility = this.data.major_evalution && this.data.major_evalution.major_list.filter(function (item) { return item.checked; }).length > 0;
        if (ismajorPossibility) {
            data.admit_order_type = this.data.info.school_probability_info.admit_order_type;
            var major_cout = this.data.major_evalution.major_list.filter(function (item) { return item.checked; }).length;
            if (major_cout < this.data.major_evalution.base_info.min_major_num || major_cout > this.data.major_evalution.base_info.max_major_num) {
                util_1.toast("\u8BF7\u9009\u62E9" + this.data.major_evalution.base_info.min_major_num + "-" + this.data.major_evalution.base_info.max_major_num + "\u4E2A\u4E13\u4E1A\u8FDB\u884C\u6D4B\u8BC4\uFF01");
                return;
            }
            url = "/data_service/v1/auth/probability/" + this.data.searchData.school_id + "/enroll_evaluation/major_evaluation";
            var majors_1 = [];
            var enroll_evaluation_major_list_1 = [];
            this.data.major_evalution.major_list.map(function (item) {
                if (item.checked) {
                    enroll_evaluation_major_list_1.push(item);
                    majors_1.push({ major_id: item.major_id, match_id: item.match_id });
                }
            });
            data.major_list = majors_1;
            this.set({ enroll_evaluation_major_list: enroll_evaluation_major_list_1 });
            this.set({ showChao: this.data.major_evalution.major_list.filter(function (item) { return item.checked; }).filter(function (item) { return item.is_exceed_min_score; }).length > 0 });
            this.set({ majorsBeixuan: false, });
        }
        util_1.getData(url, {
            data: data,
            method: ismajorPossibility ? "POST" : "GET",
            success: function (r) {
                var admits = r.data.school_probability_info.admit_order_type_list;
                if (admits.length > 1) {
                    var i = admits.findIndex(function (admit) { return admit.v == r.data.school_probability_info.admit_order_type; });
                    _this.set({ admitIndex: i });
                }
                _this.set({ enroll_evaluation_major_list: r.data.enroll_evaluation_major_list });
                _this.set({ info: r.data });
                if (r.data.plan_wave_info && r.data.plan_wave_info.x_axis.length > 0) {
                    var lineChartParams_1 = {
                        xtag: r.data.plan_wave_info.x_tag,
                        xaxis: r.data.plan_wave_info.x_axis,
                        dataTag: r.data.plan_wave_info.data_tag,
                        datas: r.data.plan_wave_info.datas,
                    };
                    _this.set({ lineChartParams: lineChartParams_1 });
                    var possibility = _this.getComp("#possibility");
                    possibility.init();
                    var lineChart = _this.getComp("#lineChart");
                    lineChart.init();
                    var c = _this.getComp("#chooseMajor");
                    c.toHide();
                }
            }
        });
    };
    _possibility.prototype.onInit = function (e) {
        for (var key in e) {
            e[key] = /^\d+$/g.test(e[key]) ? Number(e[key]) : e[key];
        }
        this.set({ searchData: e });
        this.getInfo();
    };
    return _possibility;
}(util_1.BasePage));
Page(new _possibility());
