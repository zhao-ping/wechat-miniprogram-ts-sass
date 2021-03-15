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
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../../../utilTs/util");
var _article = (function (_super) {
    __extends(_article, _super);
    function _article() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.data = {
            info: null,
        };
        return _this;
    }
    _article.prototype.getInfo = function (article_id) {
        var _this = this;
        util_1.getData("/static_service/v1/allow/article/info", {
            data: { article_id: article_id },
            success: function (r) {
                r.data.article_content = util_1.translateArticleContent(r.data.article_content);
                _this.set({ info: r.data });
            }
        });
    };
    _article.prototype.onInit = function (e) {
        this.getInfo(parseInt(e.article_id));
    };
    return _article;
}(util_1.BasePage));
Page(new _article());
