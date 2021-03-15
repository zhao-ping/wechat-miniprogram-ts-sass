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
var _suxueTypes = (function (_super) {
    __extends(_suxueTypes, _super);
    function _suxueTypes() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.data = {
            classId: null,
            currentType: { k: null, v: null },
            types: null,
            rank_all_type: null,
            scrollTop: 0,
            stickys: [],
            list: null,
            listPage: {
                page: 0,
                page_count: 1,
            }
        };
        return _this;
    }
    _suxueTypes.prototype.changeType = function (e) {
        var dataset = e.currentTarget.dataset;
        this.set({ currentType: dataset.item || { k: null, v: -1 } });
        this.set({ listPage: { page: 0, page_count: 1 } });
        this.getList();
        this.set({ scrollTop: 0 });
    };
    _suxueTypes.prototype.getTypes = function (class_id) {
        var _this = this;
        util_1.getData("/static_service/v1/auth/quality_article/class", {
            success: function (r) {
                _this.set({ types: r.data });
                var current = r.data.find(function (item) { return item.v == class_id; }) || { v: -1 };
                console.log(current);
                _this.set({ currentType: current });
                _this.getList();
            }
        });
    };
    _suxueTypes.prototype.getList = function () {
        var _this = this;
        if (this.data.listPage.page >= this.data.listPage.page_count)
            return;
        var data = {
            page: this.data.listPage.page + 1,
            article_class_id: this.data.currentType.v,
        };
        util_1.getData("/static_service/v1/auth/quality_article/list", {
            data: data,
            success: function (r) {
                if (r.pager.page == 1) {
                    _this.set({ list: r.data });
                }
                else {
                    _this.data.list.list = __spread(_this.data.list.list, r.data.list);
                    _this.set({ list: _this.data.list });
                }
                _this.set({ listPage: r.pager });
            }
        });
    };
    _suxueTypes.prototype.onInit = function (e) {
        this.set({ classId: e.article_class_id });
        this.getTypes(e.article_class_id);
    };
    return _suxueTypes;
}(util_1.BasePage));
Page(new _suxueTypes());
