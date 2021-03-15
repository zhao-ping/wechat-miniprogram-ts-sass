import { getData, GlobalUserInfoPage, event } from '../../../utilTs/util';
let messageInterval:any;
class _home extends GlobalUserInfoPage{
  constructor(){
    super();
    this.data={...this.data,...{
      info:null,
      messageIndex:0,
      suxueRecommend:null,
      playingVideoIndex:null,
    }}
  }
  /**
   * 播放视频
   */
  changeVideo(e:any){
    let {index}=this.getElDataSet(e);
    //@ts-ignore
    let video=this.data.info.menu_video[index];
    if(video.is_detail){
      //跳转到详情页
      wx.navigateTo({
        url:`/pages/home/video/video?video_id=${video.video_id}`,
      })
    }else{
      // 本页播放
      if(this.data.playingVideoIndex!=null){
        getData(`/static_service/v1/auth/video/play`,{
          data:{
            //@ts-ignore
            pre_video_id:this.data.info.menu_video[this.data.playingVideoIndex].video_id,
            video_id:video.video_id,
          }
        })
      }
      this.set({playingVideoIndex:index});
    }
  }
  getInfo(){
    getData(`/static_service/v1/allow/index/info`,{
      success:(r)=>{
        this.set({info:r.data});
        let messageIndex=0;
        const messageLength=this.data.info.index_message_list.length;
        messageInterval=setInterval(()=>{
          if(this.data.messageIndex<messageLength-1){
            messageIndex=this.data.messageIndex+1;
          }else{
            messageIndex=0;
          }
          this.set({messageIndex:messageIndex});
        },5000)
      }
    })
  }
  goSuxuePage(){
    wx.navigateTo({url:"/pages/article/suxueTypes/suxueTypes"});
  }
  onHide(){
    clearInterval(messageInterval)
  }
  onShow(){
    this.getSuxueRecommend();
  }
  getSuxueRecommend(){
    getData(`/static_service/v1/auth/quality_article/recommend`,{
      success:(r:any)=>{
        this.set({suxueRecommend:null});
        this.set({suxueRecommend:r.data});
      }
    })
  }
  onInit(){
    this.getInfo();
    event.on(this,"updateUserInfo",()=>{
      this.getInfo();
      this.getSuxueRecommend();
    });
  }
}
Page(new _home());