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
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../../../utilTs/util");
var info, search;
var _majors = (function (_super) {
    __extends(_majors, _super);
    function _majors() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.data = {
            info: info,
            search: search,
        };
        return _this;
    }
    _majors.prototype.getInfo = function () {
        var _this = this;
        util_1.getData("/data_service/v1/auth/choose_subject/can_choose/major_list", {
            data: __assign(__assign({}, this.data.search), { limit: 500 }),
            success: function (r) {
                _this.set({ info: r.data });
            }
        });
    };
    _majors.prototype.onInit = function (e) {
        this.set({ search: e });
        this.getInfo();
    };
    return _majors;
}(util_1.BasePage));
Page(new _majors());
