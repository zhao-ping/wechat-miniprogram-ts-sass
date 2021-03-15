"use strict";
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
Page({
    data: {
        options: null,
        info: null,
        items: null,
        tabIndex: 0,
        filter: null,
        scrollTop: 0,
        list: null,
        listPage: {
            page: 0,
            page_count: 1,
        },
    },
    showFilter: function () {
        var c = this.selectComponent("#schoolFilter");
        c.toShow();
    },
    changeTab: function (e) {
        this.setData({ tabIndex: e.detail });
        this.data.listPage.page = 0;
        this.getList();
    },
    changeProv: function (e) {
        var index = e.detail.value;
        this.data.info.search_list[0].default_value = this.data.info.search_list[0].values[index];
        this.setData({ info: this.data.info });
        this.data.listPage.page = 0;
        this.getList();
    },
    getSearch: function () {
        var _this = this;
        util_1.getData("/data_service/v1/auth/choose_subject/can_choose/school_search", {
            data: __assign(__assign({}, this.data.options), { type_id: 1 }),
            success: function (r) {
                wx.setNavigationBarTitle({ title: r.data.base_info.major_name });
                var items = r.data.values.map(function (item) { return item.k; });
                _this.setData({ items: items });
                _this.setData({ info: r.data });
            },
        });
    },
    getList: function (e) {
        var _this = this;
        var data = __assign(__assign({}, this.data.options), { limit: 20 });
        if (this.data.info) {
            data.type_id = this.data.info.values[this.data.tabIndex].v;
            data.prov_id = this.data.info.search_list[0].default_value.v;
        }
        if (e && e.detail.filters) {
            this.data.listPage.page = 0;
            this.setData({ filter: e.detail });
        }
        if (this.data.filter) {
            data = __assign(__assign({}, data), this.data.filter.filters);
        }
        data.page = this.data.listPage.page + 1;
        util_1.getData("/data_service/v1/auth/choose_subject/can_choose/school_list", {
            data: data,
            success: function (r) {
                if (r.pager.page == 1) {
                    _this.setData({ scrollTop: 0 });
                    _this.setData({ list: r.data });
                }
                else {
                    _this.setData({ list: __spread(_this.data.list, r.data) });
                }
                _this.setData({ listPage: r.pager });
            },
        });
    },
    onLoad: function (e) {
        this.setData({ options: e });
        this.getSearch();
        this.getList();
    },
});
