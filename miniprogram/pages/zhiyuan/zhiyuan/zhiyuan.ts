// miniprogram/pages/zhiyuan/zhiyuan/zhiyuan.js
import { getData, event, GlobalUserInfoPage } from '../../../utilTs/util';
const app:any=getApp();
class _zhiyuan extends GlobalUserInfoPage{
  constructor(){
    super();
    this.data={
      ...this.data,
      info:null,
      safeTop:null,
    }
  }
  getZhiyuanInfo(){
    // 获取用户信息 获取不到会根据code==101跳转登录页
    getData("/data_service/v1/auth/application/total_info",{
        success:(r:any)=>{
          this.set({info:r.data});
          app.globalData.user_info={...app.globalData.user_info,...r.data}
        }
    })
  }
  onInit(){
    this.getZhiyuanInfo();
    event.on(this,"updateUserInfo,batchMajor,beixuanSchool,beixuanMajor,zhiyuan",this.getZhiyuanInfo);
  }
  onShow(){
    wx.getSystemInfo({
      success:(r:any)=>{
        this.set({safeTop:r.safeArea.top+'px'});
      }
    })
  }
}
Page(new _zhiyuan())