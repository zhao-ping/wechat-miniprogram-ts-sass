import { getData , translateArticleContent} from '../../../../utilTs/util';
// miniprogram/pages/user/question/question/question.js
Page({
  data:{
    info:null,
  },
  getInfo(article_id:number){
    getData(`/static_service/v1/allow/article/info`,{
      data:{article_id},
      success:(r:any)=>{
        wx.setNavigationBarTitle({title:r.data.article_class_name});
        r.data.article_content=translateArticleContent(r.data.article_content);
        this.setData({info:r.data});
      }
    })
  },
  onLoad(e:any){
    this.getInfo(e.article_id)
  }
})