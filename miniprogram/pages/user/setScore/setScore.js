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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../../../utilTs/util");
var app = getApp();
var _setScore = (function (_super) {
    __extends(_setScore, _super);
    function _setScore() {
        var _this = _super.call(this) || this;
        _this.data = __assign(__assign({}, _this.data), { userInfo: null, score: null, rank: null, info: null, subjects: null, subject_id_list: null, tips: [], showComfirm: false, confirmNode: "" });
        return _this;
    }
    _setScore.prototype.getUserInfo = function () {
        util_1.getData("/user_service/v1/auth/user/info", {
            success: function (r) {
                app.globalData.user_info = __assign(__assign({}, app.globalData.user_info || {}), r.data);
            }
        });
    };
    _setScore.prototype.tapDialogButton = function (e) {
        if (e.detail.index == 0) {
            this.set({ showComfirm: false });
        }
        else {
            this.putSetUserInfo(this.data.subject_id_list);
        }
    };
    _setScore.prototype.showRank = function () {
        wx.showModal({
            title: "温馨提示",
            content: this.data.info.show_info.show_what_string,
        });
    };
    _setScore.prototype.checkSub = function (e) {
        var _a = __read(e.currentTarget.dataset.index, 2), index = _a[0], i = _a[1];
        if (this.data.subjects[index].choose_number == 1) {
            for (var j = 0; j < this.data.subjects[index].values.length; j++) {
                this.data.subjects[index].values[j].checked = j == i ? true : false;
            }
        }
        else {
            var needcheckedNum = this.data.subjects[index].choose_number, checkedNum_1 = 0;
            this.data.subjects[index].values.map(function (item) {
                if (item.checked) {
                    checkedNum_1++;
                }
            });
            if (this.data.subjects[index].values[i].checked) {
                this.data.subjects[index].values[i].checked = false;
            }
            else {
                if (needcheckedNum > checkedNum_1) {
                    this.data.subjects[index].values[i].checked = true;
                }
                else {
                    util_1.toast("\u6700\u591A\u53EA\u80FD\u9009\u62E9" + needcheckedNum + "\u9879\uFF0C\u8BF7\u53D6\u6D88\u5176\u4ED6\u79D1\u76EE\u518D\u9009\u62E9");
                }
            }
        }
        this.set({ subjects: this.data.subjects });
    };
    _setScore.prototype.getRank = function () {
        var _this = this;
        if (this.data.score < 100) {
            return;
        }
        if (this.data.isrank == 0) {
            this.set({ rank: null });
        }
        else {
            var data = { score: this.data.score };
            if (this.data.info.user_info.prov_model == 1) {
                var sub = this.data.subjects[0].values.find(function (item) { return item.checked; });
                data.sub_id = sub.v;
            }
            util_1.getData("/user_service/v1/auth/user/score_rank", {
                data: data,
                success: function (r) {
                    _this.set({ rank: r.data });
                },
            });
        }
    };
    _setScore.prototype.setUserInfo = function () {
        if (!this.data.score) {
            util_1.toast("您没有输入成绩");
            return;
        }
        var subject_id_list = [];
        this.data.subjects.map(function (subs) {
            subs.values.map(function (item) {
                if (item.checked) {
                    subject_id_list.push(item.v);
                }
            });
        });
        for (var i = 0; i < this.data.subjects.length; i++) {
            var checkedSubs = this.data.subjects[i].values.filter(function (item) { return item.checked; });
            if (checkedSubs.length < this.data.subjects[i].choose_number) {
                util_1.toast("您的选科不全！");
                return;
            }
        }
        if (subject_id_list.sort().join("") == this.data.info.user_info.subject_id &&
            this.data.info.user_info.score == this.data.score &&
            this.data.info.user_info.rank == this.data.rank) {
            util_1.toast("您没有做任何修改！");
            return;
        }
        if (this.data.info.is_modify.state == 0) {
            util_1.toast(this.data.info.warm_reminder);
            return;
        }
        var msg = "";
        if (this.data.subjects
            .filter(function (item) { return item.checked; })
            .map(function (item) { return item.v; })
            .join("") == this.data.info.user_info.subject_id) {
            msg = this.data.tips[1];
        }
        else {
            msg = this.data.tips[0];
        }
        if (msg != "") {
            if (this.data.info.show_info.show_state == 201) {
                if (this.data.info.user_info.rank) {
                    msg = "<p class=\"color-2f text-left\">\u4F60\u7684\u5206\u6570\uFF1A<b>" + this.data.score + " \u5206</b><br/>\u4F60\u7684\u4F4D\u6B21\uFF1A<b>" + this.data.rank + " \u4F4D</b><br/>" + msg + "</p>";
                }
                else {
                    msg = "<p class=\"color-2f text-left\">\u4F60\u7684\u5206\u6570\uFF1A<b>" + this.data.score + " \u5206</b><br/>" + msg + "</p>";
                }
            }
            this.set({ confirmNode: msg });
            if (subject_id_list.join("") == this.data.info.user_info.subject_id) {
                this.putSetUserInfo(subject_id_list);
                return;
            }
            this.data.subject_id_list = subject_id_list;
            this.set({ showComfirm: true });
        }
        else {
            this.putSetUserInfo(subject_id_list);
        }
    };
    _setScore.prototype.putSetUserInfo = function (subject_id_list) {
        var _this = this;
        var formData = {
            subject_id_list: subject_id_list,
            score: Number(this.data.score),
            rank: Number(this.data.rank) || null,
        };
        util_1.getData("/user_service/v1/auth/user/update_score_info", {
            method: "PUT",
            data: formData,
            success: function (r) {
                util_1.toast("修改成功");
                _this.getGlobalUserInfo(function () {
                    util_1.event.push("updateScore,updateUserInfo");
                });
                setTimeout(function () {
                    wx.navigateBack();
                }, 1500);
            }
        });
    };
    _setScore.prototype.getInfo = function () {
        var _this = this;
        util_1.getData("/user_service/v1/auth/user/update_score_info", {
            success: function (r) {
                _this.set({ score: r.data.user_info.score });
                _this.set({ rank: r.data.user_info.rank });
                var userSub = r.data.user_info.subject_id
                    .toString()
                    .split("")
                    .map(function (item) { return Number(item); });
                var subjects = r.data.sub_list.map(function (subs) {
                    var values = subs.values.map(function (item) {
                        var sub = __assign(__assign({}, item), { checked: false });
                        if (userSub.includes(item.v)) {
                            sub.checked = true;
                        }
                        return sub;
                    });
                    return __assign(__assign({}, subs), { values: values });
                });
                _this.set({ subjects: subjects });
                _this.set({ info: r.data });
                _this.data.tips.push(r.data.tip_sub);
                _this.data.tips.push(r.data.tip_modify);
            },
        });
    };
    _setScore.prototype.onLoad = function () {
        this.set({ userInfo: app.globalData.user_info });
        this.getInfo();
    };
    return _setScore;
}(util_1.GlobalUserInfoPage));
Page(new _setScore());
