import { getData, GlobalUserInfoPage } from '../../../utilTs/util';
// miniprogram/pages/school/exceedMajor/exceedMajor.js
class _page extends GlobalUserInfoPage{
  data={
    tab:0,
    tabItems:null,
    info:null,
  }
  changeTab(e:any){
    this.set({tab:e.detail});
  }
  getInfo(data:any){
    getData(`/data_service/v1/auth/probability/${data.school_id}/enroll_evaluation/exceed_major_list`,{
      data,
      success:(r:any)=>{
        this.set({tabItems:[`超过的专业 ${r.data.exceed_major_list.length}`,`未超过的专业 ${r.data.not_exceed_major_list.length}`]});
        this.set({info:r.data});
      }
    })
  }
  onInit(e:any){
    this.getInfo(e);
  }
}
Page(new _page())