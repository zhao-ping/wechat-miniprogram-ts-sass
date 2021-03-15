import { getData } from '../../../utilTs/util';
// miniprogram/pages/school/plan/plan.js
Page({
  data:{
    info:null,
  },
  getInfo(id:number){
    getData(`/static_service/v1/allow/school/admissions_guide/${id}`,{
      success:(r:any)=>{
        this.setData({info:r.data});
      }
    })
  },
  onLoad(options:any){
    this.getInfo(options.id);
  }
})