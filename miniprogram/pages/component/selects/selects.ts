// pages/component/selects/selects.js
namespace selects{
  export type Value={
    k:string;
    v:number;
    key:string,
    default_index:number,
    values:Value[],
  }
}
Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    searchList:{
      type:Array
    }
  },
  data: {
    search_list:[],
    objectMultiArray:[],
    multiIndex: [],
    multiKey:[],
  },
  methods: {
    bindMultiPickerChange(e:any){
      let filters:any={};
      this.data.objectMultiArray.map((items:selects.Value[],i:number)=>{
        filters[this.data.multiKey[i]]=items[this.data.multiIndex[i]].v;
      })
      this.triggerEvent('done',filters,{});
    },
    bindMultiPickerColumnChange(e:any){
      let {column,value:index}=e.detail;
      //@ts-ignore
      this.data.multiIndex[column]=index;
      // 重置下级筛选条件
      let filters:selects.Value=this.data.objectMultiArray[column][index];
      var setFilter=(filters:selects.Value)=>{
        if(!filters.values) return;
        column=column+1;
        //@ts-ignore
        this.data.objectMultiArray[column]=filters.values;
        //@ts-ignore
        this.data.multiIndex[column]=filters.default_index||0;
        if(filters.values){
          filters=filters.values[this.data.multiIndex[column]];
          if(filters.values){
            setFilter(filters);
          }
        }
      }
      setFilter(filters);
      this.setData({objectMultiArray:this.data.objectMultiArray});
      this.setData({multiIndex:this.data.multiIndex});
    },
    init(){
      let search_list:selects.Value[]=JSON.parse(JSON.stringify(this.data.searchList));
      let multiIndex:number[]=[];
      let objectMultiArray:selects.Value[][]=[];
      let multiKey:string[]=[];
      let filters=search_list[0];
      var setFilter=(filters:selects.Value)=>{
        let items:selects.Value[]=filters.values;
        objectMultiArray.push(items);
        multiIndex.push(filters.default_index);
        multiKey.push(filters.key);
        filters=filters.values[filters.default_index];
        if(filters.values){
          setFilter(filters);
        }
      }
      setFilter(filters);
      this.setData({objectMultiArray});
      this.setData({multiIndex});
      this.setData({multiKey});
    }
  },
  created(){
    
  },
  attached(){
    this.init();
  },
  ready(){
    
  },
})
