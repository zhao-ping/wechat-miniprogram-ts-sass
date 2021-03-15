import { getData, BasePage } from '../../../utilTs/util';
// miniprogram/pages/major/schools/schools.js
class _schools extends BasePage{
  data={
    major_id:null,
    search:null,
    info:null,
    list:null,
    listPage:{
      page:0
    },
    filter:{
      count:0,
      filters:{}
    },
  }
  showFilter(){
    let c:any=this.getComp("#schoolFilter");
    c.toShow();
  }
  getSearch(major_id:number){
    getData(`/static_service/v1/allow/major/setting_school/search`,{
      data:{major_id},
      success:(r:any)=>{
        this.set({search:r.data.search_list});
      }
    })
  }
  getList(option?:any){
    let filter:any;
    if(option?.detail?.filters){
      filter=option.detail;
      this.set({filter:filter});
      this.data.listPage.page=0;
      //@ts-ignore
      this.data.search.map((item:any)=>{
        item.default_value=filter.default_values[item.key];
      });
      this.set({search:this.data.search});
    }
    // this.provinceScroll();
    let data:any={
      page:this.data.listPage?.page+1,
    }
    data={...data,...this.data.filter.filters};
    getData(`/static_service/v1/allow/major/${this.data.major_id}/setting_school`,{
      data,
      success:(r:any)=>{
        if(this.data.listPage.page==0){
          this.set({list:r.data.school_list});
          this.set({info:{major_info:r.data.major_info}});
        }else{
          this.set({list:[...this.data.list||[],...r.data.school_list]});
        }
        this.set({listPage:r.pager});
      }
    })
  }
  onInit(e:any){
    this.set({major_id:e.major_id})
    this.getSearch(e.major_id);
    this.getList();
  }
}
Page(new _schools());