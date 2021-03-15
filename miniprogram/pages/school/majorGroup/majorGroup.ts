import { getData, toast, GlobalUserInfoPage } from '../../../utilTs/util';
class _majorGroup extends GlobalUserInfoPage{
  constructor(){
    super();
    this.data={
      ...this.data,
      info:null,
    }
  }
  toPossibility(e:any){
    let dataset=e.currentTarget.dataset;
    let school=dataset.school;
    if(!school.subject_equal){
      toast("您不符合选科要求！");
      return;
    }
    wx.navigateTo({
      url:`/pages/school/possiblity/possibility?school_id=${this.data.info.school_id}&subject_group_id=${school.subject_group_id}&major_id=${school.major_id}&match_id=${school.match_id}&plan_major_match_id=${school.plan_major_match_id}`
    })
  }
  getInfo(school_id:number){
    getData(`/data_service/v1/auth/school/enroll_evaluation/search_list/${school_id}`,{
      success:(r:any)=>{
        this.set({info:r.data});
      }
    })
  }
  onInit(e:any){
    this.getInfo(e.school_id);
  }
}
Page(new _majorGroup())