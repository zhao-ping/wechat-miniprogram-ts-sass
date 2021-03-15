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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../../../utilTs/util");
var popupInfo_base_1 = require("../../../utilTs/popupInfo.base");
var _addMajor = (function (_super) {
    __extends(_addMajor, _super);
    function _addMajor(listApi, type) {
        var _this = _super.call(this, listApi, type) || this;
        _this.data = __assign(__assign({}, _this.data), { isZhiyuanPage: true, tabIndex: 1, params: null, baseInfo: null, checkedMajors: null, list: null, listPage: { page: 0, page_count: 1 } });
        return _this;
    }
    _addMajor.prototype.addOrDelMajor = function (e) {
        var _this = this;
        var item = this.getElDataSet(e).item;
        var isAdd = (this.data.tabIndex == 1 && !item.is_application_checked);
        var i = this.data.list.findIndex(function (tem) { return tem.major_id == item.major_id && tem.match_id == item.match_id; });
        var index = this.data.checkedMajors.findIndex(function (tem) { return tem.major_id == item.major_id && tem.match_id == item.match_id; });
        var data = {
            uca_id: this.data.params.uca_id,
            ucas_id: this.data.params.ucas_id,
        };
        if (isAdd) {
            data = __assign(__assign({}, data), { subject_group_id: this.data.params.subject_group_id, major_id: item.major_id, match_id: item.match_id });
        }
        else {
            data = __assign(__assign({}, data), { ucam_id: index != -1 ? this.data.checkedMajors[index].ucam_id : null });
        }
        util_1.getData(isAdd ? "/data_service/v1/auth/application/major/add" : "/data_service/v1/auth/application/major/del", {
            method: isAdd ? 'POST' : 'DELETE',
            data: data,
            success: function (r) {
                _this.data.list[i].is_application_checked = !_this.data.list[i].is_application_checked;
                _this.set({ list: _this.data.list });
                _this.set({ checkedMajors: r.data.application_major_list });
            }
        });
    };
    _addMajor.prototype.move = function (e) {
        var _this = this;
        var _a = this.getElDataSet(e), index = _a.index, sort = _a.sort;
        var item = this.data.checkedMajors[index];
        var data = {
            uca_id: this.data.params.uca_id,
            ucas_id: this.data.params.ucas_id,
            sort_type: sort,
            ucam_id: item.ucam_id,
        };
        util_1.getData("/data_service/v1/auth/application/major/update_sort", {
            method: "PUT",
            data: data,
            success: function (r) {
                _this.set({ checkedMajors: r.data.application_major_list });
            }
        });
    };
    _addMajor.prototype.changeTab = function (e) {
        this.set({ tabIndex: e.detail });
    };
    _addMajor.prototype.getCheckedMajors = function () {
        var _this = this;
        util_1.getData("/data_service/v1/auth/application/" + this.data.params.uca_id + "/school/" + this.data.params.ucas_id, {
            success: function (r) {
                _this.set({ baseInfo: r.data.base_info });
                _this.set({ checkedMajors: r.data.application_major_list });
            }
        });
    };
    _addMajor.prototype.getList = function () {
        var _this = this;
        if (this.data.listPage.page >= this.data.listPage.page_count)
            return;
        var data = __assign(__assign({}, this.data.params), { limit: 20, page: this.data.listPage.page + 1 });
        util_1.getData(this.listApi, {
            data: data,
            success: function (r) {
                if (_this.data.listPage.page == 0) {
                    _this.set({ list: r.data.major_list });
                }
                else {
                    _this.set({ list: __spread(_this.data.list, r.data.major_list) });
                }
                _this.set({ listPage: r.pager });
            }
        });
    };
    _addMajor.prototype.toApplication = function () {
        wx.navigateBack();
    };
    _addMajor.prototype.onInit = function (e) {
        for (var key in e) {
            e[key] = /^\d+$/g.test(e[key]) ? Number(e[key]) : e[key];
        }
        this.set({ params: e });
        this.getCheckedMajors();
        this.getList();
    };
    return _addMajor;
}(popupInfo_base_1.PopupInfoBase));
Page(new _addMajor("/data_service/v1/auth/application/school/major_list", 2));
