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
        var _this = _super.call(this) || this;
        _this.data = __assign(__assign({}, _this.data), { scrollTop: 0, searchList: null, list: null, listPage: {
                page: 0
            }, filter: {
                count: 0,
                filters: {}
            }, province: null, scrollLeft: 0 });
        return _this;
    }
    _schools.prototype.changeProvince = function (e) {
        var dataset = e.target.dataset;
        this.data.filter.filters.prov_id = dataset.item.v;
        this.data.province.default_value = dataset.item;
        this.data.province.default_index = dataset.index;
        this.set({ province: this.data.province });
        this.data.listPage.page = 0;
        this.getList();
        var c = this.getComp("schoolFilter");
        c.setFilter("prov_id", dataset.index);
    };
    _schools.prototype.showFilter = function () {
        var c = this.getComp("schoolFilter");
        c.toShow();
    };
    _schools.prototype.getSearch = function () {
        var _this = this;
        util_1.getData("/static_service/v1/allow/school/page/search", {
            success: function (r) {
                _this.set({ searchList: r.data });
                var i = r.data.search_list.findIndex(function (f) { return f.key == "prov_id"; });
                if (i != -1) {
                    _this.set({ province: r.data.search_list[i] });
                }
            }
        });
    };
    _schools.prototype.provinceScroll = function () {
        if (this.data.province) {
            var width = util_1.transformPx(42);
            var offset = util_1.transformPx(100);
            this.set({ scrollLeft: this.data.province.default_index * (width + 2) - offset });
        }
    };
    _schools.prototype.getList = function (option) {
        var _this = this;
        var _a, _b;
        var filter;
        if ((_a = option === null || option === void 0 ? void 0 : option.detail) === null || _a === void 0 ? void 0 : _a.filters) {
            filter = option.detail;
            this.set({ filter: filter });
            this.data.listPage.page = 0;
            var provInedex = this.data.province.values.findIndex(function (prov) { return prov.v == filter.filters.prov_id; });
            if (provInedex != -1) {
                this.data.province.default_index = provInedex;
                this.data.province.default_value = this.data.province.values[provInedex];
                this.set({ province: this.data.province });
            }
        }
        var data = {
            page: ((_b = this.data.listPage) === null || _b === void 0 ? void 0 : _b.page) + 1,
        };
        data = __assign(__assign({}, data), this.data.filter.filters);
        util_1.getData("/static_service/v1/allow/school/page", {
            data: data,
            success: function (r) {
                if (r.pager.page == 1) {
                    _this.set({ list: r.data });
                }
                else {
                    _this.set({ list: __spread(_this.data.list || [], r.data) });
                }
                _this.set({ listPage: r.pager });
                if (r.pager.page == 1) {
                    _this.set({ scrollTop: 0 });
                }
            }
        });
    };
    _schools.prototype.onShow = function () {
        this.getSearch();
        this.getList();
    };
    _schools.prototype.onReachBottom = function () {
        this.getList();
    };
    return _schools;
}(util_1.GlobalUserInfoPage));
Page(new _schools());
