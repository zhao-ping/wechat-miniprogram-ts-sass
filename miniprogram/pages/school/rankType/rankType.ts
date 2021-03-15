import { getData } from '../../../utilTs/util';
// miniprogram/pages/school/rankType/rankType.js
Page({
  data:{
    tab:0,
    info:null,
  },
  changeTab(e:any){
    this.setData({tab:e.detail});
  },
  getInfo(){
    getData(`/static_service/v1/allow/school/rank/from_list`,{
      success:(r:any)=>{
        this.setData({info:r.data});
      }
    })
  },
  onLoad(){
    this.getInfo();
  }
})