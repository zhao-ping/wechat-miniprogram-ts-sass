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
var _setSchool = (function (_super) {
    __extends(_setSchool, _super);
    function _setSchool() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.data = {
            school_name: "",
            search: [],
            history: [],
        };
        return _this;
    }
    _setSchool.prototype.setSchool = function (e) {
        var dataset = e.currentTarget.dataset;
        var school = dataset.school;
        if (school.describe) {
            util_1.toast(school.describe);
            return;
        }
        util_1.getData("/data_service/v1/auth/grade/target/add", {
            method: "POST",
            data: school,
            success: function (r) {
                util_1.event.push("setNewTargetSchool");
                wx.navigateBack();
            }
        });
    };
    _setSchool.prototype.getHistory = function () {
        var _this = this;
        util_1.getData("/data_service/v1/auth/grade/target/before", {
            success: function (r) {
                _this.set({ history: r.data });
            }
        });
    };
    _setSchool.prototype.toSearch = function () {
        var _this = this;
        util_1.getData("/data_service/v1/auth/grade/target/search", {
            data: { school_name: this.data.school_name, limit: 50, },
            success: function (r) {
                _this.set({ search: r.data });
            }
        });
    };
    _setSchool.prototype.onInit = function () {
        this.getHistory();
    };
    return _setSchool;
}(util_1.BasePage));
Page(new _setSchool());
