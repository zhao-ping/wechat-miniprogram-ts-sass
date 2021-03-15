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
var _major = (function (_super) {
    __extends(_major, _super);
    function _major() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.data = {
            major_id: null,
            info: null,
            filter: null,
            list: null,
            listPage: {
                page: 0,
                page_count: 1,
            }
        };
        return _this;
    }
    _major.prototype.changeProv = function (e) {
        console.log(e);
    };
    _major.prototype.getSearch = function () {
        var _this = this;
        util_1.getData("/data_service/v1/auth/choose_subject/can_choose/major_search", {
            success: function (r) {
                _this.set({ info: r.data });
            }
        });
    };
    _major.prototype.getlist = function () {
        var _this = this;
        var data = {
            page: this.data.listPage.page++,
        };
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
                wx.setNavigationBarTitle({ title: r.data.base_info.major_name });
            }
        });
    };
    _major.prototype.onTabItemTap = function (e) {
        console.log(e);
    };
    return _major;
}(util_1.BasePage));
Page(new _major());
