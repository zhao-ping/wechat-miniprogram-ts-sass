import { getData, refreshHistory,GlobalUserInfoPage } from '../../../utilTs/util';

let history=wx.getStorageSync("searchSchoolPossibilityHistory");
const app:any=getApp();
class _searchSchoolPossibility extends GlobalUserInfoPage{
  constructor(){
    super();
    this.data={
      ...this.data,
      school_name:"",
      search:[],
      history:[],
    }
  }
  clearHistory(){
    this.set({history:[]})
    wx.removeStorageSync('searchSchoolPossibilityHistory');
  }
  chooseSchool(e:any){
    const dataset=e.currentTarget.dataset;
    let school=dataset.school;
    let newHistory=refreshHistory(this.data.history,school);
    this.set({history:newHistory});
    wx.setStorageSync("searchSchoolPossibilityHistory",newHistory);
    if(this.data.globalUserInfo.prov_model==4||this.data.globalUserInfo.prov_model==3){
      // 上海 跳转到选专业组页面
      wx.navigateTo({url:`/pages/school/majorGroup/majorGroup?school_id=${school.school_id}&admit_order_type=${school.admit_order_type}`});
    }else if(this.data.globalUserInfo.prov_model==1){
      // 常规省 跳转到概率评测页面
      wx.navigateTo({url:`/pages/school/possiblity/possibility?school_id=${school.school_id}&admit_order_type=${school.admit_order_type}`});
    }
  }
  toSearch(){
    getData(`/data_service/v1/auth/school/probability_search`,{
      data:{school_name:this.data.school_name,limit:50,},
      success:(r:any)=>{
        this.set({search:r.data});
      }
    })
  }
  onInit(){
    if(!app.globalData.user_info){
      wx.navigateTo({url: '/pages/login/login/login'});
    }
    if(history){
      this.set({history:history});
    }
  }
}
Page(new _searchSchoolPossibility())