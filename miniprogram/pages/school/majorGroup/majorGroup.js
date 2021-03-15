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
var _majorGroup = (function (_super) {
    __extends(_majorGroup, _super);
    function _majorGroup() {
        var _this = _super.call(this) || this;
        _this.data = __assign(__assign({}, _this.data), { info: null });
        return _this;
    }
    _majorGroup.prototype.toPossibility = function (e) {
        var dataset = e.currentTarget.dataset;
        var school = dataset.school;
        if (!school.subject_equal) {
            util_1.toast("您不符合选科要求！");
            return;
        }
        wx.navigateTo({
            url: "/pages/school/possiblity/possibility?school_id=" + this.data.info.school_id + "&subject_group_id=" + school.subject_group_id + "&major_id=" + school.major_id + "&match_id=" + school.match_id + "&plan_major_match_id=" + school.plan_major_match_id
        });
    };
    _majorGroup.prototype.getInfo = function (school_id) {
        var _this = this;
        util_1.getData("/data_service/v1/auth/school/enroll_evaluation/search_list/" + school_id, {
            success: function (r) {
                _this.set({ info: r.data });
            }
        });
    };
    _majorGroup.prototype.onInit = function (e) {
        this.getInfo(e.school_id);
    };
    return _majorGroup;
}(util_1.GlobalUserInfoPage));
Page(new _majorGroup());
