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
var _newSubject = (function (_super) {
    __extends(_newSubject, _super);
    function _newSubject() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.data = {
            info: null,
        };
        return _this;
    }
    _newSubject.prototype.getInfo = function () {
        var _this = this;
        util_1.getData("/data_service/v1/auth/choose_subject/can_choose/index", {
            data: { type_id: 2 },
            success: function (r) {
                wx.setStorage({
                    key: "newSubjectBaseInfo",
                    data: r.data,
                });
                _this.set({ info: r.data });
            }
        });
    };
    _newSubject.prototype.onLoad = function () {
        this.getInfo();
    };
    return _newSubject;
}(util_1.BasePage));
Page(new _newSubject());
