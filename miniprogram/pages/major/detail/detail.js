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
var _detail = (function (_super) {
    __extends(_detail, _super);
    function _detail() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.data = {
            info: null,
        };
        return _this;
    }
    _detail.prototype.getInfo = function (major_id) {
        var _this = this;
        util_1.getData("/static_service/v1/allow/major/" + major_id + "/detail", {
            success: function (r) {
                _this.set({ info: r.data });
            }
        });
    };
    _detail.prototype.onInit = function (e) {
        this.getInfo(e.major_id);
    };
    return _detail;
}(util_1.BasePage));
Page(new _detail());
