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
var _articles = (function (_super) {
    __extends(_articles, _super);
    function _articles() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.data = {
            types: null,
            typesIndex: wx.getStorageSync("articleTab") || 0,
            scrollTop: 0,
            list: [],
            listPage: {
                page: 0,
                page_count: 1,
            },
        };
        return _this;
    }
    _articles.prototype.changeTab = function (e) {
        wx.setStorageSync("articleTab", e.detail || 0);
        this.data.typesIndex = e.detail || 0;
        this.data.listPage.page = 0;
        this.getList();
    };
    _articles.prototype.getType = function () {
        var _this = this;
        util_1.getData("/static_service/v1/allow/article/normal/class", {
            success: function (r) {
                _this.set({ types: r.data });
                _this.getList();
            }
        });
    };
    _articles.prototype.getList = function () {
        var _this = this;
        var _a = this.data.listPage, page = _a.page, page_count = _a.page_count;
        if (page >= page_count) {
            return;
        }
        var data = {
            article_class_id: this.data.types[this.data.typesIndex].v,
            page: this.data.listPage.page + 1,
        };
        util_1.getData("/static_service/v1/allow/article/normal/page", {
            data: data,
            success: function (r) {
                if (r.pager.page <= 1) {
                    _this.data.list = [];
                    _this.set({ scrollTop: 0 });
                }
                var list = __spread(_this.data.list, r.data);
                _this.set({ list: list });
                _this.set({ listPage: r.pager });
            }
        });
    };
    _articles.prototype.onInit = function () {
        this.getType();
    };
    return _articles;
}(util_1.BasePage));
Page(new _articles());
