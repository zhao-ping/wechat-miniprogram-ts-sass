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
var list = [];
var moreMajors;
var _scoreMajorMoreMajors = (function (_super) {
    __extends(_scoreMajorMoreMajors, _super);
    function _scoreMajorMoreMajors() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.data = {
            isZhiyuanPage: null,
            scrollView: "yourRank",
            options: { admit_order_type: null, school_id: null, index: null, subject_group_id: null, uca_id: null },
            moreMajors: moreMajors,
            list: list,
            moreMajorsChoose: [],
            popupMajor: null,
        };
        return _this;
    }
    _scoreMajorMoreMajors.prototype.chooseMajor = function (e) {
        var index = this.getElDataSet(e).index;
        this.data.list[index].is_alternative = !this.data.list[index].is_alternative;
        this.set({ list: this.data.list });
    };
    _scoreMajorMoreMajors.prototype.beixuanBatch = function () {
        var _this = this;
        var data = [];
        this.data.list.map(function (item, i) {
            if (item.is_alternative != _this.data.moreMajors.major_list[i].is_alternative) {
                data.push({
                    admit_order_type: _this.data.options.admit_order_type,
                    school_id: _this.data.options.school_id,
                    subject_group_id: _this.data.options.subject_group_id,
                    major_id: item.major_id,
                    match_id: item.match_id,
                    add_or_del: item.is_alternative ? 1 : 2,
                });
            }
        });
        if (data.length <= 0) {
            wx.navigateBack();
            return;
        }
        util_1.getData("/data_service/v1/auth/alternative/major/batch", {
            method: "POST",
            data: data,
            success: function (r) {
                util_1.event.push("batchMajor", { data: data, index: _this.data.options.index });
                wx.navigateBack();
            }
        });
    };
    _scoreMajorMoreMajors.prototype.hideMoreMajors = function (e) {
        var c = this.getComp("#moreMajors");
        c.toHide();
        this.beixuanBatch();
    };
    _scoreMajorMoreMajors.prototype.getMoreMajors = function (options) {
        var _this = this;
        var url = '';
        if (this.data.isZhiyuanPage) {
            url = "/data_service/v1/auth/application/school/major_list";
        }
        else {
            url = "/data_service/v1/auth/probability/" + options.school_id + "/major_score/can_up";
        }
        util_1.getData(url, {
            data: __assign({ limit: 500 }, options),
            success: function (r) {
                _this.set({ moreMajors: r.data });
                _this.set({ list: JSON.parse(JSON.stringify(r.data.major_list)) });
                wx.setNavigationBarTitle({ title: r.data.base_info.subject_group_name || r.data.base_info.school_name });
                _this.set({ scrollView: "major-" + (r.data.base_info.index - 1) });
            }
        });
    };
    _scoreMajorMoreMajors.prototype.getMajorInfo = function (e) {
        var _this = this;
        var c = this.getComp("#popupMajor");
        c.toShow();
        var _a = this.getElDataSet(e).item, major_id = _a.major_id, match_id = _a.match_id;
        if (this.data.popupMajor && major_id == this.data.popupMajor.major_info.major_id && major_id == this.data.popupMajor.major_info.major_id)
            return;
        util_1.getData("/data_service/v1/auth/school/" + this.data.options.school_id + "/major_score/" + major_id + "/can_up", {
            data: {
                school_id: this.data.options.school_id,
                subject_group_id: this.data.options.subject_group_id,
                major_id: major_id,
                match_id: match_id,
                admit_order_type: this.data.options.admit_order_type,
            },
            success: function (r) {
                _this.set({ popupMajor: r.data });
            }
        });
    };
    _scoreMajorMoreMajors.prototype.addORrDelMajor = function (e) {
        var _this = this;
        var index = this.getElDataSet(e).index;
        var item = this.data.list[index];
        var isAdd = !item.is_application_checked;
        util_1.getData(isAdd ? "/data_service/v1/auth/application/school/add" : "/data_service/v1/auth/application/school/del", {
            method: isAdd ? 'POST' : 'DELETE',
            data: {
                match_id: item.match_id,
                major_id: item.major_id,
                school_id: this.data.options.school_id,
                uca_id: this.data.options.uca_id,
                ucas_id: item.ucas_id,
            },
            success: function (r) {
                _this.data.list[index].is_application_checked = !_this.data.list[index].is_application_checked;
                _this.data.list[index].ucas_id = r.data.application_school_list[r.data.application_school_list.length - 1].ucas_id;
                _this.set({ list: _this.data.list });
            }
        });
    };
    _scoreMajorMoreMajors.prototype.onInit = function (e) {
        this.set({ isZhiyuanPage: e.isZhiyuanPage == "true" ? true : false });
        for (var key in e) {
            e[key] = /^\d+$/g.test(e[key]) ? Number(e[key]) : e[key];
        }
        this.set({ options: e });
        this.getMoreMajors(this.data.options);
    };
    return _scoreMajorMoreMajors;
}(util_1.BasePage));
Page(new _scoreMajorMoreMajors());
