import { GlobalUserInfoPage, getData, event } from '../../../utilTs/util';
class _singleScore extends GlobalUserInfoPage{
  constructor(){
    super();
    this.data={
      ...this.data,
      info:null,
    }
  }
  submit(){
    getData(`/user_service/v1/auth/score_nature/single_score`,{
      method:"POST",
      data:this.data.info.score_info,
      success:(r:any)=>{
        this.toast("设置成功");
        event.push("updateScoreNature")
        setTimeout(() => {
          wx.navigateBack();
        }, 1000);
      }
    })
  }
  change(e:any){
    let dataset=e.currentTarget.dataset
    this.data.info.score_info[dataset.index].score=e.detail?Number(e.detail):null;
    this.set({info:this.data.info});
  }
  getInfo(){
    getData(`/user_service/v1/auth/score_nature/single_score`,{
      success:(r:any)=>{
        r.data.score_info.map((item:any)=>{
          item.score=item.score?item.score:null;
        })
        this.set({info:r.data});
      }
    })
  }
  onInit(){
    this.getInfo();
  }
}
Page(new _singleScore())