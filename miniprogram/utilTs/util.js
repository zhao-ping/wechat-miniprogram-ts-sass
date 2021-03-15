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
exports.initTim = exports.tim = exports.event = exports.PureInfoPage = exports.GlobalUserInfoPage = exports.BasePage = exports.clearSomeLocalstorage = exports.translateArticleContent = exports.refreshHistory = exports.transformPx = exports.toast = exports.isMobile = exports.wechatLogin = exports.getData = exports.translateUrl = void 0;
var TIM = require("tim-wx-sdk");
var TIMUploadPlugin = require("tim-upload-plugin");
var emojiMap_1 = require("./emojiMap");
var conf_1 = require("../utilTs/conf");
var ts_md5_1 = require("ts-md5");
exports.translateUrl = {
    "yuanmeng://home": "/pages/home/home/home",
    "yuanmeng://major_detail": "/pages/major/major/major",
    "yuanmeng://school_detail": "/pages/school/school/school",
    "yuanmeng://buy_vip": "/pages/vip/info/info",
    "yuanmeng://user_bei_xuan": "/pages/zhiyuan/beixuan/beixuan",
    "yuanmeng://can_school": "/pages/zhiyuan/possibleSchools/possibleSchools",
    "yuanmeng://school_rank": "/pages/school/rankType/rankType",
    "yuanmeng://school_rank_detail": "/pages/school/rankType/rankType",
    "yuanmeng://all_scholl": "/pages/school/schools/schools",
    "yuanmeng://all_major": "/pages/major/majors/majors",
    "yuanmeng://probability_forecast_search": "/pages/school/searchSchoolPossibility/searchSchoolPossibility",
    "yuanmeng://school_probability_detail": "/pages/school/searchSchoolPossibility/searchSchoolPossibility",
    "yuanmeng://problem_home": "/pages/user/question/questions/questions",
    "yuanmeng://major_home": "/pages/major/majors/majors",
    "yuanmeng://update_score": "/pages/user/setScore/setScore",
    "yuanmeng://valunteer_edit": "/pages/zhiyuan/zhiyuans/zhiyuans",
    "yuanmeng://score_line": "/pages/home/provinceLine/provinceLine",
    "yuanmeng://subsection_line": "/pages/home/scoreRank/scoreRank",
    "yuanmeng://plan_detail": "/pages/school/searchSchoolPlan/searchSchoolPlan",
    "yuanmeng://plan_search": "/pages/school/searchSchoolPlan/searchSchoolPlan",
    "yuanmeng://question": "/pages/user/question/questions/questions",
    "yuanmeng://choose_subject": "/pages/newSubject/newSubject/newSubject",
    "yuanmeng://my_volunteer_form": "/pages/zhiyuan/zhiyuans/zhiyuans",
    "yuanmeng://grade_report": "/pages/scoreReport/report/report",
    "yuanmeng://search_major": "/pages/zhiyuan/scoreMajor/scoreMajor",
    "yuanmeng://search_school": "/pages/zhiyuan/scoreSchool/scoreSchool",
    "yuanmeng://quality_article_detail": "/pages/article/suxueDetail/suxueDetail"
};
var app = getApp();
var mistiming = 0;
function getData(url, _a) {
    var _b = _a.showLoadding, showLoadding = _b === void 0 ? false : _b, _c = _a.method, method = _c === void 0 ? "GET" : _c, _d = _a.data, data = _d === void 0 ? {} : _d, _e = _a.success, success = _e === void 0 ? function (r) { } : _e, _f = _a.fail, fail = _f === void 0 ? function (r) { } : _f;
    try {
        if (showLoadding) { }
        ;
        app.conf.requestHeader.timestamp = mistiming + Date.parse(new Date()) / 1000;
        var miniAppId = "ymzy.mini", miniAppSecret = "ymzy.mini", source = 5, token = app.conf.requestHeader.token;
        var Authorization = ts_md5_1.Md5.hashStr(miniAppId + "@" + miniAppSecret + "@" + source + "@" + token + "@" + app.conf.requestHeader.timestamp);
        app.conf.requestHeader.Authorization = ("" + Authorization).toUpperCase();
        wx.request({
            method: method,
            header: app.conf.requestHeader,
            url: "" + app.conf.requestHost + url,
            data: data,
            success: function (r) {
                var res = r.data;
                mistiming = res.time - Date.parse(new Date()) / 1000;
                var newToken = r.header.token || r.header.Token;
                if (newToken) {
                    app.conf.requestHeader.token = newToken;
                    wx.setStorage({
                        key: "token",
                        data: newToken,
                    });
                }
                if (res.code == 0) {
                    success && success(res.body);
                }
                else if (res.code == 101) {
                    console.info("VIP转化！");
                    var vipInfo = res.body.data;
                    wx.showModal({
                        title: vipInfo.title,
                        content: vipInfo.btn_text,
                        success: function (r) {
                            if (r.confirm) {
                                wx.navigateTo({ url: "/pages/vip/pay/pay" });
                            }
                            else {
                                wx.navigateBack();
                            }
                        }
                    });
                }
                else if (res.code == 1 || res.code == 6) {
                    toast(res.msg);
                }
                else if (res.code == 100) {
                    app.globalData.user_info = null;
                    wx.redirectTo({ url: "/pages/login/login/login" });
                }
                else if (res.code == 113) {
                    console.info("模块功能关闭！");
                }
                else if (res.code == 403) {
                }
                else if (res.code === 404) {
                    console.error("API挂了");
                }
                else if (res.code == 114) {
                    fail && fail(res.msg);
                }
            },
        });
    }
    catch (e) {
        console.log(e);
    }
}
exports.getData = getData;
function wechatLogin() {
    wx.login({
        success: function (r) {
            console.info("这里是公共方法微信登录占位");
        }
    });
}
exports.wechatLogin = wechatLogin;
function isMobile(mobile) {
    return mobile ? /^\d{11}$/.test(mobile) : false;
}
exports.isMobile = isMobile;
function toast(message, duration, icon) {
    if (duration === void 0) { duration = 2000; }
    if (icon === void 0) { icon = "none"; }
    wx.showToast({ title: message, icon: icon, duration: duration, });
}
exports.toast = toast;
function transformPx(px) {
    return px / (750 / 2) * wx.getSystemInfoSync().windowWidth;
}
exports.transformPx = transformPx;
function refreshHistory(arr, newOne, key) {
    if (key === void 0) { key = "school_id"; }
    for (var i = 0; i < arr.length; i++) {
        if (arr[i][key] == newOne[key]) {
            arr.splice(i, 1);
            break;
        }
    }
    arr.unshift(newOne);
    return arr.splice(0, 10);
}
exports.refreshHistory = refreshHistory;
function translateArticleContent(content) {
    return content.replace(/<img/g, "<img class=\"img\"").replace(/<p/g, "<p class=\"p\"").replace(/<table/g, "<table class=\"table\"").replace(/<h3/g, "<h3 class=\"h3\"");
}
exports.translateArticleContent = translateArticleContent;
function clearSomeLocalstorage() {
    wx.clearStorageSync();
}
exports.clearSomeLocalstorage = clearSomeLocalstorage;
var BasePage = (function () {
    function BasePage() {
    }
    BasePage.prototype.getElDataSet = function (e) {
        return e.currentTarget.dataset;
    };
    BasePage.prototype.createSelector = function () {
        return this.createSelectorQuery();
    };
    BasePage.prototype.back = function () {
        wx.navigateBack();
    };
    BasePage.prototype.elToast = function (e) {
        var message = e.currentTarget.dataset.message || "消息提示占位符";
        var duration = e.currentTarget.dataset.duration || 1500;
        wx.showToast({
            title: message,
            duration: duration,
            icon: "none",
        });
    };
    BasePage.prototype.toast = function (message, duration) {
        if (duration === void 0) { duration = 1500; }
        wx.showToast({
            title: message,
            duration: duration,
            icon: "none",
        });
    };
    BasePage.prototype.set = function (data) {
        this.setData(data);
    };
    BasePage.prototype.getComp = function (id) {
        return this.selectComponent(id);
    };
    BasePage.prototype.onInit = function (options) { };
    BasePage.prototype.onLoad = function (options) {
        var _this = this;
        this.onInit(options);
        wx.getStorage({
            key: "token",
            success: function (r) {
                if (conf_1.timOpen) {
                    !exports.tim && initTim().then(function (r) {
                        var promise = exports.tim.getConversationList();
                        promise.then(function (imResponse) {
                            var conversationList = imResponse.data.conversationList;
                            _this.set({ unreadCount: conversationList[0].unreadCount });
                            app.timInfo.unreadCount = conversationList[0].unreadCount;
                        }).catch(function (imError) {
                            console.warn('getConversationList error:', imError);
                        });
                    });
                }
            }
        });
    };
    BasePage.prototype.onReady = function () { };
    BasePage.prototype.onShow = function () { };
    BasePage.prototype.onHide = function () { };
    BasePage.prototype.onUnload = function () { };
    BasePage.prototype.onPullDownRefresh = function () { };
    BasePage.prototype.onReachBottom = function () { };
    BasePage.prototype.onPageScroll = function (option) { };
    BasePage.prototype.onTabItemTap = function (item) { };
    BasePage.prototype.clearSomeStorage = function () {
        var unremoveStorange = ["loginInfo", "timMessages"];
        wx.getStorageInfo({
            success: function (r) {
                console.log(r);
                r.keys.map(function (key) {
                    if (!unremoveStorange.includes(key)) {
                        wx.removeStorage({ key: key });
                    }
                });
            }
        });
    };
    return BasePage;
}());
exports.BasePage = BasePage;
var GlobalUserInfoPage = (function (_super) {
    __extends(GlobalUserInfoPage, _super);
    function GlobalUserInfoPage() {
        var _this = _super.call(this) || this;
        var app = getApp();
        _this.data = {
            unreadCount: app.timInfo.unreadCount || 0,
            globalUserInfo: null,
        };
        return _this;
    }
    GlobalUserInfoPage.prototype.getGlobalUserInfo = function (callback) {
        var _this = this;
        getData("/user_service/v1/auth/user/info", {
            success: function (r) {
                app.globalData.user_info = __assign(__assign({}, app.globalData.user_info || {}), r.data);
                _this.set({ globalUserInfo: app.globalData.user_info });
                callback && callback();
            }
        });
    };
    GlobalUserInfoPage.prototype.initUserInfo = function () {
        var _this = this;
        var app = getApp();
        if (app.globalData.user_info) {
            this.set({ globalUserInfo: app.globalData.user_info });
        }
        else {
            var userInfo = wx.getStorageSync("userInfo");
            if (userInfo) {
                this.set({ globalUserInfo: userInfo });
            }
            else {
                this.getGlobalUserInfo();
            }
        }
        event.on(this, ["updateScore", "updateUserState"], function () {
            _this.set({ globalUserInfo: app.globalData.user_info });
        });
    };
    GlobalUserInfoPage.prototype.onLoad = function (options) {
        var _this = this;
        this.initUserInfo();
        this.onInit(options);
        wx.getStorage({
            key: "token",
            success: function (r) {
                if (conf_1.timOpen) {
                    !exports.tim && initTim().then(function (r) {
                        var promise = exports.tim.getConversationList();
                        promise.then(function (imResponse) {
                            var conversationList = imResponse.data.conversationList;
                            _this.set({ unreadCount: conversationList[0].unreadCount });
                            app.timInfo.unreadCount = conversationList[0].unreadCount;
                        }).catch(function (imError) {
                            console.warn('getConversationList error:', imError);
                        });
                    });
                }
            }
        });
        event.on(this, "messageReceived", function (data) {
            var pages = getCurrentPages();
            var currentPage = pages[pages.length - 1];
            var url = currentPage.route;
            if (_this.route != "pages/user/messageCenter/messageCenter" && _this.route == url) {
                var promise = exports.tim.getConversationList();
                promise.then(function (imResponse) {
                    var conversationList = imResponse.data.conversationList;
                    _this.set({ unreadCount: conversationList[0].unreadCount });
                    app.timInfo.unreadCount = conversationList[0].unreadCount;
                }).catch(function (imError) {
                    console.warn('getConversationList error:', imError);
                });
                _this.toast("您收到一条心消息，请到消息中心查看！");
            }
        });
    };
    return GlobalUserInfoPage;
}(BasePage));
exports.GlobalUserInfoPage = GlobalUserInfoPage;
var PureInfoPage = (function (_super) {
    __extends(PureInfoPage, _super);
    function PureInfoPage(api) {
        var _this = _super.call(this) || this;
        _this.api = api;
        _this.api = api;
        _this.data = {
            info: null,
        };
        return _this;
    }
    PureInfoPage.prototype.pageInit = function () {
        var _this = this;
        _super.prototype.initUserInfo.call(this);
        getData(this.api.url, {
            method: this.api.method,
            success: function (r) {
                _this.setData({ info: r.data });
            }
        });
    };
    PureInfoPage.prototype.onLoad = function (e) {
        this.pageInit();
    };
    return PureInfoPage;
}(GlobalUserInfoPage));
exports.PureInfoPage = PureInfoPage;
var event = (function () {
    function event() {
    }
    event.push = function (eventName, callbackData) {
        var _this = this;
        var eventNames = typeof eventName == "string" ? eventName.split(",") : eventName;
        eventNames.map(function (name) {
            (_this.notices).forEach(function (item) {
                if (item.name == name) {
                    item.callback(callbackData);
                    if (item.once) {
                        _this.remove(item.page, item.name);
                    }
                }
            });
        });
    };
    event.remove = function (page, eventName) {
        var pageId = page.__wxExparserNodeId__;
        this.deleteEvent(pageId, eventName);
    };
    event.deleteEvent = function (pageId, eventName) {
        var _this = this;
        (this.notices).forEach(function (item, key) {
            if (pageId == item.pageId || eventName == item.name) {
                _this.notices.splice(key, 1);
            }
        });
    };
    event.on = function (page, eventNames, callback, once) {
        var _this = this;
        if (once === void 0) { once = false; }
        var array = [];
        if (typeof eventNames == 'string') {
            array = eventNames.split(",");
        }
        if (typeof eventNames == 'object') {
            array = eventNames;
        }
        var pageId = page.__wxExparserNodeId__;
        array.forEach(function (mName) {
            var pageObj = {
                name: mName,
                callback: callback,
                page: page,
                pageId: pageId,
                once: once
            };
            _this.notices.push(pageObj);
        });
    };
    event.notices = [];
    return event;
}());
exports.event = event;
function initTim() {
    var app = getApp();
    return new Promise(function (resolve) {
        getData("/data_service/v1/auth/tim/sig", {
            success: function (r) {
                app.timInfo = __assign(__assign({}, app.timInfo), r.data);
                console.log(app.timInfo);
                var options = {
                    SDKAppID: app.timInfo.SDKAppID,
                };
                exports.tim = TIM.create(options);
                exports.tim.setLogLevel(0);
                var loginPromise = exports.tim.login({ userID: r.data.tid, userSig: r.data.sig, });
                exports.tim.registerPlugin({ 'tim-upload-plugin': TIMUploadPlugin });
                exports.tim.on(TIM.EVENT.KICKED_OUT, function (event) {
                    app.globalData.user_info.user_id = null;
                    wx.navigateTo({ url: "/pages/login/login/login" });
                });
                loginPromise.then(function (e) {
                    resolve();
                });
                exports.tim.on(TIM.EVENT.MESSAGE_RECEIVED, function (e) {
                    e.data.map(function (message) {
                        if (message.type == "TIMCustomElem" && message.payload.data) {
                            try {
                                message.payload.data = JSON.parse(message.payload.data);
                                message.payload.data.msg_list.map(function (m) {
                                    if (m.type == 'txt') {
                                        m.text = emojiMap_1.parseEmojiText(m.txt);
                                    }
                                });
                            }
                            catch (error) {
                                console.error(error);
                            }
                        }
                        else if (message.type == "TIMTextElem") {
                            message.payload.node = emojiMap_1.parseEmojiText(message.payload.text);
                        }
                    });
                    event.push("messageReceived", e.data);
                });
            }
        });
    });
}
exports.initTim = initTim;
