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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var scoreChoose_base_1 = require("../../../utilTs/scoreChoose.base");
var util_1 = require("../../../utilTs/util");
var _scoreMajor = (function (_super) {
    __extends(_scoreMajor, _super);
    function _scoreMajor(listApi, type) {
        var _this = _super.call(this, listApi, type) || this;
        _this.listApi = listApi;
        _this.type = type;
        _this.data = __assign({}, _this.data);
        return _this;
    }
    _scoreMajor.prototype.batchMajor = function () {
        var _this = this;
        util_1.event.on(this, "batchMajor", function (options) {
            options.data.map(function (item) {
                _this.data.list.map(function (major) {
                    if (major.school_id == item.school_id && major.major_id == item.major_id && major.match_id == item.match_id) {
                        major.is_alternative = item.add_or_del == 1 ? true : false;
                    }
                });
            });
            _this.set({ list: _this.data.list });
        });
    };
    return _scoreMajor;
}(scoreChoose_base_1.ScoreChooseBase));
Page(new _scoreMajor("/data_service/v1/auth/requirement/major/list", 2));
