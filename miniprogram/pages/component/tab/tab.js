"use strict";
Component({
    properties: {
        mode: {
            type: String,
            value: "string",
        },
        key: {
            type: String,
            value: "k",
        },
        items: Array,
        index: Number,
    },
    data: {
        aniLine: null,
        index: 0,
        items: [],
    },
    methods: {
        aniStart: function (width, left) {
            var animation = wx.createAnimation({
                duration: 300,
                timingFunction: 'ease',
            });
            animation.width(width).left(left).step();
            this.setData({
                aniLine: animation.export()
            });
        },
        setIndex: function (index) {
            this.setData({ index: index });
            this.setTab();
        },
        setTab: function (e) {
            var _this = this;
            var index = this.data.index;
            if (e) {
                index = e.currentTarget.dataset.index;
                this.setData({ index: index });
                this.triggerEvent('change', index, {});
            }
            var item = this.createSelectorQuery();
            item.selectAll(".item").boundingClientRect(function (r) {
                var currentItem = r[index];
                var width = currentItem.width * 0.5, left = currentItem.left + currentItem.width * 0.25;
                _this.aniStart(width, left);
            }).exec();
        }
    },
    lifetimes: {
        ready: function () {
            this.setTab();
        }
    }
});
