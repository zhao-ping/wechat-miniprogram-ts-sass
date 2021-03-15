import { BasePage, getData } from '../../../utilTs/util';
// miniprogram/pages/article/suxueTypes/suxueTypes.js
class _suxueTypes extends BasePage{
  data={
    classId:null,
    currentType:{k:null,v:null},
    types:null,
    rank_all_type:null,
    scrollTop:0,
    stickys:[],
    list:null,
    listPage:{
      page:0,
      page_count:1,
    }
  }
  changeType(e:any){
    const dataset=e.currentTarget.dataset;
    this.set({currentType:dataset.item||{k:null,v:-1}});
    this.set({listPage:{page:0,page_count:1}});
    this.getList();
    this.set({scrollTop:0})
  }
  getTypes(class_id:number){
    getData(`/static_service/v1/auth/quality_article/class`,{
      success:(r:any)=>{
        this.set({types:r.data});
        let current=r.data.find((item:any)=>item.v==class_id)||{v:-1};
        console.log(current)
        this.set({currentType:current});
        this.getList();
      }
    })
  }
  getList(){
    if(this.data.listPage.page>=this.data.listPage.page_count) return;
    let data={
      page:this.data.listPage.page+1,
      article_class_id:this.data.currentType.v,
    }
    getData(`/static_service/v1/auth/quality_article/list`,{
      data,
      success:(r:any)=>{
        if(r.pager.page==1) {
          this.set({list:r.data})
        }else{
          //@ts-ignore
          this.data.list.list=[...this.data.list.list,...r.data.list];
          this.set({list:this.data.list});
        }
        this.set({listPage:r.pager})
      }
    })
  }
  onInit(e:any){
    this.set({classId:e.article_class_id});
    this.getTypes(e.article_class_id);
  }
}
Page(new _suxueTypes());