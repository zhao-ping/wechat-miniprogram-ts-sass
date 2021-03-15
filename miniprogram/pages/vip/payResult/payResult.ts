import { BasePage, getData, event } from '../../../utilTs/util';
class _payResult extends BasePage{
  data={
    payResult:null,
    info:null,
    failMsg:null,
  }
  getInfo(out_trade_no:number){
    getData(`/user_service/v1/pay/wx/query`,{
      method:"POST",
      data:{out_trade_no},
      success:(r:any)=>{
        this.set({info:r.data})
      },
      fail:(msg:string)=>{
        // 支付失败
        this.set({failMsg:msg});
      }
    })
  }
  back(){
    wx.navigateBack();
  }
  updateUserInfo(){
    event.push("updateUserInfo");
    wx.switchTab({url:'/pages/user/user/user'});
  }
  onInit(e:any){
    let {out_trade_no,payResult}=e;
    this.set({payResult})
    this.getInfo(out_trade_no);
  }
}
Page(new _payResult());