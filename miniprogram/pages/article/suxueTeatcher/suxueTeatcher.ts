import { BasePage, getData } from '../../../utilTs/util';
// miniprogram/pages/article/suxueTypes/suxueTypes.js
class _suxueTypes extends BasePage{
  data={
    author_id:null,
    list:null,
    listPage:{
      page:0,
      page_count:1,
    }
  }
  getList(){
    if(this.data.listPage.page>=this.data.listPage.page_count) return;
    getData(`/static_service/v1/auth/quality_article/list`,{
      data:{page:this.data.listPage.page+1,author_id:this.data.author_id},
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
    this.set({author_id:e.author_id});
    this.getList()
  }
}
Page(new _suxueTypes());