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
var scoreChoose_base_1 = require("../../../utilTs/scoreChoose.base");
var util_1 = require("../../../utilTs/util");
var _possibleSchool = (function (_super) {
    __extends(_possibleSchool, _super);
    function _possibleSchool(listApi, type) {
        var _this = _super.call(this, listApi, type) || this;
        _this.listApi = listApi;
        _this.type = type;
        _this.data = __assign(__assign({}, _this.data), { showRange: false, schoolIndex: null, popupSchool: null, admitList: null, sortList: null, schoolRange: null });
        return _this;
    }
    _possibleSchool.prototype.changeSort = function (e) {
        this.data.sortList.default_value = this.data.sortList.values[e.detail.value];
        this.set({ sortList: this.data.sortList });
        var c = this.getComp("#school-filter");
        c.setFilter("sort_type", this.data.sortList.default_value);
        c.submit();
    };
    _possibleSchool.prototype.changeAdmit = function (e) {
        this.data.admitList.default_value = this.data.admitList.values[e.detail.value];
        this.set({ admitList: this.data.admitList });
        var c = this.getComp("#school-filter");
        c.setFilter("admit_order_type", this.data.admitList.default_value);
        c.submit();
    };
    _possibleSchool.prototype.changeRange = function () {
        var c = this.getComp("#school-filter");
        c.setFilter("school_range", { v: this.data.baseInfo.school_range == 1 ? 2 : 1 });
        c.submit();
    };
    _possibleSchool.prototype.getSearch = function () {
        var _this = this;
        util_1.getData("/data_service/v1/auth/probability/can_up/search", {
            success: function (r) {
                var admit = r.data.search_list.find(function (f) { return f.key == "admit_order_type"; });
                if (admit) {
                    admit.hide = true;
                }
                var sort = r.data.search_list.find(function (f) { return f.key == "sort_type"; });
                sort.hide = true;
                _this.set({ admitList: admit });
                _this.set({ sortList: sort });
                _this.set({ filterList: r.data.search_list });
            }
        });
        this.getList();
    };
    return _possibleSchool;
}(scoreChoose_base_1.ScoreChooseBase));
Page(new _possibleSchool("/data_service/v1/auth/probability/can_up/list", 1));
