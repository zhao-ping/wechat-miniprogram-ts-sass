import { BasePage, getData } from '../../../utilTs/util';
class _videos extends BasePage{
  data={
    playingVideoIndex:null,
    types:null,
    tabIndex:0,
    list:null,
    listPage:{
      page:0,page_count:1
    }
  }
  /**
   * 查看视频详情
   */
  videoDetail(e:any){
    let {index}=this.getElDataSet(e);
    //@ts-ignore
    let video=this.data.list[index];
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
            pre_video_id:this.data.list[this.data.playingVideoIndex].video_id,
            video_id:video.video_id,
          }
        })
      }
      this.set({playingVideoIndex:index});
    }
  }
  /**
   * 切换选项卡
   * @param data tab组件传回的参数
   */
  changeTab(data:any){
    //@ts-ignore
    this.set({tabIndex:data.detail});
    this.set({list:null});
    this.set({listPage:{page:0,page_count:1}});
    this.getList();
  }
  /**
   * 获取视频类型
   */
  getTypes(){
    getData(`/static_service/v1/auth/video/title`,{
      success:(r:any)=>{
        this.set({types:r.data});
        this.set({type:r.data[0]});
        this.getList();
      }
    })
  }
  /**
   * 获取视频列表
   */
  getList(){
    if(this.data.listPage.page>=this.data.listPage.page_count) return;
    getData(`/static_service/v1/auth/video/page`,{
      data:{
        limit:5,
        page:this.data.listPage.page+1,
        //@ts-ignore
        class_id:this.data.types[this.data.tabIndex].class_id,
      },
      success:(r:any)=>{
        if(r.pager.page==1){
          this.data.list=r.data;
        }else{
          //@ts-ignore
          this.data.list=[...this.data.list,...r.data];
        }
        this.set({list:this.data.list});
        this.set({listPage:r.pager});
      }
    })
  }
  onInit(){
    this.getTypes();
  }
}
Page(new _videos());