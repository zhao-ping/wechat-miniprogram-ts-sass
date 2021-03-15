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
var util_1 = require("../../../utilTs/util");
var popupInfo_base_1 = require("../../../utilTs/popupInfo.base");
var _zhiyuanDetail = (function (_super) {
    __extends(_zhiyuanDetail, _super);
    function _zhiyuanDetail() {
        var _this = _super.call(this, "", 0) || this;
        _this.data = __assign(__assign({}, _this.data), { isZhiyuanPage: true, scrollview: "bottom", uca_id: null, info: null, currentAdjust: [1], sorts: [], sortIndex: 0, currentIndex: null });
        return _this;
    }
    _zhiyuanDetail.prototype.showAdjust = function (e) {
        var _a = this.getElDataSet(e), item = _a.item, index = _a.index;
        this.set({ currentAdjust: item.adjust_type });
        this.set({ currentIndex: index });
        var adjust = this.getComp("#adjust");
        adjust.toShow();
    };
    _zhiyuanDetail.prototype.chooseAdjust = function (e) {
        var _this = this;
        var _a = this.getElDataSet(e), item = _a.item, index = _a.index;
        if (item.type == 0) {
            this.data.currentAdjust = [item.v];
        }
        else {
            var adjusts_1 = [];
            this.data.info.adjust_type_info.adjust_type_list.map(function (adjust) {
                if (adjust.type == 1 && _this.data.currentAdjust.includes(adjust.v)) {
                    adjusts_1.push(adjust.v);
                }
            });
            adjusts_1.push(item.v);
            var adjust = new Set(adjusts_1);
            this.data.currentAdjust = Array.from(adjust);
        }
        this.set({ currentAdjust: this.data.currentAdjust });
        this.data.info.application_school_list[index].adjust_type = this.data.currentAdjust;
        this.set({ info: this.data.info });
    };
    _zhiyuanDetail.prototype.adjustShanghai = function () {
        var _this = this;
        var item = this.data.info.application_school_list[this.data.currentIndex];
        util_1.getData("/data_service/v1/auth/application/school/update_adjust", {
            method: "PUT",
            data: {
                uca_id: this.data.uca_id,
                ucas_id: item.ucas_id,
                adjust_type: this.data.currentAdjust,
            },
            success: function (r) {
                _this.set({ info: r.data });
                _this.hideAdjust();
            }
        });
    };
    _zhiyuanDetail.prototype.hideAdjust = function () {
        var adjust = this.getComp("#adjust");
        adjust.toHide();
    };
    _zhiyuanDetail.prototype.adjust = function (e) {
        var _this = this;
        var index = this.getElDataSet(e).index;
        var item = this.data.info.application_school_list[index];
        util_1.getData("/data_service/v1/auth/application/school/update_adjust", {
            method: "PUT",
            data: {
                uca_id: this.data.uca_id,
                ucas_id: item.ucas_id,
                is_adjust: !item.is_adjust
            },
            success: function (r) {
                _this.data.info.application_school_list[index].is_adjust = !item.is_adjust;
                _this.set({ info: _this.data.info });
            }
        });
    };
    _zhiyuanDetail.prototype.move = function (e) {
        if (!this.canEdit())
            return;
        var _a = this.getElDataSet(e), index = _a.index, sort = _a.sort;
        var item = this.data.info.application_school_list[index];
        var data = {
            uca_id: this.data.uca_id,
            ucas_id: item.ucas_id,
            sort_type: sort,
            sort_index: 0,
        };
        this.httpSort(data);
    };
    _zhiyuanDetail.prototype.httpSort = function (data) {
        var _this = this;
        util_1.getData("/data_service/v1/auth/application/school/update_sort", {
            method: "PUT",
            data: data,
            success: function (r) {
                _this.set({ info: r.data });
            }
        });
    };
    _zhiyuanDetail.prototype.edit = function (e) {
        if (!this.canEdit())
            return;
        var index = this.getElDataSet(e).index;
        this.set({ currentIndex: index });
        this.set({ sortIndex: index });
        var c = this.getComp("#sort");
        c.toShow();
    };
    _zhiyuanDetail.prototype.watchSort = function (e) {
        this.set({ sortIndex: e.detail.value[0] });
    };
    _zhiyuanDetail.prototype.setSort = function () {
        if (!this.canEdit())
            return;
        var c = this.getComp("#sort");
        c.toHide();
        var data = {
            uca_id: this.data.uca_id,
            ucas_id: this.data.info.application_school_list[this.data.currentIndex].ucas_id,
            sort_type: 0,
            sort_index: this.data.sortIndex + 1,
        };
        this.httpSort(data);
    };
    _zhiyuanDetail.prototype.delete = function (e) {
        var _this = this;
        if (!this.canEdit())
            return;
        var index = this.getElDataSet(e).index;
        var item = this.data.info.application_school_list[index];
        util_1.getData("/data_service/v1/auth/application/school/del", {
            method: "DELETE",
            data: {
                uca_id: this.data.uca_id,
                ucas_id: item.ucas_id,
            },
            success: function (r) {
                _this.set({ info: r.data });
            }
        });
    };
    _zhiyuanDetail.prototype.getInfo = function () {
        var _this = this;
        util_1.getData("/data_service/v1/auth/application/" + this.data.uca_id, {
            success: function (r) {
                _this.set({ info: r.data });
                wx.setNavigationBarTitle({ title: r.data.application.application_name });
                if (_this.data.globalUserInfo.prov_model_ex != 1) {
                    _this.set({ scrollview: "bottom" });
                }
                var sorts = [];
                for (var i = 0; i < r.data.application_school_list.length; i++) {
                    sorts.push(r.data.application_school_list[i].sort_index_str);
                }
                _this.set({ sorts: sorts });
            }
        });
    };
    _zhiyuanDetail.prototype.canEdit = function () {
        if (!this.data.info.application.is_support_update) {
            wx.showModal({
                title: "提示",
                content: this.data.info.application.is_support_update_desc,
            });
        }
        return this.data.info.application.is_support_update;
    };
    _zhiyuanDetail.prototype.toAddSchool = function (e) {
        if (!this.canEdit())
            return;
        var sort = this.getElDataSet(e).sort;
        wx.navigateTo({ url: "/pages/zhiyuan/addSchool/addSchool?uca_id=" + this.data.uca_id + "&sort_index=" + sort });
    };
    _zhiyuanDetail.prototype.toAddMajor = function (e) {
        if (!this.canEdit())
            return;
        var item = this.getElDataSet(e).item;
        wx.navigateTo({ url: "/pages/zhiyuan/addMajor/addMajor?uca_id=" + this.data.uca_id + "&ucas_id=" + item.ucas_id + "&school_id=" + item.school_id + "&subject_group_id=" + item.subject_group_id });
    };
    _zhiyuanDetail.prototype.onInit = function (e) {
        this.set({ uca_id: Number(e.uca_id) });
    };
    _zhiyuanDetail.prototype.onShow = function () {
        this.getInfo();
    };
    return _zhiyuanDetail;
}(popupInfo_base_1.PopupInfoBase));
Page(new _zhiyuanDetail());
