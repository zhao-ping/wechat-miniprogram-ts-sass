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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../../../utilTs/util");
var _schools = (function (_super) {
    __extends(_schools, _super);
    function _schools() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.data = {
            major_id: null,
            search: null,
            info: null,
            list: null,
            listPage: {
                page: 0
            },
            filter: {
                count: 0,
                filters: {}
            },
        };
        return _this;
    }
    _schools.prototype.showFilter = function () {
        var c = this.getComp("#schoolFilter");
        c.toShow();
    };
    _schools.prototype.getSearch = function (major_id) {
        var _this = this;
        util_1.getData("/static_service/v1/allow/major/setting_school/search", {
            data: { major_id: major_id },
            success: function (r) {
                _this.set({ search: r.data.search_list });
            }
        });
    };
    _schools.prototype.getList = function (option) {
        var _this = this;
        var _a, _b;
        var filter;
        if ((_a = option === null || option === void 0 ? void 0 : option.detail) === null || _a === void 0 ? void 0 : _a.filters) {
            filter = option.detail;
            this.set({ filter: filter });
            this.data.listPage.page = 0;
            this.data.search.map(function (item) {
                item.default_value = filter.default_values[item.key];
            });
            this.set({ search: this.data.search });
        }
        var data = {
            page: ((_b = this.data.listPage) === null || _b === void 0 ? void 0 : _b.page) + 1,
        };
        data = __assign(__assign({}, data), this.data.filter.filters);
        util_1.getData("/static_service/v1/allow/major/" + this.data.major_id + "/setting_school", {
            data: data,
            success: function (r) {
                if (_this.data.listPage.page == 0) {
                    _this.set({ list: r.data.school_list });
                    _this.set({ info: { major_info: r.data.major_info } });
                }
                else {
                    _this.set({ list: __spread(_this.data.list || [], r.data.school_list) });
                }
                _this.set({ listPage: r.pager });
            }
        });
    };
    _schools.prototype.onInit = function (e) {
        this.set({ major_id: e.major_id });
        this.getSearch(e.major_id);
        this.getList();
    };
    return _schools;
}(util_1.BasePage));
Page(new _schools());
