import { getData, BasePage } from '../../../utilTs/util';
// miniprogram/pages/newSubject/major/major.js
class _major extends BasePage{
  data={
    major_id:null,
    info:null,
    filter:null,
    list:null,
    listPage:{
      page:0,
      page_count:1,
    }
  }
  changeProv(e:any){
    console.log(e)
  }
  getSearch(){
    getData(`/data_service/v1/auth/choose_subject/can_choose/major_search`,{
      success:(r:any)=>{
        this.set({info:r.data});
      }
    })
  }
  getlist(){
    let data={
      page:this.data.listPage.page++,
    };
    getData(`/static_service/v1/allow/major/${this.data.major_id}/setting_school`,{
      data,
      success:(r:any)=>{
        if(this.data.listPage.page==0){
          this.set({list:r.data.school_list});
          this.set({info:{major_info:r.data.major_info}});
        }else{
          this.set({list:[...this.data.list||[],...r.data.school_list]});
        }
        this.set({listPage:r.pager});
        wx.setNavigationBarTitle({title:r.data.base_info.major_name})
      }
    })
  }
  onTabItemTap(e:any){
    console.log(e)
  }
}
Page(new _major())