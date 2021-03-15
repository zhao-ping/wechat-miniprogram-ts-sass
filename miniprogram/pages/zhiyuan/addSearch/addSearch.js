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
var addSchool_base_1 = require("../addSchool.base");
var _addSearch = (function (_super) {
    __extends(_addSearch, _super);
    function _addSearch(listApi, type) {
        var _this = _super.call(this, listApi, type) || this;
        _this.data = __assign(__assign({}, _this.data), { school_name: "" });
        return _this;
    }
    _addSearch.prototype.reserch = function () {
        this.data.listPage = {
            page: 0,
            page_count: 1,
        };
        this.set({ list: null });
        this.getList();
    };
    _addSearch.prototype.onInit = function (e) {
        this.set({ uca_id: e.uca_id ? Number(e.uca_id) : 0 });
        this.set({ sort_index: e.sort_index ? Number(e.sort_index) : 0 });
    };
    return _addSearch;
}(addSchool_base_1.AddSchoolBase));
Page(new _addSearch("/data_service/v1/auth/application/school/search_list", 2));
