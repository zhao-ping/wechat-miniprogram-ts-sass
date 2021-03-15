import { getData, BasePage } from '../../../utilTs/util';
// miniprogram/pages/newSubject/majors/majors.js
let info:any,search:any;
class _majors extends BasePage{
  data={
    info,
    search,
  }
  getInfo(){
    getData(`/data_service/v1/auth/choose_subject/can_choose/major_list`,{
      data:{...this.data.search,limit:500,},
      success:(r:any)=>{
        this.set({info:r.data});
      }
    })
  }
  onInit(e:any){
    this.set({search:e})
    this.getInfo();
  }
}
Page(new _majors())