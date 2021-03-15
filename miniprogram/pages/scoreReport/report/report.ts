import { getData, event } from '../../../utilTs/util';
import { PopupInfoBase } from '../../../utilTs/popupInfo.base';
let info:any;
class _scoreReport extends PopupInfoBase{
  data={
    info,
    directiveTab:0,//努力方向tab选中项
  }
  download(){
    wx.showLoading({title:`加载中，请稍后···`});
    getData(`/data_service/v1/auth/grade/report/pdf`,{
      success:(r:any)=>{
        wx.downloadFile({
          url: r.data.report_url,
          success: function (res) {
            const filePath = res.tempFilePath
            wx.openDocument({
              filePath: filePath,
              success: function (res) {
                wx.hideLoading();
              }
            })
          }
        })
      }
    })
  }
  changeDirectiveTab(e:any){
    const dataset=e.currentTarget.dataset;
    this.set({directiveTab:dataset.index})
  }
  getInfo(){
    getData(`/data_service/v1/auth/grade/report`,{
      success:(r:any)=>{
        this.set({info:r.data});
        wx.setNavigationBarTitle({title:this.data.info.base_info.title});
      }
    })
  }
  onInit(){
    this.getInfo();
    event.on(this,['setNewTargetSchool','updateScoreNature'],()=>{
      this.getInfo()
    })
  }
}
Page(new _scoreReport('',0));