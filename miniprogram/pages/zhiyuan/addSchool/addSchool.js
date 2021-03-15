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
var addSchool_base_1 = require("../addSchool.base");
var _addSchool = (function (_super) {
    __extends(_addSchool, _super);
    function _addSchool(listApi, type) {
        var _this = _super.call(this, listApi, type) || this;
        _this.listApi = listApi;
        _this.type = type;
        _this.data = __assign(__assign({}, _this.data), { sort_index: null, tabIndex: 0, beixuanFirst: true, scrollTop: 0, sorts: [null, null], sortValue: null, isShowSorts: false });
        return _this;
    }
    _addSchool.prototype.changeSort = function (e) {
        var _a = this.getElDataSet(e), item = _a.item, index = _a.index;
        this.data.sorts[this.data.tabIndex].default_value = item;
        this.data.sorts[this.data.tabIndex].default_index = index;
        this.set({ sorts: this.data.sorts });
        this.data.list = null,
            this.data.listPage = { page: 0, page_count: 1 };
        this.getList();
        this.set({ isShowSorts: false });
    };
    _addSchool.prototype.showSorts = function () {
        this.set({ isShowSorts: !this.data.isShowSorts });
    };
    _addSchool.prototype.changeTab = function (e) {
        if (e) {
            this.set({ tabIndex: e.detail });
        }
        if (this.data.tabIndex == 0) {
            this.listApi = "/data_service/v1/auth/alternative/school/list";
        }
        else {
            this.listApi = "/data_service/v1/auth/probability/can_up/vip_list";
        }
        this.data.list = null,
            this.data.listPage = { page: 0, page_count: 1 };
        this.getSort();
        this.getList();
    };
    _addSchool.prototype.getSort = function () {
        var _this = this;
        if (this.data.globalUserInfo.prov_model_ex == 3)
            return;
        if (!this.data.sorts[this.data.tabIndex]) {
            util_1.getData("/data_service/v1/auth/alternative/application/search", {
                data: { search_tag: this.data.tabIndex == 0 ? 1 : 2 },
                success: function (r) {
                    _this.data.sorts[_this.data.tabIndex] = r.data.search_list[0];
                    _this.set({ sorts: _this.data.sorts });
                }
            });
        }
    };
    _addSchool.prototype.onInit = function (e) {
        this.set({ uca_id: e.uca_id ? Number(e.uca_id) : 0 });
        this.set({ sort_index: e.sort_index ? Number(e.sort_index) : 0 });
        this.getSort();
        this.getList();
    };
    return _addSchool;
}(addSchool_base_1.AddSchoolBase));
Page(new _addSchool("/data_service/v1/auth/alternative/school/list", 2));
