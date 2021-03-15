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
var info;
var _major = (function (_super) {
    __extends(_major, _super);
    function _major() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.data = {
            info: info,
        };
        return _this;
    }
    _major.prototype.attentMajor = function () {
        var _this = this;
        util_1.getData("/user_service/v1/auth/attention/major/" + this.data.info.major_info.major_id, {
            method: this.data.info.major_info.is_attention ? 'DELETE' : 'POST',
            success: function (r) {
                _this.data.info.major_info.is_attention = !_this.data.info.major_info.is_attention;
                _this.set({ info: _this.data.info });
            }
        });
    };
    _major.prototype.getInfo = function (major_id) {
        var _this = this;
        util_1.getData("/static_service/v1/allow/major/info?major_id=" + major_id, {
            success: function (r) {
                _this.set({ info: r.data });
            }
        });
    };
    _major.prototype.onInit = function (e) {
        this.getInfo(e.major_id);
    };
    return _major;
}(util_1.BasePage));
Page(new _major());
