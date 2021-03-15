import { getData } from '../../../utilTs/util';
Page({
  data:{
    info:null,
  },
  getInfo(school_id:number){
    getData(`/static_service/v1/allow/school/${school_id}/campus_scenery`,{
      success:(r:any)=>{
        this.setData({info:r.data});
      }
    })
  },
  onLoad(options:any){
    this.getInfo(options.school_id);
  },
  previewImage(e:any){
    let dataset:any=e.currentTarget.dataset;
    // @ts-ignore
    let list:string[]=this.data.info.attach_list.map(item=>item.v);
    wx.previewImage({
    current: dataset.url,
    urls: list,
    success: (result)=>{
      console.log("success");
    },
    fail: ()=>{
      console.log("fail")
    },
    complete: ()=>{}
  });
  }
  
})