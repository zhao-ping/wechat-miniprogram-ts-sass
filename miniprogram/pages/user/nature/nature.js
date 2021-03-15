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
var _nature = (function (_super) {
    __extends(_nature, _super);
    function _nature() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.data = { info: info };
        return _this;
    }
    _nature.prototype.submit = function () {
        var _this = this;
        var data = [];
        this.data.info.list.map(function (item) {
            var nature = { key: item.key, value: item.value.filter(function (tem) { return tem.is_choose; }).map(function (tem) { return tem.v; }).join("|") };
            data.push(nature);
        });
        util_1.getData("/user_service/v1/auth/score_nature/nature_trait", {
            method: "POST",
            data: data,
            success: function (r) {
                _this.toast("设置成功");
                util_1.event.push("updateScoreNature");
                setTimeout(function () {
                    wx.navigateBack();
                }, 1000);
            }
        });
    };
    _nature.prototype.select = function (e) {
        if (this.data.info != null) {
            var _a = e.currentTarget.dataset, index = _a.index, i = _a.i;
            var is_single = this.data.info.list[index].is_single;
            if (is_single) {
                this.data.info.list[index].value.map(function (item) {
                    item.is_choose = false;
                });
                this.data.info.list[index].value[i].is_choose = true;
            }
            else {
                this.data.info.list[index].value[i].is_choose = !this.data.info.list[index].value[i].is_choose;
            }
            this.set({ info: this.data.info });
        }
    };
    _nature.prototype.getInfo = function () {
        var _this = this;
        util_1.getData("/user_service/v1/auth/score_nature/nature_trait", {
            success: function (r) {
                _this.set({ info: r.data });
            }
        });
    };
    _nature.prototype.onInit = function () {
        this.getInfo();
    };
    return _nature;
}(util_1.BasePage));
Page(new _nature());
