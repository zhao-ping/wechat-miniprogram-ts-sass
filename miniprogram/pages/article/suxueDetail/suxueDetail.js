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
var info;
var _suxueDetail = (function (_super) {
    __extends(_suxueDetail, _super);
    function _suxueDetail() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.data = {
            info: info,
            nodes: [],
        };
        return _this;
    }
    _suxueDetail.prototype.tapContent = function (e) {
        console.log(e);
    };
    _suxueDetail.prototype.collection = function () {
        var _this = this;
        var checked = this.data.info.article_detail.is_collentions;
        util_1.getData("/static_service/v1/auth/quality_article/" + this.data.info.article_detail.article_id + "/collection", {
            method: "PUT",
            data: { type: checked ? 2 : 1 },
            success: function (r) {
                if (checked) {
                    _this.data.info.article_detail.is_collentions = false;
                    _this.data.info.article_detail.collections--;
                }
                else {
                    _this.data.info.article_detail.is_collentions = true;
                    _this.data.info.article_detail.collections++;
                }
                _this.set({ info: _this.data.info });
            }
        });
    };
    _suxueDetail.prototype.zan = function () {
        var _this = this;
        var checked = this.data.info.article_detail.is_thumbs;
        util_1.getData("/static_service/v1/auth/quality_article/" + this.data.info.article_detail.article_id + "/thumb", {
            method: "PUT",
            data: { type: checked ? 2 : 1 },
            success: function (r) {
                if (checked) {
                    _this.data.info.article_detail.is_thumbs = false;
                    _this.data.info.article_detail.thumbs--;
                }
                else {
                    _this.data.info.article_detail.is_thumbs = true;
                    _this.data.info.article_detail.thumbs++;
                }
                _this.set({ info: _this.data.info });
            }
        });
    };
    _suxueDetail.prototype.getInfo = function (article_id) {
        var _this = this;
        util_1.getData("/static_service/v1/auth/quality_article/" + article_id + "/detail", {
            success: function (r) {
                r.data.article_detail.content = util_1.translateArticleContent(r.data.article_detail.content);
                _this.set({ info: r.data });
            },
        });
    };
    _suxueDetail.prototype.onInit = function (e) {
        this.getInfo(e.article_id);
    };
    return _suxueDetail;
}(util_1.BasePage));
Page(new _suxueDetail());
