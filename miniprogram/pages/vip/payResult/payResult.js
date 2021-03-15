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
var _payResult = (function (_super) {
    __extends(_payResult, _super);
    function _payResult() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.data = {
            payResult: null,
            info: null,
            failMsg: null,
        };
        return _this;
    }
    _payResult.prototype.getInfo = function (out_trade_no) {
        var _this = this;
        util_1.getData("/user_service/v1/pay/wx/query", {
            method: "POST",
            data: { out_trade_no: out_trade_no },
            success: function (r) {
                _this.set({ info: r.data });
            },
            fail: function (msg) {
                _this.set({ failMsg: msg });
            }
        });
    };
    _payResult.prototype.back = function () {
        wx.navigateBack();
    };
    _payResult.prototype.updateUserInfo = function () {
        util_1.event.push("updateUserInfo");
        wx.switchTab({ url: '/pages/user/user/user' });
    };
    _payResult.prototype.onInit = function (e) {
        var out_trade_no = e.out_trade_no, payResult = e.payResult;
        this.set({ payResult: payResult });
        this.getInfo(out_trade_no);
    };
    return _payResult;
}(util_1.BasePage));
Page(new _payResult());
