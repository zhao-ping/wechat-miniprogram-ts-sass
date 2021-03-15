import { Md5 } from 'ts-md5';
import { getData, toast, GlobalUserInfoPage, event } from '../../../utilTs/util';
const app:any=getApp();
class _password extends GlobalUserInfoPage{
  constructor(){
    super();
    this.data={
      ...this.data,
      m:null,
    mobile:null,
    code:null,
    password:null,
    confirmPassword:null,
    lastTime:0,
    }
  }
  getCode(){
    getData(`/user_service/v1/allow/msg/send`,{
      method:"POST",
      data:{mobile:`${this.data.mobile}`,type:2,},
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
  setPassword(){
    if(!this.data.mobile){
      toast("请输入手机号");
      return;
    }
    if(!this.data.code){
      toast("请输入验证码");
      return;
    }
    if(!this.data.password){
      toast("请输入密码");
      return;
    }
    if(this.data.password!=this.data.comfirmPassword){
      toast("两次密码不一致");
      return;
    }
    let data={
      "mobile": `${this.data.mobile}`,
      "code": this.data.code,
      "password": Md5.hashStr(this.data.password)
      };
    getData(this.data.globalUserInfo?`/user_service/v1/auth/user/update_password`:`/user_service/v1/allow/user/forget_password`,{
      method:"PUT",
      data,
      success:(r:any)=>{
        toast("您已成功设置密码！");
        this.getGlobalUserInfo(()=>{
          event.push("updateUserState")
        })
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      }
    })
  }
  initInfo(){
    if(app.globalData.user_info){
      this.set({userInfo:app.globalData.user_info});
      this.set({mobile:app.globalData.user_info.mobile_encryption});
      wx.setNavigationBarTitle({title:this.data.globalUserInfo.user_state==2?'设置密码':'修改密码'});
    }
  }
  onInit(){
    this.initInfo();
    event.on(this,"updateUserState",this.initUserInfo);
  }
}
Page(new _password())