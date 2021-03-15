"use strict";
Component({
    options: {
        addGlobalClass: true,
    },
    properties: {
        searchList: {
            type: Array
        }
    },
    data: {
        search_list: [],
        objectMultiArray: [],
        multiIndex: [],
        multiKey: [],
    },
    methods: {
        bindMultiPickerChange: function (e) {
            var _this = this;
            var filters = {};
            this.data.objectMultiArray.map(function (items, i) {
                filters[_this.data.multiKey[i]] = items[_this.data.multiIndex[i]].v;
            });
            this.triggerEvent('done', filters, {});
        },
        bindMultiPickerColumnChange: function (e) {
            var _this = this;
            var _a = e.detail, column = _a.column, index = _a.value;
            this.data.multiIndex[column] = index;
            var filters = this.data.objectMultiArray[column][index];
            var setFilter = function (filters) {
                if (!filters.values)
                    return;
                column = column + 1;
                _this.data.objectMultiArray[column] = filters.values;
                _this.data.multiIndex[column] = filters.default_index || 0;
                if (filters.values) {
                    filters = filters.values[_this.data.multiIndex[column]];
                    if (filters.values) {
                        setFilter(filters);
                    }
                }
            };
            setFilter(filters);
            this.setData({ objectMultiArray: this.data.objectMultiArray });
            this.setData({ multiIndex: this.data.multiIndex });
        },
        init: function () {
            var search_list = JSON.parse(JSON.stringify(this.data.searchList));
            var multiIndex = [];
            var objectMultiArray = [];
            var multiKey = [];
            var filters = search_list[0];
            var setFilter = function (filters) {
                var items = filters.values;
                objectMultiArray.push(items);
                multiIndex.push(filters.default_index);
                multiKey.push(filters.key);
                filters = filters.values[filters.default_index];
                if (filters.values) {
                    setFilter(filters);
                }
            };
            setFilter(filters);
            this.setData({ objectMultiArray: objectMultiArray });
            this.setData({ multiIndex: multiIndex });
            this.setData({ multiKey: multiKey });
        }
    },
    created: function () {
    },
    attached: function () {
        this.init();
    },
    ready: function () {
    },
});
