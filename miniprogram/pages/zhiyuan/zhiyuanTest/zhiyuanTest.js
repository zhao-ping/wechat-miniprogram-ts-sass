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
var _zhiyuanTest = (function (_super) {
    __extends(_zhiyuanTest, _super);
    function _zhiyuanTest() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.data = {
            info: null,
        };
        return _this;
    }
    _zhiyuanTest.prototype.downLoad = function () {
        wx.showLoading({ title: "\u52A0\u8F7D\u4E2D\uFF0C\u8BF7\u7A0D\u540E\u00B7\u00B7\u00B7" });
        util_1.getData("/data_service/v1/auth/application/" + this.data.info.application.uca_id + "/risk_assessment/report", {
            success: function (r) {
                wx.downloadFile({
                    url: r.data.report_url,
                    success: function (res) {
                        var filePath = res.tempFilePath;
                        wx.openDocument({
                            filePath: filePath,
                            success: function (res) {
                                wx.hideLoading();
                            },
                        });
                    },
                });
            },
        });
    };
    _zhiyuanTest.prototype.getInfo = function (id) {
        var _this = this;
        util_1.getData("/data_service/v1/auth/application/" + id + "/risk_assessment", {
            success: function (r) {
                util_1.event.push("zhiyuanTest");
                r.data.application.optimal_desc = r.data.application.optimal_desc.replace(/\d+/g, "<span class=\"bg-white display-ib p-lr-8 m-lr-8 br-16 color-orange line-h-28\">" + r.data.application.optimal_number + "</span>");
                _this.set({ info: r.data });
                wx.setNavigationBarTitle({
                    title: r.data.application.application_name,
                });
            },
        });
    };
    _zhiyuanTest.prototype.onInit = function (e) {
        this.getInfo(e.uca_id);
    };
    return _zhiyuanTest;
}(util_1.BasePage));
Page(new _zhiyuanTest());
