import { BasePage, getData, toast} from '../../../utilTs/util';
let payInfo: any, info: any, wechatInfo: any;
class _pay extends BasePage {
  data = {
    wechatInfo,
    payInfo,
    info,
  };
  checkGood(e: any) {
    let { index } = this.getElDataSet(e);
    if (!this.data.info.goods_list[index].is_enable) {
      toast(this.data.info.goods_list[index].tip);
      return;
    }
    this.data.info.goods_list.map((item: any) => {
      item.is_default = false;
    });
    this.data.info.goods_list[index].is_default = true;
    this.set({ info: this.data.info });
  }
  getInfo() {
    getData(`/user_service/v1/auth/goods/list`, {
      success: (r: any) => {
        this.set({ info: r.data });
      },
    });
  }
  showPay() {
    wx.showLoading({ title: "加载中，请稍后。。。" });
    let goods_id = this.data.info.goods_list.find(
      (item: any) => item.is_default
    ).goods_id;
    getData(`/user_service/v1/auth/goods/pay_info`, {
      data: { goods_id },
      success: (r: any) => {
        this.set({ payInfo: r.data });
        wx.hideLoading();
        let c: any = this.getComp("#payInfo");
        c.toShow();
      },
    });
  }
  order() {
    wx.login({
      success:(r:any)=>{
        let goods_id = this.data.info.goods_list.find((item: any) => item.is_default).goods_id;
        let data = {
          goods_id,
          code:r.code,
          user_id: this.data.info.user_info.user_id,
          content: `{\"gk_year\":${new Date().getFullYear()},\"prov_id\":${this.data.info.user_info.prov_id}}`,
          // open_id: r.data.openid,
        };
        getData(`/user_service/v1/pay/wx/applet`, {
          method: "POST",
          data,
          success: (r: any) => {
            wx.requestPayment({
              timeStamp: r.data.timeStamp,
              nonceStr: r.data.nonceStr,
              package: r.data.package,
              signType: r.data.signType,
              paySign: r.data.paySign,
              success (res:any) { 
                wx.navigateTo({url:`/pages/vip/payResult/payResult?out_trade_no=${r.data.out_trade_no}&payResult=true`});
              },
              fail (res) {
                if(res.errMsg.indexOf('cancel')){
                  // 用户取消支付
                  toast("您取消了支付！");
                }else{
                }
                wx.navigateTo({url:`/pages/vip/payResult/payResult?out_trade_no=${r.data.out_trade_no}&payResult=false`});
              }
            })
          },
        });
      }
    })
  }
  onInit() {
    wx.getUserInfo({
      success: (r: any) => {
        this.set({ wechatInfo: r });
      },
    });
    this.getInfo();
  }
}
Page(new _pay());