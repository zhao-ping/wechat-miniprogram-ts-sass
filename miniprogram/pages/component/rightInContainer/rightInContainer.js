"use strict";
Component({
    options: {
        multipleSlots: true,
        addGlobalClass: true,
    },
    properties: {},
    data: {
        isShow: false,
    },
    methods: {
        toShow: function () {
            this.setData({ isShow: true });
        },
        toHide: function () {
            this.setData({ isShow: false });
        },
        onHide: function (e) {
            this.triggerEvent('hide');
        }
    }
});
