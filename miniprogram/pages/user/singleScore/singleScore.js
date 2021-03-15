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
var _singleScore = (function (_super) {
    __extends(_singleScore, _super);
    function _singleScore() {
        var _this = _super.call(this) || this;
        _this.data = __assign(__assign({}, _this.data), { info: null });
        return _this;
    }
    _singleScore.prototype.submit = function () {
        var _this = this;
        util_1.getData("/user_service/v1/auth/score_nature/single_score", {
            method: "POST",
            data: this.data.info.score_info,
            success: function (r) {
                _this.toast("设置成功");
                util_1.event.push("updateScoreNature");
                setTimeout(function () {
                    wx.navigateBack();
                }, 1000);
            }
        });
    };
    _singleScore.prototype.change = function (e) {
        var dataset = e.currentTarget.dataset;
        this.data.info.score_info[dataset.index].score = e.detail ? Number(e.detail) : null;
        this.set({ info: this.data.info });
    };
    _singleScore.prototype.getInfo = function () {
        var _this = this;
        util_1.getData("/user_service/v1/auth/score_nature/single_score", {
            success: function (r) {
                r.data.score_info.map(function (item) {
                    item.score = item.score ? item.score : null;
                });
                _this.set({ info: r.data });
            }
        });
    };
    _singleScore.prototype.onInit = function () {
        this.getInfo();
    };
    return _singleScore;
}(util_1.GlobalUserInfoPage));
Page(new _singleScore());
