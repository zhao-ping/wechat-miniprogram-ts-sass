import { getData, GlobalUserInfoPage } from '../../../utilTs/util';
class _page extends GlobalUserInfoPage{
  constructor(){
    super();
    this.data={
      ...this.data,
      info:null,
      zhaoshengTab:0,//招生概要选项卡
    }
  }
  attentSchool(){
    getData(`/user_service/v1/auth/attention/school/${this.data.info.school_id}`,{
      method:this.data.info.is_attention?"DELETE":"POST",
      success:(r:any)=>{
        this.data.info.is_attention=!this.data.info.is_attention;
        this.set({info:this.data.info});
      }
    })
  }
  /**
   * 跳转概率评测页面
   */
  toPossibility(){
    switch(this.data.globalUserInfo.prov_model_ex){
      //常规省 跳转到概率评测页面
      case 1:wx.navigateTo({url:`/pages/school/possiblity/possibility?school_id=${this.data.info.school_id}`});break;
      //浙江 上海 跳转到选专业页面
      default:wx.navigateTo({url:`/pages/school/majorGroup/majorGroup?school_id=${this.data.info.school_id}`});
    }
  }
  /**
   * 跳转学校招录数据页面
   * @param e 
   */
  toSchoolData(e:any){
    const dataset:any=e.currentTarget.dataset;
    wx.setStorage({
      key:"schoolDataTab",
      data:dataset.tab,
      success:(r)=>{
        wx.navigateTo({url:`/pages/school/data/data?school_id=${this.data.info.school_id}`});
      }
    })
  }
  contact(){
    if(this.data.info?.contact_list.length==1){
      wx.makePhoneCall({
        phoneNumber: this.data.info?.contact_list[0].v //仅为示例，并非真实的电话号码
      })
    }
  }
  copyWebsite(){
    wx.setClipboardData({
      data: this.data.info?.official_website,
      success (res) {
        wx.getClipboardData({
          success (res) {
            wx.showToast({title:"复制成功！"})
          }
        })
      }
    })
  }
  changeTab(e:any){
    let dataset:any=e.currentTarget.dataset;
    this.set({zhaoshengTab:dataset.tab});
  }
  getInfo(options:any){
    getData(`/static_service/v1/allow/school/${options.school_id}/school_info`,{
      success:(r:any)=>{
        let schoolContentLength=40;
        r.data.school_content=r.data.school_content.length>schoolContentLength?r.data.school_content.substr(0,schoolContentLength)+'···':r.data.school_content;
        this.set({info:r.data})
      }
    })
  }
  openPdf(e:any){
    let dataset=e.currentTarget.dataset;
    wx.showLoading({title:`加载中，请稍后···`});
    wx.downloadFile({
      // 示例 url，并非真实存在
      url: dataset.pdf.ex,
      success: function (res) {
        const filePath = res.tempFilePath;
        wx.openDocument({
          filePath: filePath,
          success: function (res) {
            wx.hideLoading();
          }
        })
      }
    })
  }
  onInit(options:any){
    if(!options.school_id){
      options={school_id:options.notification_id};
    }
    this.getInfo(options);
  }
}
Page(new _page());