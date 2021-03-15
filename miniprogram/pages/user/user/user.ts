// miniprogram/pages/home/home.js
import { getData, event, GlobalUserInfoPage} from '../../../utilTs/util';
const app:any=getApp();
class _user extends GlobalUserInfoPage{
  constructor(){
    super();
    this.data={
      ...this.data,
      info:null,
    }
  }
  getUserInfo(){
    // 获取用户信息 获取不到会根据code==101跳转登录页
    getData("/user_service/v1/auth/user/info",{
        success:(r:any)=>{
          this.set({info:r.data});
          app.globalData.user_info={...app.globalData.user_info,...r.data}
        }
    })
  }
  onInit(){
    this.getUserInfo();
    event.on(this,"updateUserInfo",this.getUserInfo);
  }
  onShow(){
    this.set({unreadCount:app.timInfo.unreadCount})
  }
}
Page(new _user())