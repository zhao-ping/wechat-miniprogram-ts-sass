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
var list, info;
var _zhiyuans = (function (_super) {
    __extends(_zhiyuans, _super);
    function _zhiyuans() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.data = {
            state: 1,
            checkedCount: 0,
            info: info,
            list: list,
            listPage: {
                page: 0,
                page_count: 1,
            },
            showAdmit: false
        };
        return _this;
    }
    _zhiyuans.prototype.downlaod = function (e) {
    };
    _zhiyuans.prototype.checkZhiyuan = function (e) {
        var _a = this.getElDataSet(e), index = _a.index, pinggu = _a.pinggu;
        if (this.data.state == 1) {
            if (pinggu) {
                wx.navigateTo({ url: "/pages/zhiyuan/zhiyuanTest/zhiyuanTest?uca_id=" + this.data.list[index].uca_id });
            }
            else {
                wx.navigateTo({ url: "/pages/zhiyuan/zhiyuanDetail/zhiyuanDetail?uca_id=" + this.data.list[index].uca_id });
            }
        }
        else if (this.data.state == 2) {
            this.data.list[index].checked = !this.data.list[index].checked;
            this.data.list[index].checked ? this.set({ checkedCount: this.data.checkedCount + 1 }) : this.set({ checkedCount: this.data.checkedCount - 1 });
            this.set({ list: this.data.list });
        }
    };
    _zhiyuans.prototype.deleteZhiyuan = function () {
        var _this = this;
        var uca_id_list = this.data.list.filter(function (item) { return item.checked; }).map(function (item) { return item.uca_id; });
        util_1.getData("/data_service/v1/auth/application/del", {
            method: "DELETE",
            data: { uca_id_list: uca_id_list },
            success: function (r) {
                var list = _this.data.list.filter(function (item) { return !item.checked; });
                _this.set({ list: list });
                _this.data.listPage = {
                    page: 0, page_count: 1,
                };
                _this.getList();
            }
        });
    };
    _zhiyuans.prototype.changeState = function () {
        if (this.data.state == 2 && this.data.checkedCount > 0) {
            this.deleteZhiyuan();
            this.set({ state: 1 });
        }
        else {
            this.set({ state: this.data.state == 2 ? 1 : 2 });
        }
    };
    _zhiyuans.prototype.newZhiyuan = function (e) {
        var _this = this;
        var admit_order_type = this.data.info.user_info.admit_order_type;
        if (e) {
            admit_order_type = this.getElDataSet(e).admit;
        }
        util_1.getData("/data_service/v1/auth/application/add", {
            method: "POST",
            data: { admit_order_type: admit_order_type },
            success: function (r) {
                _this.data.list = __spread([r.data], _this.data.list);
                wx.navigateTo({ url: "/pages/zhiyuan/zhiyuanDetail/zhiyuanDetail?uca_id=" + r.data.uca_id });
                _this.set({ list: _this.data.list });
                var c = _this.getComp("#admitList");
                c.toHide();
            }
        });
    };
    _zhiyuans.prototype.toShowAdmit = function () {
        if (this.data.info.admit_order_type_list.length <= 1) {
            this.newZhiyuan();
        }
        else {
            var c = this.getComp("#admitList");
            c.toShow();
        }
    };
    _zhiyuans.prototype.chooseAdmit = function (e) {
        var admit = this.getElDataSet(e).admit;
        this.newZhiyuan(admit);
    };
    _zhiyuans.prototype.getList = function () {
        var _this = this;
        if (this.data.listPage.page >= this.data.listPage.page_count)
            return;
        var data = {
            limit: 20,
            page: this.data.listPage.page + 1,
        };
        util_1.getData("/data_service/v1/auth/application/page", {
            data: data,
            success: function (r) {
                _this.set({ list: (r.pager.page == 1 ? r.data : __spread(_this.data.list || [], r.data)) });
                _this.set({ listPage: r.pager });
            }
        });
    };
    _zhiyuans.prototype.getInfo = function () {
        var _this = this;
        util_1.getData("/data_service/v1/auth/application/selection", {
            success: function (r) {
                _this.set({ info: r.data });
            }
        });
    };
    _zhiyuans.prototype.onInit = function () {
        var _this = this;
        this.getList();
        this.getInfo();
        util_1.event.on(this, "zhiyuanTest", function () {
            _this.data.listPage = { page: 0, page_count: 1 };
            _this.getList();
        });
    };
    return _zhiyuans;
}(util_1.BasePage));
Page(new _zhiyuans());
