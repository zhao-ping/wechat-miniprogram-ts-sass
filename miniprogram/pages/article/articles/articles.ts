import { getData, BasePage } from '../../../utilTs/util';
// miniprogram/pages/article/articles/articles.js
class _articles extends BasePage{
  data={
    types:null,
    typesIndex:wx.getStorageSync("articleTab")||0,
    scrollTop:0,
    list:[],
    listPage:{
      page:0,
      page_count:1,
    },
  }
  changeTab(e:any){
    wx.setStorageSync("articleTab",e.detail||0);
    this.data.typesIndex=e.detail||0;
    this.data.listPage.page=0;
    this.getList();
  }
  getType(){
    getData(`/static_service/v1/allow/article/normal/class`,{
      success:(r:any)=>{
        this.set({types:r.data});
        this.getList();
      }
    })
  }
  getList(){
    let {page,page_count}=this.data.listPage;
    if(page>=page_count){
      return;
    }
    const data={
      //@ts-ignore
      article_class_id:this.data.types[this.data.typesIndex].v,
      page:this.data.listPage.page+1,
    }
    getData(`/static_service/v1/allow/article/normal/page`,{
      data,
      success:(r:any)=>{
        if(r.pager.page<=1){
          this.data.list=[];
          this.set({scrollTop:0});
        }
        let list=[...this.data.list,...r.data];
        this.set({list:list});
        this.set({listPage:r.pager});
      }
    })
  }
  onInit(){
    this.getType();
  }
}
Page(new _articles())