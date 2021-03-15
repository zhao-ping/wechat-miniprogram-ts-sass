// pages/component/schoolFilter/schoolFilter.js
type Filter={
  key:string,
  type:number,
  sub:string,
  default_value:Value,
  values:Value[],
};
type Value={
  k:string,
  v:number,
  pv:number,
  checked:boolean,
}
let search_list:Array<Filter>=[];
let history_search_list:Array<Filter>=[];

Component({
  options: {
    addGlobalClass:true,
  },
  properties: {
    submitOnHide:{
      type:Boolean,
    },
    filters: {
      type:Array,
      value: []
    },
  },
  data: {
    search_list:search_list,
  },
  ready: function() {
    this.initFilters();
  },
  methods: {
    chooseFilter(e:any):void{
      let dataset:any=e.currentTarget.dataset;
      this.setFilter(dataset.filtersIndex,dataset.filterIndex)
      // const filtersIndex=
    },
    setFilter(first:number|string,filterIndex:number|any):void{
      let filtersIndex:number=0;
      if(typeof(first)=="string"){
        const firstIndex:number=this.data.search_list.findIndex((f:any)=>f.key==first);
        if(firstIndex==-1){
          filtersIndex=0;
        }else{
          filtersIndex=firstIndex;
        }
      }else{
        filtersIndex=first;
      }
      if(typeof filterIndex != "number"){
        filterIndex=this.data.search_list[filtersIndex].values.findIndex((item:any)=>item.v==filterIndex.v);
      }
      let filters:Filter[]=this.data.search_list;
      if(filters[filtersIndex].type==0){
        // 单选
        filters[filtersIndex].default_value=filters[filtersIndex].values[filterIndex];
        this.setData({search_list:filters});
        if(filters[filtersIndex].sub){
          this.resetFilters(filters[filtersIndex]);
        }
      }else{
        // 多选
        if(filters[filtersIndex].values[filterIndex].v==0){
          // 不限
          filters[filtersIndex].values.map((f:Value)=>{
            f.checked=false;
          })
          filters[filtersIndex].values[0].checked=true;
        }else{
          // 其他
          if(filters[filtersIndex].values[filterIndex].checked){
            // 取消选中
            if(filters[filtersIndex].values.filter((f:Value)=>f.checked).length==1){
              filters[filtersIndex].values[0].checked=true;
            }
            filters[filtersIndex].values[filterIndex].checked=false;
          }else{
            // 选中
            filters[filtersIndex].values[0].checked=false;
            filters[filtersIndex].values[filterIndex].checked=true;
          }
        }
        this.setData({search_list:filters});
      }
    },
    resetFilters(parentFilter:Filter):void{
      // 下级联动重置子选项
      let subs=parentFilter.sub.split(",");
      subs.map((sub:string)=>{
        let childIndex=this.data.search_list.findIndex((f:Filter)=>f.key==sub);
        if(childIndex){
          //设置子元素内容
          let baseFilters=JSON.parse(JSON.stringify(this.data.filters))
          let fIndex:number=baseFilters.findIndex((f:any)=>f.key==sub);
          let thisFilters:Filter;
          if(fIndex!=-1){
            thisFilters=baseFilters[fIndex] as Filter;
            let values:Value[]=[];
            thisFilters.values.map(f=>{
              if(f.pv==parentFilter.default_value.v){
                values.push(f);
              }
            })
            if(values.length>0){
              thisFilters.default_value=values[0];
            }
            thisFilters.values=values;
            this.data.search_list[childIndex]=thisFilters;
            if(values.length>0&&thisFilters.sub){
              this.resetFilters(thisFilters);
            }
          }
        }
      })
      this.setData({search_list:this.data.search_list});
    },
    initFilters():void{
      // 初始化filter
      this.data.filters.map((f:any)=>{
        if(f.type!=0){
          // 多选
          f.values.map((item:Value)=>{
            if(item.v==0){
              item.checked=true;
            }else{
              item.checked=false;
            }
          })
        }
      })
      this.setData({search_list:JSON.parse(JSON.stringify(this.data.filters))});
      this.data.search_list.map((f:Filter)=>{
        if(f.sub){
          this.resetFilters(f);
        }
      })
    },
    toShow():void{
      history_search_list=JSON.parse(JSON.stringify(this.data.search_list));
      let bottomInContainer:any=this.selectComponent("#bottomInContainer");
      bottomInContainer.toShow();
    },
    hideByModal(){
      if(this.data.submitOnHide){
        this.submit();
      }else{
        this.setData({search_list:JSON.parse(JSON.stringify(history_search_list))});
        this.toHide();
      }
    },
    toHide():void{
      let bottomInContainer:any=this.selectComponent("#bottomInContainer");
      bottomInContainer.toHide(false);
    },
    getFilters(){
      let filters:any={}
      let default_values:any={};
      let count=0;
      let filterStrs:string[]=[];
      this.data.search_list.map((f:Filter)=>{
        default_values[f.key]=f.default_value;
        if(f.type==0){
          // 单选
          filters[f.key]=f.default_value.v;
          if(f.default_value.v!=0){
            count++;
            filterStrs.push(f.default_value.k);
          }
        }else{
          // 多选
          if(f.values[0].checked){
            filters[f.key]=0;
          }else{
            let checkedItems=f.values.filter(f=>f.checked)
            filters[f.key]=checkedItems.map(f=>f.v).join('|');
            filterStrs.push(checkedItems.map(f=>f.k).join('|'));
            count+=checkedItems.length;
          }
        }
      })
      return {count,filters,default_values,filterStr:filterStrs.join(' + '),};
    },
    submit():void{
      let filters=this.getFilters();
      this.toHide();
      this.triggerEvent('done', filters,{});
    }
  }
})
