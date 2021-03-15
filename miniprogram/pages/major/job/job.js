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
var _job = (function (_super) {
    __extends(_job, _super);
    function _job() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.data = {
            tab: 0,
            items: null,
            info: info,
            title_list: null,
            employment: [],
            jobIndex: 0,
        };
        return _this;
    }
    _job.prototype.changeJobIndex = function (e) {
        var dataset = e.currentTarget.dataset;
        this.set({ jobIndex: dataset.index });
        var c = this.getComp("#jobPercent");
        c.changeByIndex(dataset.index);
    };
    _job.prototype.changeTab = function (e) {
        this.set({ tab: e.detail });
        this.getInfo();
    };
    _job.prototype.getInfo = function (major_id) {
        var _this = this;
        if (this.data.employment[this.data.tab]) {
            return;
        }
        util_1.getData("/static_service/v1/allow/major/" + (major_id || this.data.info.major_info.major_id) + "/employment", {
            data: { type: this.data.tab + 1 },
            success: function (r) {
                if (!_this.data.info) {
                    _this.set({ title_list: r.data.title_list });
                    _this.set({ items: r.data.title_list.map(function (item) { return item.k; }) });
                    _this.set({ info: { major_info: r.data.major_info } });
                }
                _this.data.employment[_this.data.tab] = r.data.employment_data;
                _this.set({ employment: _this.data.employment });
            }
        });
    };
    _job.prototype.onInit = function (e) {
        this.getInfo(e.major_id);
    };
    return _job;
}(util_1.BasePage));
Page(new _job());
