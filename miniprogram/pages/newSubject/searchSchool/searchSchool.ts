import { getData,refreshHistory,toast } from '../../../utilTs/util';

let history=wx.getStorageSync("searchNewSubjectSchool");
Page({
  data:{
    info:null,
    school_name:"",
    search:[],
    history:[],
  },
  source(){
    toast(this.data.info.data_source,5000);
  },
  change(){
    if(this.data.major_name==""){
      this.setData({search:[]});
    }
  },
  clearHistory(){
    this.setData({history:[]})
    wx.removeStorageSync('searchNewSubjectSchool');
  },
  chooseSchool(e:any){
    const dataset=e.currentTarget.dataset;
    let item=dataset.item;
    let newHistory=refreshHistory(this.data.history,item);
    this.setData({history:newHistory});
    wx.setStorageSync("searchNewSubjectSchool",newHistory);
    wx.navigateTo({url:`/pages/newSubject/school/school?school_id=${item.school_id}&admit_order_type=${item.admit_order_type}`});
  },
  toSearch(){
    getData(`/data_service/v1/auth/choose_subject/can_choose/search/school`,{
      data:{school_name:this.data.school_name,limit:50,},
      success:(r:any)=>{
        this.setData({search:r.data});
        if(r.data.length==0){
          toast(this.data.info.tips);
        }
      }
    })
  },
  onLoad(){
    wx.getStorage({
      key:"newSubjectBaseInfo",
      success:(r:any)=>{
        this.setData({info:r.data});
      }
    })
    if(history){
      this.setData({history:history});
    }
  }
})