"use strict";
Component({
    behaviors: [],
    options: {
        multipleSlots: true,
        addGlobalClass: true,
    },
    properties: {
        disabled: {
            type: Boolean,
            value: false,
        },
        clear: {
            type: Boolean,
            value: true,
        },
        mode: String,
        value: null,
        autofocus: Boolean,
        placeholder: String,
        required: Boolean,
        type: String,
        clas: String,
        styl: String,
        confirmtype: String,
    },
    data: {},
    lifetimes: {
        attached: function () {
        },
        created: function () {
        },
    },
    methods: {
        cahngeValue: function (e) {
            this.setData({ value: e.detail.value || null });
            this.triggerEvent('change', this.data.value);
        },
        rightSlotTap: function () {
            this.triggerEvent('rightslottap');
        },
        clearValue: function () {
            this.setData({ value: null });
            this.triggerEvent('change');
        },
        bindconfirm: function () {
            this.triggerEvent('confirm');
        }
    }
});
