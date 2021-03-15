"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../../../utilTs/util");
Component({
    options: {
        multipleSlots: true,
        addGlobalClass: true,
    },
    properties: {
        id: {
            type: String,
            value: "",
        },
        value: {
            type: String,
            value: "",
        },
    },
    data: {
        isShowCopy: false,
    },
    methods: {
        show: function () {
            this.setData({ isShowCopy: true });
            this.triggerEvent('show');
        },
        hide: function () {
            this.setData({ isShowCopy: false });
        },
        copy: function () {
            var _this = this;
            wx.setClipboardData({
                data: this.data.value,
                success: function (res) {
                    util_1.toast("复制成功");
                    _this.setData({ isShowCopy: false });
                },
            });
        }
    }
});
