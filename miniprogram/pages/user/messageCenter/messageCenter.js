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
var util_1 = require("../../../utilTs/util");
var TIM = require("tim-wx-sdk");
var emojiMap_1 = require("../../../utilTs/emojiMap");
var app = getApp();
var storageTimMessages;
var _messageCenter = (function (_super) {
    __extends(_messageCenter, _super);
    function _messageCenter() {
        var _this = _super.call(this) || this;
        _this.data = __assign(__assign({}, _this.data), { scrollBoxHeight: null, tabIndex: 0, cursor: 0, emojiUrl: emojiMap_1.emojiUrl,
            emojiMap: emojiMap_1.emojiMap,
            emojiName: emojiMap_1.emojiName, isShowEmoji: false, kefu: null, editState: false, checkAll: false, list: null, listPage: { page: 0, page_count: 1 }, sixin: null, refreshering: false, sixinPage: { page: 0, page_count: 1 }, message: "", hasStorangeTimMessage: false, messageList: [], nextReqMessageID: null, isCompleted: null, sixinScrollPosition: "bottom", sixinScrollPositionId: null, copyId: null });
        return _this;
    }
    _messageCenter.prototype.getAutoMessage = function () {
        util_1.getData("/static_service/v1/auth/tim/event", {});
    };
    _messageCenter.prototype.messageScroll = function () {
        if (this.data.copyId) {
            var c = this.getComp("#" + this.data.copyId);
            c.hide();
        }
    };
    _messageCenter.prototype.hideOther = function (e) {
        if (this.data.copyId) {
            var c = this.getComp("#" + this.data.copyId);
            c.hide();
        }
        this.data.copyId = e.currentTarget.id;
    };
    _messageCenter.prototype.delete = function () {
        var _this = this;
        var data = {};
        var checkedIndexs = [];
        if (this.data.checkAll) {
            data.notification_id = -1;
        }
        else {
            var notification_ids_1 = [];
            this.data.list.filter(function (item, i) {
                if (item.checked) {
                    checkedIndexs.push(i);
                    notification_ids_1.push(item.notification_id);
                }
            });
            data.notification_id = notification_ids_1.join(",");
        }
        util_1.getData("/static_service/v1/auth/tim/sysinforms/del", {
            data: data,
            success: function (r) {
                _this.set({ list: null });
                _this.set({ listPage: { page: 0, page_count: 1 } });
                _this.getList();
            }
        });
    };
    _messageCenter.prototype.read = function () {
        var _this = this;
        var data = {};
        var checkedIndexs = [];
        if (this.data.checkAll) {
            data.notification_id = -1;
        }
        else {
            var notification_ids_2 = [];
            this.data.list.filter(function (item, i) {
                if (item.checked) {
                    checkedIndexs.push(i);
                    notification_ids_2.push(item.notification_id);
                }
            });
            data.notification_id = notification_ids_2.join(",");
        }
        util_1.getData("/static_service/v1/auth/tim/sysinforms/redpoint", {
            data: data,
            success: function (r) {
                if (_this.data.checkAll) {
                    _this.data.list.map(function (item) {
                        item.red_point = false;
                    });
                }
                else {
                    checkedIndexs.map(function (index) {
                        _this.data.list[index].red_point = false;
                    });
                }
                _this.set({ list: _this.data.list });
                _this.set({ editState: false });
                _this.data.checkAll = true;
                _this.toCheckAll();
            }
        });
    };
    _messageCenter.prototype.toCheckAll = function () {
        var _this = this;
        this.set({ checkAll: !this.data.checkAll });
        this.data.list.map(function (item) {
            item.checked = _this.data.checkAll;
        });
        this.set({ list: this.data.list });
    };
    _messageCenter.prototype.setEditState = function () {
        this.set({ editState: !this.data.editState });
    };
    _messageCenter.prototype.checkTongzhi = function (e) {
        var _this = this;
        var _a = this.getElDataSet(e), item = _a.item, index = _a.index;
        console.log(item, index);
        if (this.data.editState) {
            this.data.list[index].checked = !this.data.list[index].checked;
            this.set({ list: this.data.list });
        }
        else {
            util_1.getData("/static_service/v1/auth/tim/sysinforms/redpoint?notification_id=1", {
                data: { notification_id: item.notification_id },
                success: function (r) {
                    _this.data.list[index].red_point = false;
                    _this.set({ list: _this.data.list });
                }
            });
            if (item.is_link) {
                wx.navigateTo({ url: util_1.translateUrl[item.link] + '?notification_id=' + item.notification_id });
            }
        }
    };
    _messageCenter.prototype.cahngeTab = function (e) {
        if (typeof e == "number") {
            this.set({ tabIndex: e });
        }
        else {
            this.set({ tabIndex: e.detail });
        }
        if (this.data.tabIndex == 0 && !this.data.nextReqMessageID) {
        }
        else if (this.data.tabIndex == 1) {
            this.getList();
        }
        else if (this.data.tabIndex == 2) {
            this.getKefu();
        }
    };
    _messageCenter.prototype.contact = function (e) {
        var _this = this;
        var _a = e.currentTarget.dataset, type = _a.type, value = _a.value;
        switch (type) {
            case 1:
                wx.setClipboardData({
                    data: value,
                    success: function (res) {
                        _this.toast("您已成功复制微信号");
                    },
                });
                break;
            case 2:
                wx.makePhoneCall({
                    phoneNumber: value,
                });
                break;
            default:
                this.contactMe();
        }
    };
    _messageCenter.prototype.contactMe = function () {
        var _this = this;
        if (this.data.globalUserInfo.user_state == 1) {
            wx.showModal({
                title: "",
                content: "\u8BF7\u5148\u7ED1\u5B9A\u624B\u673A\u53F7",
                success: function (e) {
                    if (e.confirm) {
                        wx.navigateTo({ url: "/pages/user/bindMobile/bindMobile" });
                    }
                },
            });
        }
        else {
            wx.showModal({
                title: "",
                content: "\u8BF7\u5BA2\u670D\u8054\u7CFB\u6211\"\u7533\u8BF7\u6210\u529F\u540E\uFF0C\u5BA2\u670D\u4F1A\u5C3D\u5FEB\u8054\u7CFB\u60A8\uFF0C\u8BF7\u8010\u5FC3\u7B49\u5F85\uFF01",
                success: function () {
                    util_1.getData("/static_service/v1/auth/service/connect_me", {
                        success: function (r) {
                            _this.toast("申请成功，客服会尽快联系您，请耐心等待！");
                        },
                    });
                },
            });
        }
    };
    _messageCenter.prototype.getKefu = function () {
        var _this = this;
        if (this.data.kefu)
            return;
        util_1.getData("/static_service/v1/allow/service/customer_service", {
            success: function (r) {
                _this.set({ kefu: r.data });
            },
        });
    };
    _messageCenter.prototype.getList = function () {
        var _this = this;
        if (this.data.listPage.page >= this.data.listPage.page_count)
            return;
        util_1.getData("/static_service/v1/auth/tim/sysinforms", {
            data: {
                limit: 20,
                page: this.data.listPage.page + 1,
            },
            success: function (r) {
                if (r.pager.page == 1) {
                    _this.set({ list: r.data });
                }
                else {
                    _this.set({ list: __spread(_this.data.list || [], r.data) });
                }
                _this.set({ listPage: r.pager });
                if (r.pager.page == 1) {
                    _this.set({ scrollTop: 0 });
                }
            }
        });
    };
    _messageCenter.prototype.showEmoji = function (e) {
        if (e && this.getElDataSet(e).type == "hide") {
            this.set({ isShowEmoji: false });
        }
        else {
            this.set({ isShowEmoji: !this.data.isShowEmoji });
        }
    };
    _messageCenter.prototype.previewImg = function (event) {
        var img = this.getElDataSet(event).img;
        console.log(img);
        wx.previewImage({
            current: img.split("?")[0],
            urls: [img],
        });
    };
    _messageCenter.prototype.inputEvent = function (e) {
        this.set({ cursor: e.detail.cursor });
    };
    _messageCenter.prototype.insertEmoji = function (e) {
        var emoji = this.getElDataSet(e).emoji;
        this.set({ message: this.data.message.substr(0, this.data.cursor) + emoji + this.data.message.substr(this.data.cursor) });
        this.set({ cursor: this.data.message.length });
    };
    _messageCenter.prototype.getSixin = function () {
        var _this = this;
        if (this.data.isCompleted || (!this.data.nextReqMessageID && !this.data.messageList))
            return;
        if (this.data.isCompleted || !util_1.tim)
            return;
        var listOptions = {
            conversationID: "C2C" + app.timInfo.admin_id,
            count: 15,
        };
        if (this.data.nextReqMessageID) {
            listOptions.nextReqMessageID = this.data.nextReqMessageID;
        }
        var promise = util_1.tim.getMessageList(listOptions);
        promise.then(function (imResponse) {
            imResponse.data.messageList.map(function (message) {
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
            if (_this.data.messageList) {
                _this.data.messageList = __spread(imResponse.data.messageList, _this.data.messageList);
            }
            else {
                _this.data.messageList = imResponse.data.messageList;
            }
            _this.set({
                messageList: _this.data.messageList,
            });
            if (!_this.data.nextReqMessageID) {
                _this.set({ sixinScrollPosition: "bottom" });
            }
            else {
                _this.set({ sixinScrollPosition: _this.data.nextReqMessageID });
            }
            _this.set({ nextReqMessageID: imResponse.data.nextReqMessageID });
            _this.set({ isCompleted: imResponse.data.isCompleted });
            _this.set({ refreshering: false });
            if (imResponse.isCompleted) {
                _this.data.timMessageCount = _this.data.messageList.length;
            }
        });
    };
    _messageCenter.prototype.sendImage = function () {
        var _this = this;
        wx.chooseImage({
            sourceType: ['album', 'camera'],
            count: 1,
            success: function (res) {
                wx.showLoading({ title: "正在发送,请稍后···" });
                var message = util_1.tim.createImageMessage({
                    to: "" + (app.timInfo.admin_id || _this.data.globalUserInfo.user_id),
                    conversationType: TIM.TYPES.CONV_C2C,
                    payload: { file: res },
                    onProgress: function (event) { console.log('file uploading:', event); }
                });
                var promise = util_1.tim.sendMessage(message);
                promise.then(function (r) {
                    _this.set({ message: "" });
                    _this.data.messageList.push(r.data.message);
                    _this.set({ messageList: _this.data.messageList });
                    _this.set({ sixinScrollPosition: "bottom" });
                    wx.hideLoading();
                }).catch(function (imError) {
                    wx.hideLoading();
                    _this.toast("发送失败，请重试！");
                });
            }
        });
    };
    _messageCenter.prototype.sendMessage = function () {
        var _this = this;
        if (!this.data.message)
            return;
        var message = util_1.tim.createTextMessage({
            to: "" + (app.timInfo.admin_id || this.data.globalUserInfo.user_id),
            conversationType: TIM.TYPES.CONV_C2C,
            payload: {
                text: this.data.message,
            },
        });
        var promise = util_1.tim.sendMessage(message);
        promise
            .then(function (r) {
            _this.set({ message: "" });
            r.data.message.payload.node = emojiMap_1.parseEmojiText(r.data.message.payload.text);
            _this.data.messageList.push(r.data.message);
            _this.set({ messageList: _this.data.messageList });
            _this.set({ sixinScrollPosition: "bottom" });
            _this.getAutoMessage();
        })
            .catch(function (imError) {
            console.log("sendMessage error:", imError);
            _this.toast("消息发送失败，请重试！---");
        });
    };
    _messageCenter.prototype.onInit = function () {
        var _this = this;
        this.cahngeTab(this.data.tabIndex);
        util_1.event.on(this, "updateUserState", function () {
            _this.getKefu();
        });
        this.getSixin();
        util_1.event.on(this, "messageReceived", function (r) {
            _this.data.messageList = __spread(_this.data.messageList, r);
            _this.set({ messageList: _this.data.messageList });
            setTimeout(function () {
                _this.set({ sixinScrollPosition: "bottom" });
            }, 50);
        });
    };
    _messageCenter.prototype.showStorageTim = function () {
        var id = this.data.messageList[0].ID;
        var index = 0;
        for (var i = 0; i < storageTimMessages.length; i++) {
            if (storageTimMessages[i].ID == id) {
                index = i - 1;
                break;
            }
        }
        this.set({ messageList: __spread(storageTimMessages.slice(0, index), this.data.messageList) });
    };
    _messageCenter.prototype.onUnload = function () {
        if (storageTimMessages && storageTimMessages.length > 0) {
            var storageLastTime = storageTimMessages.slice(-1)[0].time;
            var index = 0;
            for (var i = 0; i < this.data.messageList.length; i++) {
                var message = this.data.messageList[i];
                if (message.time > storageLastTime) {
                    index = i;
                    break;
                }
            }
            var newStorangeMessage = __spread(storageTimMessages, this.data.messageList.slice(index));
            var newIndex = 0;
            var timeStamp7DayBefore = Date.parse(new Date()) / 1000 - 7 * 24 * 60 * 60;
            for (var i = 0; i < newStorangeMessage.length; i++) {
                var message = newStorangeMessage[i];
                if (message.time > timeStamp7DayBefore) {
                    newIndex = i;
                    break;
                }
            }
            wx.setStorage({
                key: "timMessages",
                data: newStorangeMessage.slice(newIndex),
            });
        }
        else {
            wx.setStorage({
                key: "timMessages",
                data: this.data.messageList
            });
        }
    };
    _messageCenter.prototype.onShow = function () {
        var _this = this;
        var topContainer = wx.createSelectorQuery();
        topContainer
            .select("#topContainer")
            .boundingClientRect(function (r) {
            _this.set({
                scrollBoxHeight: app.systemInfo.windowHeight - r.height,
            });
        })
            .exec();
        var promise = util_1.tim.setMessageRead({ conversationID: "C2C" + app.timInfo.admin_id });
        promise.then(function (imResponse) {
            app.timInfo.unreadCount = 0;
        }).catch(function (imError) {
            console.warn('setMessageRead error:', imError);
        });
        storageTimMessages = wx.getStorageSync("timMessages");
        if (storageTimMessages && storageTimMessages[0].time < Date.parse(new Date()) / 1000 - 7 * 24 * 60 * 60) {
            this.set({ hasStorangeTimMessage: true });
        }
    };
    return _messageCenter;
}(util_1.GlobalUserInfoPage));
Page(new _messageCenter());
