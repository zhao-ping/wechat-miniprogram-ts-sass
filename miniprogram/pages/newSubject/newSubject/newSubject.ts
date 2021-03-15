import { getData,  BasePage } from '../../../utilTs/util';
class _newSubject extends BasePage{
  data={
    info:null,
  }
  getInfo(){
    getData(`/data_service/v1/auth/choose_subject/can_choose/index`,{
      data:{type_id:2},
      success:(r:any)=>{
        wx.setStorage({
          key:"newSubjectBaseInfo",
          data:r.data,
        })
        this.set({info:r.data})
      }
    })
  }
  onLoad(){
    this.getInfo();
  }
}
Page(new _newSubject())