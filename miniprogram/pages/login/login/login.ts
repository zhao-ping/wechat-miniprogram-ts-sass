// miniprogram/pages/login/login/login.js
import { isMobile, toast, getData, event, BasePage, initTim, tim } from '../../../utilTs/util';
import { Md5 } from "ts-md5"
const app:any=getApp();
class _login extends BasePage{
  data={
    authUserInfo:true,
    loginType: 0,//0:验证码登录or注册 1:密码登录 2：微信登录
    step:1,//1:填手机号  2：填验证码
    lastTime:60,//获取验证码倒计时
    mobile: "13980478084",
    password: "123456",
    code:"",
  }
  onShow() {
    // @ts-ignore
    wx.hideHomeButton();
    app.conf.requestHeader.token="";
    this.clearSomeStorage();
  }
  changeLoginType(){
    let type=this.data.loginType==0?1:0;
    this.set({loginType:type});
    this.set({step:1});
  }
  getCode(){
    getData(`/user_service/v1/allow/msg/send`,{
      method:"POST",
      data:{mobile:this.data.mobile,type:1,},
      success:(r)=>{
        this.set({"step":2});
        this.data.lastTime=60;
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
  navigatePage(data:any){
    if(!data.has_base_info||data.is_new_user){
      // 用户没有设置省份分数信息
      wx.navigateTo({url:"/pages/login/setInfo/setInfo"});
    }else{
      let newLginInfo = {
        user_id: data.user_id,
        type: "mobilePassword",
      }
      wx.setStorage({
        key: "loginInfo",
        data: newLginInfo,
      });
      /**
       * updatescore 针对获取globalData.user_info的页面
       * updateUserInfo 针对需要重新刷新页面的页面
       */
      this.getUserInfo();
    }
  }
  login() {
    if(this.data.loginType==0&&this.data.step==1){
      // 获取验证码
      this.getCode();
      return;
    }
    let data:any = {mobile: this.data.mobile,}
    // 登录或注册
    if (!isMobile(this.data.mobile)) {
      toast("请输入正确的手机号码");
      return;
    }
    if(this.data.loginType==0){
      //验证码登录注册
      if (!this.data.code) {
        toast("请输入验证码");
        return;
      }
      data.code=this.data.code;
    }else{
      if (!this.data.password) {
        toast("请输入密码");
        return;
      }
      data.password=Md5.hashStr(this.data.password);
    }
    getData(`/user_service/v1/allow/login`,
      {
        method: "POST",
        data,
        success:(r: any)=>{
          event.push("updateUserInfo");
          tim&&tim.logout();
          initTim();
          this.navigatePage(r.data);
        }
      })
  }
  getUserInfo(){
    getData("/user_service/v1/auth/user/info",{
      success:(r:any)=>{
        wx.setStorageSync("userInfo",r.data);
        app.globalData.user_info={...app.globalData.user_info||{},...r.data};
        event.push("updateScore,updataUserInfo");
        wx.switchTab({ url: "/pages/home/home/home" });
      }
    }) ;
  }
  wechatLogin() {
    wx.showLoading({title:"登录中，请稍后..."});
    wx.getUserInfo({
      success:(r:any)=>{
        wx.login({
          success :(res)=>{
            if (res.code) {
              //发起网络请求
             getData(`/user_service/v1/allow/wechat/applet_login`,{
               method:"POST",
               data:{
                 code:res.code,
                 encrypted_data:r.encryptedData,
                 iv:r.iv,
                },
               success:(r:any)=>{
                 wx.hideLoading();
                wx.setStorage({key:"session_data",data:r.data.session_data})
                if(r.data.is_bind){
                  // 老用户
                  event.push("updateUserInfo");
                  tim&&tim.logout();
                  initTim();
                  this.navigatePage(r.data.login_register_data);
                }else{
                  // 新用户
                  wx.navigateTo({url:`/pages/login/bingMobile/bindMobile`});
                }
               }
             })
            } else {
              toast("获取微信信息失败，请重试！")
            }
          }
        })
      },
      complete:(r:any)=>{
      }
    })
  }
  onInit(){
    // 检查用户是否授权获取用户信息
    wx.getSetting({
      success:(r:any)=>{
        if(r.authSetting){
          this.set({authUserInfo:false})
        }
      }
    })
  }
}
Page(new _login())