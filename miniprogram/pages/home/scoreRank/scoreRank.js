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
var _scoreRank = (function (_super) {
    __extends(_scoreRank, _super);
    function _scoreRank() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.data = {
            info: null,
            subjects: [],
            subIndex: 0,
            userRank: null,
        };
        return _this;
    }
    _scoreRank.prototype.changeSub = function (e) {
        var i = e.detail || 0;
        this.set({ subIndex: i });
        var sub_id = this.data.info.subject_list[i].v;
        this.getInfo(sub_id);
    };
    _scoreRank.prototype.getInfo = function (sub_id) {
        var _this = this;
        var data = {};
        if (sub_id) {
            data.sub_id = sub_id;
        }
        util_1.getData("/data_service/v1/allow/province/score_rank", {
            data: data,
            success: function (r) {
                if (!sub_id) {
                    wx.setNavigationBarTitle({
                        title: r.data.province_name + r.data.year + '年一分一段表'
                    });
                    var subs_1 = [], index_1 = 0;
                    r.data.subject_list.map(function (sub, i) {
                        subs_1.push(sub.k);
                        if (sub.v == r.data.sub_id) {
                            index_1 = i;
                        }
                    });
                    _this.set({ subjects: subs_1 });
                    _this.set({ subIndex: index_1 });
                }
                _this.set({ info: r.data });
                setTimeout(function () {
                    _this.set({ userRank: "scrollIntoView" });
                }, 10);
            }
        });
    };
    _scoreRank.prototype.onInit = function () {
        this.getInfo();
    };
    return _scoreRank;
}(util_1.BasePage));
Page(new _scoreRank());
