"use strict";
Component({
    options: {
        multipleSlots: true,
        addGlobalClass: true,
    },
    properties: {
        show: {
            type: Boolean,
            value: false,
        }
    },
    data: {
        isShow: false,
    },
    ready: function () {
        this.setData({ isShow: this.data.show });
    },
    methods: {
        toShow: function () {
            this.setData({ isShow: true });
        },
        toHide: function (emit) {
            if (emit === void 0) { emit = true; }
            this.setData({ isShow: false });
            if (emit) {
                this.triggerEvent('hide');
            }
        },
        onHide: function (e) {
            this.triggerEvent('onHide', e);
        }
    }
});
