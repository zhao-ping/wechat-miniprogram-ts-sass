import { getData, toast, GlobalUserInfoPage } from '../../../utilTs/util';
const app:any=getApp();
// miniprogram/pages/user/logoff/logoff.js
class _logoff extends GlobalUserInfoPage{
  constructor(){
    super();
    this.data={
      ...this.data,
      code:null,
      lastTime:0,
    }
  }
  getCode(){
    getData(`/user_service/v1/allow/msg/send`,{
      method:"POST",
      data:{mobile:`${this.data.userInfo.mobile_encryption}`,type:3,},
      success:(r)=>{
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
  logoff(){
    wx.showModal({
      title:"",
      content:"注销帐号后，你的信息、付费内容以及权益都将失效！你确定要注销吗",
      success:()=>{
        getData(`/user_service/v1/auth/user/logoff`,{
          method:"DELETE",
          data:{
            code:this.data.code,
            mobile:`${this.data.userInfo.mobile_encryption}`,
          },
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
  onInit(){
    this.set({userInfo:app.globalData.user_info});
  }
}
Page(new _logoff())