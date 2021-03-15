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
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../../../utilTs/util");
var _page = (function (_super) {
    __extends(_page, _super);
    function _page() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.data = {
            tab: 0,
            tabItems: null,
            info: null,
        };
        return _this;
    }
    _page.prototype.changeTab = function (e) {
        this.set({ tab: e.detail });
    };
    _page.prototype.getInfo = function (data) {
        var _this = this;
        util_1.getData("/data_service/v1/auth/probability/" + data.school_id + "/enroll_evaluation/exceed_major_list", {
            data: data,
            success: function (r) {
                _this.set({ tabItems: ["\u8D85\u8FC7\u7684\u4E13\u4E1A " + r.data.exceed_major_list.length, "\u672A\u8D85\u8FC7\u7684\u4E13\u4E1A " + r.data.not_exceed_major_list.length] });
                _this.set({ info: r.data });
            }
        });
    };
    _page.prototype.onInit = function (e) {
        this.getInfo(e);
    };
    return _page;
}(util_1.GlobalUserInfoPage));
Page(new _page());
