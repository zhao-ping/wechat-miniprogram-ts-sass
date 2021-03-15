import { getData, event, BasePage, tim, initTim } from '../../../utilTs/util';
// miniprogram/pages/user/bindMobile/bindMobile.js
let wechatInfo:any;
class _bindMobile extends BasePage{
  data={
    session:null,
    wechatInfo,
    step:1,
    mobile:null,
    code:"",
    lastTime:0,
  }
  submit(){
    getData(`/user_service/v1/allow/wechat/applet_register`,{
      method:"POST",
      data:{
        mobile:this.data.mobile,
        code:this.data.code,
        session_data:this.data.session,
        iv:this.data.wechatInfo.iv,
        encrypted_data:this.data.wechatInfo.encryptedData,
      },
      success:(r:any)=>{
        event.push("updateUserState");
        tim&&tim.logout();
        initTim();
        if(this.data.mobile){
          this.toast("您已成功绑定手机号！");
        }
        setTimeout(()=>{
          if(r.data.has_base_info){
            wx.switchTab({url:"/pages/home/home/home"});
          }else{
            wx.navigateTo({url:"/pages/login/setInfo/setInfo"});
          }
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
  onShow(){
    //@ts-ignore
    wx.hideHomeButton();
  }
  onInit(e:any){
    wx.getUserInfo({
      success:(r:any)=>{
        this.set({wechatInfo:r});
      }
    })
    wx.getStorage({
      key:"session_data",
      success:(r:any)=>{
        this.set({session:r.data});
        wx.removeStorage({key:"session_data"});
      }
    })
    
  }
}
Page(new _bindMobile())