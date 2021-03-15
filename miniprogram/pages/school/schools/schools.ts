import { getData ,GlobalUserInfoPage,transformPx} from '../../../utilTs/util';
class _schools extends GlobalUserInfoPage{
  constructor(){
    super();
    this.data={
      ...this.data,
      scrollTop:0,
    searchList:null,
    list:null,
    listPage:{
      page:0
    },
    filter:{
      count:0,
      filters:{}
    },
    province:null,
    scrollLeft:0,
    }
  }
  changeProvince(e:any){
    let dataset=e.target.dataset;
    this.data.filter.filters.prov_id=dataset.item.v;
    this.data.province.default_value=dataset.item;
    this.data.province.default_index=dataset.index;
    this.set({province:this.data.province});
    this.data.listPage.page=0;
    this.getList();
    let c:any=this.getComp("schoolFilter");
    c.setFilter("prov_id",dataset.index);
  }
  showFilter(){
    let c:any=this.getComp("schoolFilter");
    c.toShow();
  }
  getSearch(){
    getData(`/static_service/v1/allow/school/page/search`,{
      success:(r:any)=>{
        this.set({searchList:r.data});
        let i=r.data.search_list.findIndex((f:any)=>f.key=="prov_id");
        if(i!=-1){
          this.set({province:r.data.search_list[i]})
        }
      }
    })
  }
  provinceScroll(){
    if(this.data.province){
      let width= transformPx(42);
      let offset=transformPx(100);
      this.set({scrollLeft:this.data.province.default_index*(width+2)-offset});
    }
  }
  getList(option?:any){
    let filter:any;
    if(option?.detail?.filters){
      filter=option.detail;
      this.set({filter:filter});
      this.data.listPage.page=0;
      let provInedex=this.data.province.values.findIndex((prov:any)=>prov.v==filter.filters.prov_id);
      if(provInedex!=-1){
        this.data.province.default_index=provInedex;
        this.data.province.default_value=this.data.province.values[provInedex];
        this.set({province:this.data.province});
      }
    }
    // this.provinceScroll();
    let data:any={
      page:this.data.listPage?.page+1,
    }
    data={...data,...this.data.filter.filters};
    getData(`/static_service/v1/allow/school/page`,{
      data,
      success:(r:any)=>{
        if(r.pager.page==1){
          this.set({list:r.data});
        }else{
          this.set({list:[...this.data.list||[],...r.data]});
        }
        this.set({listPage:r.pager});
        if(r.pager.page==1){
          this.set({scrollTop:0});
        }
      }
    })
  }
  onShow(){
    this.getSearch();
    this.getList();
  }
  onReachBottom(){
    this.getList();
  }
}
Page(new _schools())