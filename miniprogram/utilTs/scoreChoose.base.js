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
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScoreChooseBase = void 0;
var util_1 = require("./util");
var popupInfo_base_1 = require("./popupInfo.base");
var basicListPage = { page: 0, page_count: 1 };
var rangeBtnInter;
var app = getApp();
var ScoreChooseBase = (function (_super) {
    __extends(ScoreChooseBase, _super);
    function ScoreChooseBase(listApi, type) {
        var _this = _super.call(this, listApi, type) || this;
        _this.listApi = listApi;
        _this.type = type;
        _this.data = __assign(__assign({}, _this.data), { scrollTop: 0, showRange: true, selectScoreRange: {
                stepScoreWidth: 0,
                ballWidth: 0,
                lineWidth: 0,
                leftX: 0,
                rightX: 0,
                default_max_score: null,
                default_min_score: null,
                max_percent: null,
                max_score: null,
                min_tag: null,
                max_tag: null,
                min_percent: null,
                min_score: null,
                total_min_score: null,
                total_max_score: null,
            }, rangeList: null, searchType: null, showFilter: true, filterList: null, filter: null, searchStr: "", baseInfo: null, list: null, listPage: {
                page: 0,
                page_count: 1,
            } });
        return _this;
    }
    ScoreChooseBase.prototype.beixuan = function (e) {
        var _this = this;
        var dataset = this.getElDataSet(e);
        var _a = dataset.item, school_id = _a.school_id, major_id = _a.major_id, match_id = _a.match_id, subject_group_id = _a.subject_group_id, is_alternative = _a.is_alternative;
        var index = dataset.index;
        util_1.getData("/data_service/v1/auth/alternative/major", {
            method: is_alternative ? "DELETE" : "POST",
            data: {
                school_id: school_id,
                major_id: major_id,
                match_id: match_id,
                subject_group_id: subject_group_id,
                admit_order_type: this.data.baseInfo.admit_order_type,
            },
            success: function () {
                _this.data.list[index].is_alternative = !_this.data.list[index]
                    .is_alternative;
                _this.set({ list: _this.data.list });
                util_1.event.push("beixuanMajor");
            },
        });
    };
    ScoreChooseBase.prototype.setSearchStr = function (e) {
        var str = this.getElDataSet(e).str;
        this.set({ searchStr: str });
    };
    ScoreChooseBase.prototype.toShowRange = function () {
        this.set({ showRange: true });
        var c = this.getComp("#range-filter");
        c.toShow();
    };
    ScoreChooseBase.prototype.toShowFilter = function () {
        var c = this.getComp("#school-filter");
        c.toShow();
    };
    ScoreChooseBase.prototype.setRange = function (e) {
        var source = this.getElDataSet(e).source;
        if (source == "button") {
            var c = this.getComp("#range-filter");
            c.toHide(false);
        }
        this.set({ showRange: false });
        this.set({ listPage: basicListPage });
        this.getList();
    };
    ScoreChooseBase.prototype.changeSearchType = function (e) {
        var _a = this.getElDataSet(e), item = _a.item, index = _a.index;
        this.data.rangeList[index].default_value = item;
        this.set({ rangeList: this.data.rangeList });
        this.computeRangeByScore();
    };
    ScoreChooseBase.prototype.changeAdmit = function (e) {
        var _a = this.getElDataSet(e), item = _a.item, index = _a.index;
        this.data.rangeList[index].default_value = item;
        this.resetSearchType();
        var c = this.getComp("#school-filter");
        c.setFilter("admit_order_type", item);
        this.initRange();
    };
    ScoreChooseBase.prototype.resetSearchType = function () {
        var child = this.data.rangeList.find(function (s) { return s.key == "search_type"; });
        var admit = this.data.rangeList.find(function (s) { return s.key == "admit_order_type"; }).default_value.v;
        child.values = this.data.searchType.values.filter(function (v) { return v.pv == admit; });
        child.default_value = child.values[0];
        this.set({ rangeList: this.data.rangeList });
    };
    ScoreChooseBase.prototype.getFilter = function () {
        var _this = this;
        util_1.getData("/data_service/v1/auth/requirement/search_data", {
            data: {
                type: this.type,
                admit_order_type: this.data.rangeList.find(function (item) { return item.key == "admit_order_type"; }).default_value.v,
            },
            success: function (r) {
                var i = r.data.search_list.findIndex(function (item) { return (item.key = "admit_order_type"); });
                if (i != -1) {
                    r.data.search_list[i].hide = true;
                }
                _this.set({ filterList: r.data.search_list });
            },
        });
    };
    ScoreChooseBase.prototype.leftMove = function (e) {
        var _a = this.data.selectScoreRange, leftX = _a.leftX, lineWidth = _a.lineWidth, max_percent = _a.max_percent, total_min_score = _a.total_min_score, total_max_score = _a.total_max_score;
        var x = e.changedTouches[0].clientX;
        if (x >= leftX && x <= lineWidth * max_percent + leftX) {
            var percent = (x - leftX) / lineWidth;
            var score = Math.floor(percent * (total_max_score - total_min_score)) +
                total_min_score;
            if (score != this.data.selectScoreRange.min_score) {
                this.data.selectScoreRange.min_score = score;
                this.set({ selectScoreRange: this.data.selectScoreRange });
                this.computeRangeByScore();
            }
        }
    };
    ScoreChooseBase.prototype.rightMove = function (e) {
        var _a = this.data.selectScoreRange, leftX = _a.leftX, rightX = _a.rightX, lineWidth = _a.lineWidth, min_percent = _a.min_percent, total_min_score = _a.total_min_score, total_max_score = _a.total_max_score;
        var x = e.changedTouches[0].clientX;
        if (x <= rightX && x >= lineWidth * min_percent + leftX) {
            var percent = (x - leftX) / lineWidth;
            var score = Math.floor(percent * (total_max_score - total_min_score)) +
                total_min_score;
            if (score != this.data.selectScoreRange.max_score) {
                this.data.selectScoreRange.max_score = score;
                this.set({ selectScoreRange: this.data.selectScoreRange });
                this.computeRangeByScore();
            }
        }
    };
    ScoreChooseBase.prototype.startRangeBtn = function (e) {
        var _this = this;
        rangeBtnInter = setInterval(function () {
            _this.rangeBtn(e);
        }, 100);
    };
    ScoreChooseBase.prototype.endRangeBtn = function (e) {
        clearInterval(rangeBtnInter);
    };
    ScoreChooseBase.prototype.rangeBtn = function (e) {
        var type = this.getElDataSet(e).type;
        var admit = this.data.rangeList.find(function (range) { return range.key == "admit_order_type"; });
        var scores = admit.default_value.data.score_list.map(function (score) { return score.min_score; });
        var _a = __read([Math.min.apply(Math, __spread(scores)), Math.max.apply(Math, __spread(scores))], 2), min = _a[0], max = _a[1];
        if (type == "add") {
            if (this.data.selectScoreRange.max_score >= max) {
                this.toast("已经是最大值了");
                return;
            }
            else {
                this.data.selectScoreRange.max_score++;
            }
        }
        else {
            if (this.data.selectScoreRange.min_score <= min) {
                this.toast("已经是最小值了");
                return;
            }
            else {
                this.data.selectScoreRange.min_score--;
            }
        }
        this.computeRangeByScore();
    };
    ScoreChooseBase.prototype.computeRangeByScore = function () {
        var admit = this.data.rangeList.find(function (range) { return range.key == "admit_order_type"; });
        var _a = __read([
            this.data.selectScoreRange.total_min_score,
            this.data.selectScoreRange.total_max_score,
        ], 2), min = _a[0], max = _a[1];
        var scoreRange = max - min;
        var search_type = this.data.rangeList.find(function (item) { return item.key == "search_type"; }).default_value.v;
        var min_tag = "", max_tag = "";
        var _b = this.data.selectScoreRange, min_score = _b.min_score, max_score = _b.max_score;
        switch (search_type) {
            case 1:
                min_tag = admit.default_value.data.score_list.find(function (item) { return item.min_score == min_score; }).rank + "\u4F4D";
                max_tag = admit.default_value.data.score_list.find(function (item) { return item.min_score == max_score; }).rank + "\u4F4D";
                break;
            case 2:
                min_tag = "\u7EBF\u5DEE" + admit.default_value.data.score_list.find(function (item) { return item.min_score == min_score; }).score_def + "\u5206";
                max_tag = "\u7EBF\u5DEE" + admit.default_value.data.score_list.find(function (item) { return item.min_score == max_score; }).score_def + "\u5206";
                break;
            case 3:
                min_tag = min_score + "\u5206";
                max_tag = max_score + "\u5206";
                break;
        }
        this.data.selectScoreRange = __assign(__assign({}, this.data.selectScoreRange), { min_percent: (min_score - min) / scoreRange, min_tag: min_tag, max_percent: (max_score - min) / scoreRange, max_tag: max_tag });
        this.set({ selectScoreRange: this.data.selectScoreRange });
    };
    ScoreChooseBase.prototype.initRange = function () {
        var admit = this.data.rangeList.find(function (range) { return range.key == "admit_order_type"; });
        var scores = admit.default_value.data.score_list.map(function (score) { return score.min_score; });
        var _a = __read([Math.min.apply(Math, __spread(scores)), Math.max.apply(Math, __spread(scores))], 2), min = _a[0], max = _a[1];
        this.data.selectScoreRange = __assign(__assign({}, this.data.selectScoreRange), { stepScoreWidth: this.data.selectScoreRange.lineWidth / (max - min), default_min_score: admit.default_value.data.default_min_score, default_max_score: admit.default_value.data.default_max_score, total_min_score: min, total_max_score: max, min_score: admit.default_value.data.default_min_score, max_score: admit.default_value.data.default_max_score });
        this.computeRangeByScore();
    };
    ScoreChooseBase.prototype.getSearch = function () {
        var _this = this;
        util_1.getData("/data_service/v1/auth/requirement/search?type=" + this.type, {
            success: function (r) {
                _this.set({ rangeList: r.data.search_list });
                _this.set({
                    searchType: JSON.parse(JSON.stringify(r.data.search_list.find(function (item) { return item.key == "search_type"; }))),
                });
                var queryBall = wx.createSelectorQuery();
                setTimeout(function () {
                    queryBall
                        .select("#rangeBall")
                        .boundingClientRect(function (b) {
                        _this.data.selectScoreRange.ballWidth = b.width;
                        var queryRangeLine = wx.createSelectorQuery();
                        queryRangeLine
                            .select("#rangeLine")
                            .boundingClientRect(function (l) {
                            _this.data.selectScoreRange.lineWidth = l.width;
                            _this.data.selectScoreRange.leftX =
                                (app.systemInfo.windowWidth - l.width) / 2;
                            _this.data.selectScoreRange.rightX =
                                _this.data.selectScoreRange.leftX + l.width;
                            _this.initRange();
                        })
                            .exec();
                    })
                        .exec();
                }, 0);
                _this.resetSearchType();
                _this.set({ userInfo: r.data.user_info });
                _this.getFilter();
            },
        });
    };
    ScoreChooseBase.prototype.setFilter = function (filter) {
        this.set({ filter: filter.detail });
        this.set({ listPage: basicListPage });
        this.getList();
    };
    ScoreChooseBase.prototype.getList = function () {
        var _this = this;
        if (this.data.listPage.page >= this.data.listPage.page_count)
            return;
        if (this.data.listPage.page == 0) {
            this.data.list = [];
        }
        var data = {
            page: this.data.listPage.page + 1,
            limit: 20,
            search_tag: this.type,
        };
        if (this.data.rangeList) {
            var range = {
                search_type: this.data.rangeList.find(function (item) { return item.key == "search_type"; }).default_value.v,
                admit_order_type: this.data.rangeList.find(function (item) { return item.key == "admit_order_type"; }).default_value.v,
                min_range_value: this.data.selectScoreRange.min_tag.match(/\d+/)[0],
                min_score: this.data.selectScoreRange.min_score,
                max_range_value: this.data.selectScoreRange.max_tag.match(/\d+/)[0],
                max_score: this.data.selectScoreRange.max_score,
                school_name: this.data.searchStr,
                major_name: this.data.searchStr,
            };
            data = __assign(__assign({}, data), range);
        }
        if (this.data.filter) {
            data = __assign(__assign({}, data), this.data.filter.filters);
        }
        if (this.data.uca_id) {
            data = __assign(__assign({}, data), { uca_id: this.data.uca_id });
            if (this.data.sorts) {
                data = __assign(__assign({}, data), { sort_type: this.data.sorts[this.data.tabIndex] ? this.data.sorts[this.data.tabIndex].default_value.v : null });
            }
            if (this.data.school_name != undefined) {
                if (!this.data.school_name) {
                    this.toast("请填写搜索关键字！");
                    return;
                }
                data = __assign(__assign({}, data), { school_name: this.data.school_name });
            }
        }
        util_1.getData(this.listApi, {
            data: data,
            success: function (r) {
                _this.set({
                    list: __spread((r.pager.page == 1 ? [] : _this.data.list), (r.data.major_list ? r.data.major_list : r.data.school_list)),
                });
                _this.set({ baseInfo: r.data.base_info });
                if (_this.data.beixuanFirst && _this.data.list.length == 0) {
                    var c = _this.getComp("#tabs");
                    c.setIndex(1);
                    _this.set({ tabIndex: 1 });
                    _this.data.beixuanFirst = false;
                    _this.changeTab();
                    return;
                }
                _this.set({ listPage: r.pager });
                if (r.pager.page == 1) {
                    _this.set({ scrollTop: 0 });
                }
            },
        });
    };
    ScoreChooseBase.prototype.httpBeixuanSchool = function (e) {
        var _this = this;
        var _a = this.getElDataSet(e).item, school_id = _a.school_id, subject_group_id = _a.subject_group_id, is_alternative = _a.is_alternative;
        var index = this.getElDataSet(e).index;
        util_1.getData("/data_service/v1/auth/alternative/school", {
            method: is_alternative ? "DELETE" : "POST",
            data: {
                school_id: school_id,
                subject_group_id: subject_group_id,
                admit_order_type: this.data.baseInfo.admit_order_type,
            },
            success: function (r) {
                _this.data.list[index].is_alternative = !is_alternative;
                if (is_alternative) {
                    _this.data.list[index].alternative_major_count = 0;
                }
                _this.set({ list: _this.data.list });
                util_1.event.push("beixuanSchool");
            },
        });
    };
    ScoreChooseBase.prototype.beixuanSchool = function (e) {
        var _this = this;
        var _a = this.getElDataSet(e).item, alternative_major_count = _a.alternative_major_count, is_alternative = _a.is_alternative;
        if (is_alternative && alternative_major_count > 0) {
            var bxStr = this.data.baseInfo.page_model == 1 ? "学校" : "专业组";
            wx.showModal({
                title: "提示",
                content: "\u53D6\u6D88\u5907\u9009" + bxStr + "\u7684\u540C\u65F6\u4E5F\u5C06\u53D6\u6D88" + bxStr + "\u4E0B\u7684\u5907\u9009\u4E13\u4E1A\uFF0C\u662F\u5426\u53D6\u6D88\u5907\u9009\uFF1F",
                success: function (res) {
                    if (res.confirm) {
                        _this.httpBeixuanSchool(e);
                    }
                },
            });
        }
        else {
            this.httpBeixuanSchool(e);
        }
    };
    ScoreChooseBase.prototype.batchMajor = function () {
        var _this = this;
        util_1.event.on(this, "batchMajor", function (options) {
            options.data.map(function (item) {
                if (item.add_or_del == 1) {
                    _this.data.list[options.index].alternative_major_count += 1;
                }
                else {
                    _this.data.list[options.index].alternative_major_count -= 1;
                }
            });
            if (_this.data.list[options.index].alternative_major_count > 0) {
                _this.data.list[options.index].is_alternative = true;
            }
            _this.set({ list: _this.data.list });
        });
    };
    ScoreChooseBase.prototype.onInit = function (e) {
        this.batchMajor();
        this.getSearch();
    };
    return ScoreChooseBase;
}(popupInfo_base_1.PopupInfoBase));
exports.ScoreChooseBase = ScoreChooseBase;
