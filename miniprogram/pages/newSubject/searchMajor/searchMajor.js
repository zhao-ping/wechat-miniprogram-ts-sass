"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../../../utilTs/util");
var history = wx.getStorageSync("searchNewSubjectMajor");
Page({
    data: {
        info: null,
        major_name: "",
        search: [],
        history: [],
    },
    setMajorName: function (e) {
        var dataset = e.currentTarget.dataset;
        this.setData({ major_name: dataset.major });
        this.toSearch();
    },
    source: function () {
        util_1.toast(this.data.info.data_source, 5000);
    },
    change: function () {
        if (!this.data.major_name) {
            this.setData({ search: [] });
        }
    },
    clearHistory: function () {
        this.setData({ history: [] });
        wx.removeStorageSync('searchNewSubjectMajor');
    },
    chooseSchool: function (e) {
        var dataset = e.currentTarget.dataset;
        var item = dataset.item;
        var newHistory = util_1.refreshHistory(this.data.history, item, "major_id");
        this.setData({ history: newHistory });
        wx.setStorageSync("searchNewSubjectMajor", newHistory);
        wx.navigateTo({ url: "/pages/newSubject/schools/schools?major_id=" + item.major_id + "&admit_order_type=" + item.admit_order_type });
    },
    toSearch: function () {
        var _this = this;
        util_1.getData("/data_service/v1/auth/choose_subject/can_choose/search/major", {
            data: { major_name: this.data.major_name, limit: 50, },
            success: function (r) {
                _this.setData({ search: r.data });
                if (r.data.length == 0) {
                    util_1.toast(_this.data.info.tips);
                }
            }
        });
    },
    onLoad: function () {
        var _this = this;
        wx.getStorage({
            key: "newSubjectBaseInfo",
            success: function (r) {
                _this.setData({ info: r.data });
            }
        });
        if (history) {
            this.setData({ history: history });
        }
    }
});
