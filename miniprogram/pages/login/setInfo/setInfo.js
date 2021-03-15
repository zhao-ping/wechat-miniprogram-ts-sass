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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../../../utilTs/util");
var provinceName = "四川";
var _setScore = (function (_super) {
    __extends(_setScore, _super);
    function _setScore() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.data = {
            province: null,
            score: null,
            rank: null,
            subjects: null,
            info: null,
        };
        return _this;
    }
    _setScore.prototype.showProvince = function () {
        var c = this.getComp("#provinceList");
        c.toShow();
        wx.setNavigationBarTitle({ title: "请选择省份" });
    };
    _setScore.prototype.setInfo = function () {
        var e_1, _a, e_2, _b;
        var data = {
            prov_id: this.data.province.prov_id,
            score: Number(this.data.score),
            rank: Number(this.data.rank),
            subject_id_list: null,
        };
        if (!this.data.province) {
            util_1.toast("请选择省份！");
            return;
        }
        var province = this.data.province;
        var subject_id_list = [];
        try {
            for (var _c = __values(province.sub_list), _d = _c.next(); !_d.done; _d = _c.next()) {
                var subs = _d.value;
                var subCount = subs.choose_number;
                var count = 0;
                try {
                    for (var _e = (e_2 = void 0, __values(subs.sub_info)), _f = _e.next(); !_f.done; _f = _e.next()) {
                        var sub = _f.value;
                        if (sub.checked) {
                            count++;
                            subject_id_list.push(sub.v);
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
                if (subCount != count) {
                    util_1.toast("您的选科不全");
                    return;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_1) throw e_1.error; }
        }
        data.subject_id_list = subject_id_list;
        if (!this.data.score) {
            util_1.toast("请填写正确的分数！");
            return;
        }
        util_1.getData("/user_service/v1/auth/user/update_base_info", {
            method: "PUT",
            data: data,
            success: function () {
                util_1.event.push("updateUserInfo");
                wx.switchTab({ url: "/pages/home/home/home" });
            }
        });
    };
    _setScore.prototype.changeProvince = function (e) {
        var dataset = e.currentTarget.dataset;
        var prov = dataset.province;
        if (prov.is_support) {
            this.setProvince(prov);
            wx.setNavigationBarTitle({ title: "圆梦志愿" });
        }
        else {
            util_1.toast("暂不支持此省份！");
        }
    };
    _setScore.prototype.changeSub = function (e) {
        var dataset = this.getElDataSet(e);
        var subsIndex = dataset.subsIndex;
        var subIndex = dataset.subIndex;
        var province = __assign({}, this.data.province);
        var subs = province.sub_list[subsIndex];
        if (subs.choose_number == 1) {
            subs.sub_info.map(function (sub) { return sub.checked = false; });
            subs.sub_info[subIndex].checked = true;
        }
        else {
            if (subs.sub_info[subIndex].checked) {
                subs.sub_info[subIndex].checked = false;
            }
            else {
                var checkedSubs = subs.sub_info.filter(function (sub) { return sub.checked; });
                if (checkedSubs.length >= subs.choose_number) {
                    util_1.toast("\u60A8\u6700\u591A\u53EA\u80FD\u9009\u62E9" + subs.choose_number + "\u4E2A\u79D1\u76EE\uFF0C\u8BF7\u5148\u53D6\u6D88\u5176\u4ED6\u9009\u79D1\uFF0C\u518D\u91CD\u65B0\u9009\u62E9\uFF01");
                }
                else {
                    subs.sub_info[subIndex].checked = true;
                }
            }
        }
        this.set({ province: province });
    };
    _setScore.prototype.setProvince = function (prov) {
        prov.sub_list.map(function (subs) {
            subs.sub_info.map(function (sub) {
                sub.checked = false;
            });
            subs.sub_info[0].checked = true;
        });
        this.set({ province: prov });
        var c = this.getComp("#provinceList");
        c.toHide();
    };
    _setScore.prototype.getInfo = function () {
        var _this = this;
        util_1.getData("/user_service/v1/allow/user/prov_subjects", {
            success: function (r) {
                var locationInter = setInterval(function () {
                    var e_3, _a, e_4, _b;
                    if (provinceName) {
                        clearInterval(locationInter);
                        _this.set({ info: r.data });
                        var isContinue = true;
                        try {
                            for (var _c = __values(r.data), _d = _c.next(); !_d.done; _d = _c.next()) {
                                var letter = _d.value;
                                try {
                                    for (var _e = (e_4 = void 0, __values(letter.prov_list)), _f = _e.next(); !_f.done; _f = _e.next()) {
                                        var prov = _f.value;
                                        if (prov.name.indexOf(provinceName) != -1) {
                                            _this.setProvince(prov);
                                            isContinue = false;
                                            break;
                                        }
                                    }
                                }
                                catch (e_4_1) { e_4 = { error: e_4_1 }; }
                                finally {
                                    try {
                                        if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                                    }
                                    finally { if (e_4) throw e_4.error; }
                                }
                                if (!isContinue) {
                                    break;
                                }
                            }
                        }
                        catch (e_3_1) { e_3 = { error: e_3_1 }; }
                        finally {
                            try {
                                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                            }
                            finally { if (e_3) throw e_3.error; }
                        }
                    }
                }, 20);
            }
        });
    };
    _setScore.prototype.onShow = function () {
        this.getInfo();
        wx.hideHomeButton();
    };
    return _setScore;
}(util_1.BasePage));
Page(new _setScore());
