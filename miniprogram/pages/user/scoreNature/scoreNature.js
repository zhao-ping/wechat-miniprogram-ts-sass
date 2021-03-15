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
var _scoreNature = (function (_super) {
    __extends(_scoreNature, _super);
    function _scoreNature() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.data = {
            info: null,
        };
        return _this;
    }
    _scoreNature.prototype.getInfo = function () {
        var _this = this;
        util_1.getData("/user_service/v1/auth/score_nature/total_info", {
            success: function (r) {
                _this.set({ info: r.data });
            }
        });
    };
    _scoreNature.prototype.onInit = function () {
        util_1.event.on(this, "updateScoreNature", this.getInfo);
        this.getInfo();
    };
    return _scoreNature;
}(util_1.BasePage));
Page(new _scoreNature());
