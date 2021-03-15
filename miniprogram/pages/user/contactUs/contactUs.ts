import { getData, toast, GlobalUserInfoPage, event } from '../../../utilTs/util';
// miniprogram/pages/user/contactUs/contactUs.js
class _contactUs extends GlobalUserInfoPage{
  constructor(){
    super();
    this.data={
      ...this.data,
      info:null,
    }
  }
  contact(e:any){
    let {type,value}=e.currentTarget.dataset
    switch(type){
      case 1:
        //复制微信
        wx.setClipboardData({
          data: value,
          success (res) {
            toast("您已成功复制微信号");
          }
        })
        break;
      case 2:
        // 拨打电话
        wx.makePhoneCall({
          phoneNumber: value
        })
        break;
      default:
        this.contactMe();
    }
  }
  contactMe(){
    if(this.data.globalUserInfo.user_state==1){
      // 还没绑定手机号
      wx.showModal({
        title:"",
        content:`请先绑定手机号`,
        success:(e:any)=>{
          if(e.confirm){
            wx.navigateTo({url:"/pages/user/bindMobile/bindMobile"})
          }
        }
      })
    }else{
      // 请客服联系我"申请成功后，客服会尽快联系您，请耐心等待！
      wx.showModal({
        title:"",
        content:`请客服联系我"申请成功后，客服会尽快联系您，请耐心等待！`,
        success:()=>{
          getData(`/static_service/v1/auth/service/connect_me`,{
            success:(r)=>{
              toast("申请成功，客服会尽快联系您，请耐心等待！")
            }
          })
        }
      })
    }
  }
  getInfo(){
    getData(`/static_service/v1/allow/service/customer_service`,{
      success:(r:any)=>{
        this.set({info:r.data});
      }
    })
  }
  onInit(){
    this.getInfo();
    event.on(this,"updateUserState",()=>{
      this.getInfo();
    })
  }
}
Page(new _contactUs())