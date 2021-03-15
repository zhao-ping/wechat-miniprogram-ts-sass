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
var historyMajor = new Set(), historySchool = new Set();
var _search = (function (_super) {
    __extends(_search, _super);
    function _search() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.data = {
            searchStr: "",
            tabIndex: 0,
            historyMajor: historyMajor,
            historySchool: historySchool,
            collectionSchool: null,
            collectionMajor: null,
            list: null,
            listPage: {
                page: 0,
                page_count: 1,
            },
        };
        return _this;
    }
    _search.prototype.changeTab = function (e) {
        var tabIndex = e.detail;
        this.set({ tabIndex: tabIndex });
        this.set({ list: null });
        this.set({ listPage: { page: 1, page_count: 1 } });
        this.set({ searchStr: "" });
        if (tabIndex == 0 && !this.data.collectionSchool) {
            this.getSchoolCollection();
        }
        else if (tabIndex == 1 && !this.data.collectionMajor) {
            this.getMajorCollection();
        }
    };
    _search.prototype.getSchoolCollection = function () {
        var _this = this;
        util_1.getData("/user_service/v1/auth/attention/school/page", {
            success: function (r) {
                _this.set({ collectionSchool: r.data });
            },
        });
    };
    _search.prototype.getMajorCollection = function () {
        var _this = this;
        util_1.getData("/user_service/v1/auth/attention/major/page", {
            success: function (r) {
                _this.set({ collectionMajor: r.data });
            },
        });
    };
    _search.prototype.addHistory = function (e) {
        this.set({ searchStr: this.getElDataSet(e).item });
        this.reGetList();
    };
    _search.prototype.removeHistory = function () {
        if (this.data.tabIndex == 0) {
            this.set({ historySchool: [] });
            wx.removeStorage({ key: "historySchool" });
        }
        else {
            this.set({ historyMajor: [] });
            wx.removeStorage({ key: "historyMajor" });
        }
    };
    _search.prototype.reGetList = function () {
        if (this.data.tabIndex == 0) {
            var history_1 = new Set(__spread([this.data.searchStr], this.data.historySchool));
            this.set({ historySchool: __spread(history_1) });
            wx.setStorage({
                key: "historySchool",
                data: this.data.historySchool,
            });
        }
        else {
            var history_2 = new Set(__spread([this.data.searchStr], this.data.historyMajor));
            this.set({ historyMajor: __spread(history_2) });
            wx.setStorage({
                key: "historyMajor",
                data: this.data.historyMajor,
            });
        }
        this.set({ list: null });
        this.set({ listPage: { page: 0, page_count: 1 } });
        this.getList();
    };
    _search.prototype.getList = function () {
        var _this = this;
        if (this.data.listPage.page >= this.data.listPage.page_count)
            return;
        var url = this.data.tabIndex == 0
            ? "/static_service/v1/allow/school/page"
            : "/static_service/v1/allow/major/search";
        var data = {
            page: this.data.listPage.page + 1,
            limit: 20,
            school_name: this.data.searchStr,
            major_name: this.data.searchStr,
        };
        util_1.getData(url, {
            data: data,
            success: function (r) {
                if (r.pager.page == 1) {
                    _this.set({ list: r.data });
                }
                else {
                    console.log(r);
                    _this.set({ list: __spread(_this.data.list, r.data) });
                }
                _this.set({ listPage: r.pager });
            },
        });
    };
    _search.prototype.onInit = function (e) {
        var tabIndex = e.tabIndex || 0;
        this.set({ tabIndex: tabIndex });
        if (this.data.tabIndex == 0) {
            this.getSchoolCollection();
        }
        else {
            this.getMajorCollection();
        }
        this.set({ historyMajor: wx.getStorageSync("historyMajor") || [] });
        this.set({ historySchool: wx.getStorageSync("historySchool") || [] });
    };
    return _search;
}(util_1.BasePage));
Page(new _search());
