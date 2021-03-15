import { getData } from '../../../utilTs/util';
// miniprogram/pages/newSubject/possibleMajor/possibleMajor.js
Page({
  data:{
    default:null,
    info:null,
  },
  changeAdmit(e:any){
    let admit_order_type=e.currentTarget.dataset.admit;
    this.getInfo(admit_order_type);
  },
  getInfo(admit_order_type?:number){
    let data:any={
      limit:200,
      admit_order_type,
    };
    getData(`/data_service/v1/auth/choose_subject/can_choose`,{
      data,
      success:(r:any)=>{
        this.setData({info:r.data});
        let c:any=this.selectComponent("#percent");
        c.draw();
      }
    })
  },
  onLoad(){
    this.getInfo();
  }
})