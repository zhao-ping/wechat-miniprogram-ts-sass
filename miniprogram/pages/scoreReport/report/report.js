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
var popupInfo_base_1 = require("../../../utilTs/popupInfo.base");
var info;
var _scoreReport = (function (_super) {
    __extends(_scoreReport, _super);
    function _scoreReport() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.data = {
            info: info,
            directiveTab: 0,
        };
        return _this;
    }
    _scoreReport.prototype.download = function () {
        wx.showLoading({ title: "\u52A0\u8F7D\u4E2D\uFF0C\u8BF7\u7A0D\u540E\u00B7\u00B7\u00B7" });
        util_1.getData("/data_service/v1/auth/grade/report/pdf", {
            success: function (r) {
                wx.downloadFile({
                    url: r.data.report_url,
                    success: function (res) {
                        var filePath = res.tempFilePath;
                        wx.openDocument({
                            filePath: filePath,
                            success: function (res) {
                                wx.hideLoading();
                            }
                        });
                    }
                });
            }
        });
    };
    _scoreReport.prototype.changeDirectiveTab = function (e) {
        var dataset = e.currentTarget.dataset;
        this.set({ directiveTab: dataset.index });
    };
    _scoreReport.prototype.getInfo = function () {
        var _this = this;
        util_1.getData("/data_service/v1/auth/grade/report", {
            success: function (r) {
                _this.set({ info: r.data });
                wx.setNavigationBarTitle({ title: _this.data.info.base_info.title });
            }
        });
    };
    _scoreReport.prototype.onInit = function () {
        var _this = this;
        this.getInfo();
        util_1.event.on(this, ['setNewTargetSchool', 'updateScoreNature'], function () {
            _this.getInfo();
        });
    };
    return _scoreReport;
}(popupInfo_base_1.PopupInfoBase));
Page(new _scoreReport('', 0));
