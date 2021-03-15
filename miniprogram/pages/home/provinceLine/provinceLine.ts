import { getData, BasePage } from '../../../utilTs/util';
// miniprogram/pages/home/provinceLine/provinceLine.js
class _provinceLine extends BasePage{
  data={
    info:null,
  }
  getInfo(){
    getData(`/data_service/v1/allow/province/admit_line`,{
      success:(r:any)=>{
        this.set({info:r.data});
        wx.setNavigationBarTitle({title:r.data.province_name+'历年批次线'})
      }
    })
  }
  onInit(){
    this.getInfo();
  }
}
Page(new _provinceLine())