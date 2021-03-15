import { getData, event, GlobalUserInfoPage } from '../../../utilTs/util';
// miniprogram/pages/user/bindMobile/bindMobile.js
class _bindMobile extends GlobalUserInfoPage{
  constructor(){
    super();
    this.data={
      ...this.data,
      step:1,
      mobile:null,
      code:"",
      lastTime:0,
    }
  }
  
  submit(){
    if(!this.data.code){
      this.toast("请输入验证码");
      return;
    }
    getData(`/user_service/v1/auth/user/bind_mobile`,{
      method:"PUT",
      data:{mobile:this.data.mobile,code:this.data.code},
      success:(r:any)=>{
        this.toast("您已成功绑定手机号！");
        this.getGlobalUserInfo(()=>{
          event.push("updateUserState");
        })
        setTimeout(()=>{
          wx.navigateBack();
        },1500)
      }
    })
  }
  getCode(){
    getData(`/user_service/v1/allow/msg/send`,{
      method:"POST",
      data:{mobile:this.data.mobile,type:1,},
      success:(r)=>{
        this.set({step:2});
        this.set({"lastTime":60});
        const timeInter=setInterval(()=>{
          if(this.data.lastTime>=1){
            this.set({"lastTime":this.data.lastTime-1});
          }else{
            clearInterval(timeInter);
          }
        },1000);
      }
    })
  }
  onInit(){
    const app:any=getApp();
    this.set({globalUserInfo:app.globalData.user_info});
  }
}
Page(new _bindMobile())