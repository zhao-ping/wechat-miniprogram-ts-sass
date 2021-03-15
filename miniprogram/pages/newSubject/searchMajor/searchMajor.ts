import { getData, refreshHistory, toast } from '../../../utilTs/util';

let history=wx.getStorageSync("searchNewSubjectMajor");
Page({
  data:{
    info:null,
    major_name:"",
    search:[],
    history:[],
  },
  setMajorName(e:any){
    let dataset=e.currentTarget.dataset;
    this.setData({major_name:dataset.major});
    this.toSearch();
  },
  source(){
    toast(this.data.info.data_source,5000);
  },
  change(){
    if(!this.data.major_name){
      this.setData({search:[]});
    }
  },
  clearHistory(){
    this.setData({history:[]})
    wx.removeStorageSync('searchNewSubjectMajor');
  },
  chooseSchool(e:any){
    const dataset=e.currentTarget.dataset;
    let item=dataset.item;
    let newHistory=refreshHistory(this.data.history,item,"major_id");
    this.setData({history:newHistory});
    wx.setStorageSync("searchNewSubjectMajor",newHistory);
    wx.navigateTo({url:`/pages/newSubject/schools/schools?major_id=${item.major_id}&admit_order_type=${item.admit_order_type}`});
  },
  toSearch(){
    getData(`/data_service/v1/auth/choose_subject/can_choose/search/major`,{
      data:{major_name:this.data.major_name,limit:50,},
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