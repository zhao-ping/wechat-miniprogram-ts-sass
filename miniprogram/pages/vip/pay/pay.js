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
var payInfo, info, wechatInfo;
var _pay = (function (_super) {
    __extends(_pay, _super);
    function _pay() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.data = {
            wechatInfo: wechatInfo,
            payInfo: payInfo,
            info: info,
        };
        return _this;
    }
    _pay.prototype.checkGood = function (e) {
        var index = this.getElDataSet(e).index;
        if (!this.data.info.goods_list[index].is_enable) {
            util_1.toast(this.data.info.goods_list[index].tip);
            return;
        }
        this.data.info.goods_list.map(function (item) {
            item.is_default = false;
        });
        this.data.info.goods_list[index].is_default = true;
        this.set({ info: this.data.info });
    };
    _pay.prototype.getInfo = function () {
        var _this = this;
        util_1.getData("/user_service/v1/auth/goods/list", {
            success: function (r) {
                _this.set({ info: r.data });
            },
        });
    };
    _pay.prototype.showPay = function () {
        var _this = this;
        wx.showLoading({ title: "加载中，请稍后。。。" });
        var goods_id = this.data.info.goods_list.find(function (item) { return item.is_default; }).goods_id;
        util_1.getData("/user_service/v1/auth/goods/pay_info", {
            data: { goods_id: goods_id },
            success: function (r) {
                _this.set({ payInfo: r.data });
                wx.hideLoading();
                var c = _this.getComp("#payInfo");
                c.toShow();
            },
        });
    };
    _pay.prototype.order = function () {
        var _this = this;
        wx.login({
            success: function (r) {
                var goods_id = _this.data.info.goods_list.find(function (item) { return item.is_default; }).goods_id;
                var data = {
                    goods_id: goods_id,
                    code: r.code,
                    user_id: _this.data.info.user_info.user_id,
                    content: "{\"gk_year\":" + new Date().getFullYear() + ",\"prov_id\":" + _this.data.info.user_info.prov_id + "}",
                };
                util_1.getData("/user_service/v1/pay/wx/applet", {
                    method: "POST",
                    data: data,
                    success: function (r) {
                        wx.requestPayment({
                            timeStamp: r.data.timeStamp,
                            nonceStr: r.data.nonceStr,
                            package: r.data.package,
                            signType: r.data.signType,
                            paySign: r.data.paySign,
                            success: function (res) {
                                wx.navigateTo({ url: "/pages/vip/payResult/payResult?out_trade_no=" + r.data.out_trade_no + "&payResult=true" });
                            },
                            fail: function (res) {
                                if (res.errMsg.indexOf('cancel')) {
                                    util_1.toast("您取消了支付！");
                                }
                                else {
                                }
                                wx.navigateTo({ url: "/pages/vip/payResult/payResult?out_trade_no=" + r.data.out_trade_no + "&payResult=false" });
                            }
                        });
                    },
                });
            }
        });
    };
    _pay.prototype.onInit = function () {
        var _this = this;
        wx.getUserInfo({
            success: function (r) {
                _this.set({ wechatInfo: r });
            },
        });
        this.getInfo();
    };
    return _pay;
}(util_1.BasePage));
Page(new _pay());
