import { BasePage, getData, translateArticleContent } from '../../../utilTs/util';
// miniprogram/pages/article/suxueDetail/suxueDetail.js
let info:any;
class _suxueDetail extends BasePage {
  data = {
    info,
    nodes:[],
  };
  tapContent(e: any) {
    console.log(e);
  }
  collection(){
    let checked=this.data.info.article_detail.is_collentions;
    getData(`/static_service/v1/auth/quality_article/${this.data.info.article_detail.article_id}/collection`,{
      method:"PUT",
      data:{type:checked?2:1},
      success:(r:any)=>{
        if(checked){
          this.data.info.article_detail.is_collentions=false;
          this.data.info.article_detail.collections--;
        }else{
          this.data.info.article_detail.is_collentions=true;
          this.data.info.article_detail.collections++;
        }
        this.set({info:this.data.info});
      }
    })
  }
  zan() {
    let checked=this.data.info.article_detail.is_thumbs
    getData(`/static_service/v1/auth/quality_article/${this.data.info.article_detail.article_id}/thumb`,{
      method:"PUT",
      data:{type:checked?2:1},
      success:(r:any)=>{
        if(checked){
          this.data.info.article_detail.is_thumbs=false;
          this.data.info.article_detail.thumbs--;
        }else{
          this.data.info.article_detail.is_thumbs=true;
          this.data.info.article_detail.thumbs++;
        }
        this.set({info:this.data.info});
      }
    })
  }
  getInfo(article_id: number) {
    getData(`/static_service/v1/auth/quality_article/${article_id}/detail`, {
      success: (r: any) => {
        r.data.article_detail.content = translateArticleContent(
          r.data.article_detail.content
        );
        this.set({ info: r.data });
      },
    });
  }
  onInit(e: any) {
    this.getInfo(e.article_id);
  }
}
Page(new _suxueDetail());
