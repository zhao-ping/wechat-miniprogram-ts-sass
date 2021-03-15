import { BasePage, getData, event } from '../../../utilTs/util';

type Tmajor={
  major_id:number,
  match_id:number,
  is_alternative:boolean,
  is_application_checked:boolean,
  [name:string]:any,
}
type TmoreMajors={
  base_info:any,
  major_list:Tmajor[]
}
let list:Tmajor[]=[];
let moreMajors:TmoreMajors
class _scoreMajorMoreMajors extends BasePage{
  data={
    isZhiyuanPage:null,
    scrollView:"yourRank",
    options:{admit_order_type:null,school_id:null,index:null,subject_group_id:null,uca_id:null},
    moreMajors,//该校其他专业
    list,
    moreMajorsChoose:[],//该校其他专业 备选或取消备选列表
    popupMajor:null,
  }
  /**
   *学校其他专业备选或取消 选择
   */
  chooseMajor(e:any){
    let {index}=this.getElDataSet(e);
    this.data.list[index].is_alternative=!this.data.list[index].is_alternative;
    this.set({list:this.data.list});
  }
  /**
   * 学校其他专业 批量备选
   */
  beixuanBatch(){
    // add_or_del 1备选 2删除
    let data:any=[];
    //@ts-ignore
    this.data.list.map((item:any,i:number)=>{
      if(item.is_alternative!=this.data.moreMajors.major_list[i].is_alternative){
        data.push({
          admit_order_type:this.data.options.admit_order_type,
          school_id:this.data.options.school_id,
          subject_group_id:this.data.options.subject_group_id,
          major_id:item.major_id,
          match_id:item.match_id,
          add_or_del:item.is_alternative?1:2,
        })
      }
    })
    if(data.length<=0){
      wx.navigateBack();
      return;
    }
    getData(`/data_service/v1/auth/alternative/major/batch`,{
      method:"POST",
      data,
      success:(r:any)=>{
        event.push("batchMajor",{data,index:this.data.options.index});
        wx.navigateBack();
      }
    })
  }
  hideMoreMajors(e:any){
    let c:any=this.getComp("#moreMajors");
    c.toHide();
    this.beixuanBatch();
  }
  /**
   * 该校其他专业
  */
  getMoreMajors(options:any){
    let url='';
    if(this.data.isZhiyuanPage){
      url=`/data_service/v1/auth/application/school/major_list`;
    }else{
      url=`/data_service/v1/auth/probability/${options.school_id}/major_score/can_up`
    }
    getData(url,{
      data:{
        limit:500,
        ...options,
      },
      success:(r:any)=>{
        this.set({moreMajors:r.data});
        this.set({list:JSON.parse(JSON.stringify(r.data.major_list))});
        wx.setNavigationBarTitle({title:r.data.base_info.subject_group_name||r.data.base_info.school_name});
        this.set({scrollView:`major-${r.data.base_info.index-1}`});
      }
    })
  }
  /**
   * 显示专业弹窗
   * @param e 
   */
  getMajorInfo(e:any){
    let c:any=this.getComp("#popupMajor");
    c.toShow();
    let {major_id,match_id}=this.getElDataSet(e).item;
    //@ts-ignore
    if(this.data.popupMajor&&major_id==this.data.popupMajor.major_info.major_id&&major_id==this.data.popupMajor.major_info.major_id) return;
    getData(`/data_service/v1/auth/school/${this.data.options.school_id}/major_score/${major_id}/can_up`,{
      data:{
        school_id:this.data.options.school_id,
        subject_group_id:this.data.options.subject_group_id,
        major_id,
        match_id,
        admit_order_type:this.data.options.admit_order_type,
      },
      success:(r:any)=>{
        this.set({popupMajor:r.data});
      }
    })
  }
  /**
   * 填报或者删除志愿专业
   */
  addORrDelMajor(e:any){
    let {index}=this.getElDataSet(e);
    let item:any=this.data.list[index];
    let isAdd=!item.is_application_checked;
    getData(isAdd?`/data_service/v1/auth/application/school/add`:`/data_service/v1/auth/application/school/del`,{
      method:isAdd?'POST':'DELETE',
      data:{
        match_id: item.match_id,
        major_id: item.major_id,
        school_id:this.data.options.school_id,
        uca_id:this.data.options.uca_id,
        ucas_id:item.ucas_id,
      },
      success:(r:any)=>{
        this.data.list[index].is_application_checked=!this.data.list[index].is_application_checked;
        this.data.list[index].ucas_id=r.data.application_school_list[r.data.application_school_list.length-1].ucas_id;
        this.set({list:this.data.list});
      }
    })
  }
  onInit(e:any){
    this.set({isZhiyuanPage:e.isZhiyuanPage=="true"?true:false});
    for(let key in e){
      e[key]=/^\d+$/g.test(e[key])?Number(e[key]):e[key];
    }
    this.set({options:e});
    this.getMoreMajors(this.data.options)
  }
}
Page(new _scoreMajorMoreMajors())