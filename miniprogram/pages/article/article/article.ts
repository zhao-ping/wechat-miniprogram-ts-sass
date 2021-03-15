import { getData, translateArticleContent, BasePage } from '../../../utilTs/util';
// miniprogram/pages/article/article/article.js
class _article extends BasePage{
  data={
    info:null,
  }
  getInfo(article_id:number){
    getData(`/static_service/v1/allow/article/info`,{
      data:{article_id:article_id},
      success:(r:any)=>{
        r.data.article_content=translateArticleContent(r.data.article_content);
        this.set({info:r.data});
      }
    })
  }
  onInit(e:any){
    this.getInfo(parseInt(e.article_id));
  }}
Page(new _article());