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
        search: null,
        info: null,
        items: null,
        tabIndex: 0,
        list: [],
        listPage: [],
    },
    changeTab: function (e) {
        this.setData({ tabIndex: e.detail });
        if (!this.data.list[e.detail]) {
            this.getList();
        }
    },
    getInfo: function () {
        var _this = this;
        util_1.getData("/data_service/v1/auth/choose_subject/can_choose/search/school_info", {
            data: this.data.search,
            success: function (r) {
                r.data.values.map(function (item) {
                    _this.data.listPage.push({
                        page: 0,
                        page_count: 1,
                    });
                });
                _this.setData({ info: r.data });
                _this.getList();
            }
        });
    },
    getList: function () {
        var _this = this;
        var i = this.data.tabIndex;
        if (this.data.listPage[i].page >= this.data.listPage[i].page_count) {
            return;
        }
        var data = __assign(__assign({}, this.data.search), { mode: 1, search_type: this.data.info.values[this.data.tabIndex].v, limit: 20, page: this.data.listPage[i].page + 1 });
        util_1.getData("/data_service/v1/auth/choose_subject/can_choose/search/school/major_list", {
            data: data,
            success: function (r) {
                _this.data.list[i] = __spread(_this.data.list[i] || [], r.data);
                _this.setData({ list: _this.data.list });
                _this.data.listPage[i] = r.pager;
                _this.setData({ listPage: _this.data.listPage });
            }
        });
    },
    onLoad: function (e) {
        this.setData({ search: e });
        this.getInfo();
    }
});
