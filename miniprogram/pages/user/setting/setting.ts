import { getData, toast, GlobalUserInfoPage, event } from '../../../utilTs/util';
const app:any=getApp();
// user_state   1待绑定电话号码 2待设置密码 3可修改密码
class _setting extends GlobalUserInfoPage{
  constructor(){
    super();
  }
  logout(){
    app.conf.requestHeader.token="";
    this.clearSomeStorage();
    wx.navigateTo({url:"/pages/login/login/login"});
  }
  logoff(){
    if(this.data.globalUserInfo.user_state!=1){
      // 绑定过手机号
      wx.navigateTo({url:`/pages/user/logoff/logoff`});
    }else{
      // 没绑定手机号的用户直接注销
      wx.showModal({
        title:"",
        content:"注销帐号后，你的信息、付费内容以及权益都将失效！你确定要注销吗",
        success:()=>{
          getData(`/user_service/v1/auth/user/logoff`,{
            method:"DELETE",
            success:(r:any)=>{
              toast("您已成功注销账户");
              app.conf.requestHeader.token="";
              this.clearSomeStorage();
              setTimeout(() => {
                wx.navigateTo({url:"/pages/login/login/login"});
              }, 2000);
            }
          })
        }
      })
    }
  }
  onInit(){
    event.on(this,"updateUserState",()=>{
      this.set({globalUserInfo:app.globalData.user_info});
    })
  }
}

Page(new _setting())