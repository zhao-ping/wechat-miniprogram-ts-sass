import { getData, toast, BasePage, event } from '../../../utilTs/util';
class _setSchool extends BasePage{
  data={
    school_name:"",
    search:[],
    history:[],
  }
  setSchool(e:any){
    const dataset:any=e.currentTarget.dataset;
    let school=dataset.school;
    if(school.describe){
      toast(school.describe);
      return;
    }
    getData(`/data_service/v1/auth/grade/target/add`,{
      method:"POST",
      data:school,
      success:(r:any)=>{
        event.push("setNewTargetSchool");
        wx.navigateBack();
      }
    })
  }
  getHistory(){
    getData(`/data_service/v1/auth/grade/target/before`,{
      success:(r:any)=>{
        this.set({history:r.data});
      }
    })
  }
  toSearch(){
    getData(`/data_service/v1/auth/grade/target/search`,{
      data:{school_name:this.data.school_name,limit:50,},
      success:(r:any)=>{
        this.set({search:r.data});
      }
    })
  }
  onInit(){
    this.getHistory();
  }
}
Page(new _setSchool());