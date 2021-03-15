"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../../../utilTs/util");
Component({
    options: {
        addGlobalClass: true,
    },
    properties: {
        content: {
            type: String,
            value: ""
        }
    },
    data: {
        nodes: []
    },
    lifetimes: {
        ready: function () {
            var nodes = this.properties.content.replace(/<\/div><p/g, "</div>==0==<p").replace(/<\/div><div/g, "</div>==0==<div").replace(/<\/section>/g, "</section>==0==").replace(/<\/p>/g, "</p>==0==").split("==0==");
            nodes.map(function (node, i) {
                if (node.indexOf("yuanmeng://") != -1) {
                    var urls = node.match(/yuanmeng:\/\/.+?["|']/gi)[0].replace(/["|']/g, '').split("?");
                    nodes[i] = {
                        type: "link",
                        link: urls[1] ? util_1.translateUrl[urls[0]] + "?" + urls[1] : util_1.translateUrl[urls[0]],
                        node: node,
                    };
                }
                else if (/https?:\/\/.+?\.pdf/gi.test(node)) {
                    var url = node.match(/https?:\/\/.+?\.pdf/gi);
                    nodes[i] = {
                        type: "pdf",
                        url: url[0],
                        node: node,
                    };
                }
                else if (/https?:\/\/.+?\.(jpg|png|svg|jpeg|gif)/gi.test(node)) {
                    var url = node.match(/https?:\/\/.+?\.(jpg|png|svg|jpeg|gif)/gi);
                    nodes[i] = {
                        type: "image",
                        url: url,
                        node: node,
                    };
                }
                else {
                    var colors = node.match(/color=\"#.*?\"/g);
                    colors === null || colors === void 0 ? void 0 : colors.map(function (item) {
                        var color = item.replace(/\'|\"/, '').replace("=", ":");
                        node = node.replace(item, "style=\"" + color + "\"");
                    });
                    nodes[i] = {
                        type: "text",
                        node: node,
                    };
                }
            });
            this.setData({ nodes: nodes });
        },
    },
    methods: {
        previewImg: function (e) {
            var item = e.currentTarget.dataset.item;
            wx.previewImage({ urls: item.url });
        },
        previewPdf: function (e) {
            var item = e.currentTarget.dataset.item;
            wx.showLoading({ title: "\u52A0\u8F7D\u4E2D\uFF0C\u8BF7\u7A0D\u540E\u00B7\u00B7\u00B7" });
            wx.downloadFile({
                url: item.url,
                success: function (res) {
                    var filePath = res.tempFilePath;
                    wx.openDocument({
                        filePath: filePath,
                        success: function (res) {
                            wx.hideLoading();
                        }
                    });
                }
            });
        }
    }
});
