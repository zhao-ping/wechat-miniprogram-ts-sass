import { getData, refreshHistory, GlobalUserInfoPage } from '../../../utilTs/util';
let history=wx.getStorageSync("searchSchoolPlanHistory");
const app:any=getApp();
class _searchSchoolPlan extends GlobalUserInfoPage{
  constructor(){
    super();
    this.data={
      ...this.data,
      info:null,
      school_name:"",
      search:[],
      history:[],
    }
  }
  clearHistory(){
    this.set({history:[]})
    wx.removeStorageSync('searchSchoolPlanHistory');
  }
  chooseSchool(e:any){
    const dataset=e.currentTarget.dataset;
    let school=dataset.school;
    let newHistory=refreshHistory(this.data.history,school);
    this.set({history:newHistory});
    wx.setStorageSync("searchSchoolPlanHistory",JSON.stringify(newHistory));
    wx.setStorageSync("schoolDataTab",2);
    wx.navigateTo({url:`/pages/school/data/data?school_id=${school.school_id}`});
  }
  toSearch(){
    getData(`/data_service/v1/auth/school/plan_search`,{
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
      this.set({history:JSON.parse(history)});
    }
  }
}
Page(new _searchSchoolPlan());