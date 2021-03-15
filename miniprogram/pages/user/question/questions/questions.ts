import { getData } from '../../../../utilTs/util';

// miniprogram/pages/user/question/questions/questions.js
Page({
  data:{
    info:null,
    items:null,
    tabIndex:0,
  },
  changeTabIndex(e:any){
    this.setData({tabIndex:e.detail});
  },
  getInfo(){
    getData(`/static_service/v1/allow/article/question/list`,{
      success:(r:any)=>{
        let items:string[]=r.data.map((item:any)=>item.article_class_name);
        this.setData({items:items});
        this.setData({info:r.data});
      }
    })
  },
  onLoad(){
    this.getInfo();
  }
})