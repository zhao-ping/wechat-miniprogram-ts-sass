"use strict";
Page({
    data: {
        pdf: ""
    },
    onLoad: function (options) {
        this.setData({ pdf: options.pdf });
    },
});
