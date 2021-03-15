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
        search_list: null,
        currentRank: null,
        rank_all_type: null,
        filter: null,
        topContainerHeight: null,
        scrollBoxHeight: null,
        scrollTop: 0,
        stickys: [],
        list: [],
        listPage: {
            page: 0,
            page_count: 1,
        }
    },
    showFilter: function () {
        var c = this.selectComponent("#filter");
        c.toShow();
    },
    changeRankType: function (e) {
        var dataset = e.currentTarget.dataset;
        this.setData({ filter: null });
        this.setData({ currentRank: dataset.item });
        this.setData({ listPage: { page: 0, page_count: 1 } });
        this.getList();
        this.getRankTypes();
        this.setData({ scrollTop: 0 });
    },
    setScrollBoxHeight: function () {
        var _this = this;
        var topContainer = wx.createSelectorQuery();
        topContainer.select("#topContianer").boundingClientRect(function (r) {
            _this.setData({ topContainerHeight: r.height });
            _this.setData({ scrollBoxHeight: wx.getSystemInfoSync().windowHeight - r.height });
        }).exec();
    },
    getRankTypes: function () {
        var _this = this;
        util_1.getData("/static_service/v1/allow/school/rank/search", {
            data: { type_id: this.data.currentRank.type_id },
            success: function (r) {
                _this.setData({ search_list: r.data.search_list });
                _this.setData({ currentRank: r.data.rank_form_info });
                _this.setData({ rank_all_type: r.data.rank_all_type });
                var c = _this.selectComponent("#filter");
                c.initFilters();
                _this.setScrollBoxHeight();
            }
        });
    },
    getList: function (filter) {
        var _this = this;
        console.log(filter);
        if (filter && filter.detail.filters) {
            this.setData({
                listPage: { page: 0, page_count: 1 }
            });
            this.setData({ filter: filter.detail });
        }
        else {
            if (this.data.listPage.page >= this.data.listPage.page_count) {
                return;
            }
        }
        var data = {
            page: this.data.listPage.page + 1,
            type_id: this.data.currentRank.type_id,
            limit: 20,
        };
        if (this.data.filter) {
            data = __assign(__assign({}, data), this.data.filter.filters);
        }
        util_1.getData("/static_service/v1/allow/school/rank/data_list", {
            data: data,
            success: function (r) {
                _this.setData({ listPage: r.pager });
                if (r.pager.page == 1) {
                    _this.setData({ list: r.data });
                }
                else {
                    _this.setData({ list: __spread(_this.data.list, r.data) });
                }
                var stickys = [];
                var elStickys = wx.createSelectorQuery();
                elStickys.selectAll(".sticky").boundingClientRect(function (r) {
                    r.map(function (item, i) {
                        stickys.push({ height: item.height, isSticky: false });
                    });
                    _this.setData({ stickys: stickys });
                }).exec();
            }
        });
    },
    onScroll: function () {
        var _this = this;
        var elStickys = wx.createSelectorQuery();
        elStickys.selectAll(".stickyContianer").boundingClientRect(function (r) {
            r.map(function (item, i) {
                _this.data.stickys[i].isSticky = item.top - _this.data.topContainerHeight <= 0;
            });
            _this.setData({ stickys: _this.data.stickys });
        }).exec();
    },
    onLoad: function (e) {
        this.setData({ currentRank: { type_id: e.type_id || 0 } });
        this.getRankTypes();
        this.getList();
    }
});
