"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../../../../utilTs/util");
Page({
    data: {
        info: null,
    },
    getInfo: function (article_id) {
        var _this = this;
        util_1.getData("/static_service/v1/allow/article/info", {
            data: { article_id: article_id },
            success: function (r) {
                wx.setNavigationBarTitle({ title: r.data.article_class_name });
                r.data.article_content = util_1.translateArticleContent(r.data.article_content);
                _this.setData({ info: r.data });
            }
        });
    },
    onLoad: function (e) {
        this.getInfo(e.article_id);
    }
});
