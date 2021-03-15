"use strict";
var search_list = [];
var history_search_list = [];
Component({
    options: {
        addGlobalClass: true,
    },
    properties: {
        submitOnHide: {
            type: Boolean,
        },
        filters: {
            type: Array,
            value: []
        },
    },
    data: {
        search_list: search_list,
    },
    ready: function () {
        this.initFilters();
    },
    methods: {
        chooseFilter: function (e) {
            var dataset = e.currentTarget.dataset;
            this.setFilter(dataset.filtersIndex, dataset.filterIndex);
        },
        setFilter: function (first, filterIndex) {
            var filtersIndex = 0;
            if (typeof (first) == "string") {
                var firstIndex = this.data.search_list.findIndex(function (f) { return f.key == first; });
                if (firstIndex == -1) {
                    filtersIndex = 0;
                }
                else {
                    filtersIndex = firstIndex;
                }
            }
            else {
                filtersIndex = first;
            }
            if (typeof filterIndex != "number") {
                filterIndex = this.data.search_list[filtersIndex].values.findIndex(function (item) { return item.v == filterIndex.v; });
            }
            var filters = this.data.search_list;
            if (filters[filtersIndex].type == 0) {
                filters[filtersIndex].default_value = filters[filtersIndex].values[filterIndex];
                this.setData({ search_list: filters });
                if (filters[filtersIndex].sub) {
                    this.resetFilters(filters[filtersIndex]);
                }
            }
            else {
                if (filters[filtersIndex].values[filterIndex].v == 0) {
                    filters[filtersIndex].values.map(function (f) {
                        f.checked = false;
                    });
                    filters[filtersIndex].values[0].checked = true;
                }
                else {
                    if (filters[filtersIndex].values[filterIndex].checked) {
                        if (filters[filtersIndex].values.filter(function (f) { return f.checked; }).length == 1) {
                            filters[filtersIndex].values[0].checked = true;
                        }
                        filters[filtersIndex].values[filterIndex].checked = false;
                    }
                    else {
                        filters[filtersIndex].values[0].checked = false;
                        filters[filtersIndex].values[filterIndex].checked = true;
                    }
                }
                this.setData({ search_list: filters });
            }
        },
        resetFilters: function (parentFilter) {
            var _this = this;
            var subs = parentFilter.sub.split(",");
            subs.map(function (sub) {
                var childIndex = _this.data.search_list.findIndex(function (f) { return f.key == sub; });
                if (childIndex) {
                    var baseFilters = JSON.parse(JSON.stringify(_this.data.filters));
                    var fIndex = baseFilters.findIndex(function (f) { return f.key == sub; });
                    var thisFilters = void 0;
                    if (fIndex != -1) {
                        thisFilters = baseFilters[fIndex];
                        var values_1 = [];
                        thisFilters.values.map(function (f) {
                            if (f.pv == parentFilter.default_value.v) {
                                values_1.push(f);
                            }
                        });
                        if (values_1.length > 0) {
                            thisFilters.default_value = values_1[0];
                        }
                        thisFilters.values = values_1;
                        _this.data.search_list[childIndex] = thisFilters;
                        if (values_1.length > 0 && thisFilters.sub) {
                            _this.resetFilters(thisFilters);
                        }
                    }
                }
            });
            this.setData({ search_list: this.data.search_list });
        },
        initFilters: function () {
            var _this = this;
            this.data.filters.map(function (f) {
                if (f.type != 0) {
                    f.values.map(function (item) {
                        if (item.v == 0) {
                            item.checked = true;
                        }
                        else {
                            item.checked = false;
                        }
                    });
                }
            });
            this.setData({ search_list: JSON.parse(JSON.stringify(this.data.filters)) });
            this.data.search_list.map(function (f) {
                if (f.sub) {
                    _this.resetFilters(f);
                }
            });
        },
        toShow: function () {
            history_search_list = JSON.parse(JSON.stringify(this.data.search_list));
            var bottomInContainer = this.selectComponent("#bottomInContainer");
            bottomInContainer.toShow();
        },
        hideByModal: function () {
            if (this.data.submitOnHide) {
                this.submit();
            }
            else {
                this.setData({ search_list: JSON.parse(JSON.stringify(history_search_list)) });
                this.toHide();
            }
        },
        toHide: function () {
            var bottomInContainer = this.selectComponent("#bottomInContainer");
            bottomInContainer.toHide(false);
        },
        getFilters: function () {
            var filters = {};
            var default_values = {};
            var count = 0;
            var filterStrs = [];
            this.data.search_list.map(function (f) {
                default_values[f.key] = f.default_value;
                if (f.type == 0) {
                    filters[f.key] = f.default_value.v;
                    if (f.default_value.v != 0) {
                        count++;
                        filterStrs.push(f.default_value.k);
                    }
                }
                else {
                    if (f.values[0].checked) {
                        filters[f.key] = 0;
                    }
                    else {
                        var checkedItems = f.values.filter(function (f) { return f.checked; });
                        filters[f.key] = checkedItems.map(function (f) { return f.v; }).join('|');
                        filterStrs.push(checkedItems.map(function (f) { return f.k; }).join('|'));
                        count += checkedItems.length;
                    }
                }
            });
            return { count: count, filters: filters, default_values: default_values, filterStr: filterStrs.join(' + '), };
        },
        submit: function () {
            var filters = this.getFilters();
            this.toHide();
            this.triggerEvent('done', filters, {});
        }
    }
});
