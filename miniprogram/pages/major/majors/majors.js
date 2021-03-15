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
var options;
var _majors = (function (_super) {
    __extends(_majors, _super);
    function _majors() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.data = {
            options: options,
            lv1: 0,
            lv2: 0,
            info: null,
            tabItems: null,
            tabIndex: 0,
            scrollViewHeight: 0,
        };
        return _this;
    }
    _majors.prototype.changeRootMajor = function (e) {
        this.set({ lv1: e.currentTarget.dataset.index });
        this.set({ lv2: 0 });
    };
    _majors.prototype.changeSecMajor = function (e) {
        var index = e.currentTarget.dataset.index;
        if (this.data.lv2 == index) {
            this.set({ lv2: null });
        }
        else {
            this.set({ lv2: index });
        }
    };
    _majors.prototype.setScrollContainner = function () {
        var _this = this;
        var topContainer = wx.createSelectorQuery();
        topContainer.select("#topContainer").boundingClientRect(function (r) {
            var syst = wx.getSystemInfoSync();
            _this.set({ scrollViewHeight: syst.windowHeight - r.height });
        }).exec();
    };
    _majors.prototype.changeTab = function (e) {
        this.set({ tabIndex: e.detail });
        this.set({ lv1: 0 });
        this.set({ lv2: 0 });
    };
    _majors.prototype.getInfo = function () {
        var _this = this;
        util_1.getData("/static_service/v1/allow/major/all_major", {
            success: function (r) {
                var items = [];
                r.data.map(function (item) {
                    items.push(item.type_name);
                });
                if (_this.data.options) {
                    r.data[_this.data.tabIndex].root_major_list.map(function (root, index) {
                        if (root.major_id == _this.data.options.root_major_id) {
                            setTimeout(function () {
                                _this.set({ lv1: index });
                            }, 0);
                            root.sec_major_list.map(function (sec, i) {
                                if (sec.major_id == _this.data.options.major_id) {
                                    setTimeout(function () {
                                        _this.set({ lv2: i });
                                    }, 0);
                                }
                            });
                        }
                    });
                }
                _this.set({ tabItems: items });
                _this.set({ info: r.data });
                _this.setScrollContainner();
            }
        });
    };
    _majors.prototype.onInit = function (e) {
        this.set({ options: e });
        this.set({ tabIndex: this.data.options.major_type == 2 ? 1 : 0 });
        this.getInfo();
    };
    return _majors;
}(util_1.BasePage));
Page(new _majors());
