import { getData, BasePage } from '../../../utilTs/util';
class _video extends BasePage{
  data={
    video_id:null,
    info:null,
    list:null,
    index:0,
    activeId:null,
    scrollViewHeight:null,
  }
  change(e:any){
    let {video}=this.getElDataSet(e);
    getData(`/static_service/v1/auth/video/play`,{
      data:{
        pre_video_id:this.data.video_id,
        video_id:video.video_id,
      }
    })
    wx.redirectTo({
      url:`/pages/home/video/video?video_id=${video.video_id}`
    })
  }
  getInfo(video_id:number){
    getData(`/static_service/v1/auth/video/detail`,{
      data:{video_id},
      success:(r:any)=>{
        let id=r.data.current_video.video_id;
        let index=r.data.topic_list.list.findIndex((item:any)=>item.video_id==id);
        this.set({activeId:r.data.current_video.video_id});
        let list:any[]=[];
        r.data.topic_list.list.map((item:any)=>{
          list.push({id:item.video_id,url:item.url,objectFit:"contain"})
        });
        this.set({list:list});
        this.set({info:r.data});
        this.set({index:index});
        this.setHeight();
      }
    })
  }
  onInit(e:any){
    this.set({video_id:e.video_id});
    this.getInfo(e.video_id);
  }
  setHeight(){
    setTimeout(() => {
      let app:any=getApp();
      let query=wx.createSelectorQuery();
      query.select("#video").boundingClientRect((r:any)=>{
        let h=app.systemInfo.windowHeight-r.height;
        this.set({scrollViewHeight:h})
      }).exec()
    }, 10);
  }
  onShow(){
    
  }
}
Page(new _video())