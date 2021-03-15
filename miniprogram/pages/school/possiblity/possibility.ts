import { getData, toast, BasePage } from '../../../utilTs/util';
let info:any,admitIndex:number,lineChartParams:any,majors:any,major_evalution:any,enroll_evaluation_major_list:any|null,searchData:any,school_probability_info:any;
class _possibility extends BasePage{
  data={
    scrollViewId:"",
    searchData,
    admitIndex,
    info,
    lineChartParams,
    majors,
    major_evalution,
    showChao:false,
    majorsBeixuan:false,
    school_probability_info,
    enroll_evaluation_major_list,
  }
  clearMajors(){
    if(this.data.major_evalution!=null){
        for(let i=0;i<this.data.major_evalution.major_list.length;i++){
          this.data.major_evalution.major_list[i]['checked']=false;
          this.set({major_evalution:this.data.major_evalution});
        }
    }
    this.getInfo();
  }
  checkMajor(e:any){
    const dataset=e.currentTarget.dataset;
    let majorIndex=dataset.index;
    let ischecked=this.data.major_evalution.major_list[majorIndex].checked;
    if(!ischecked&&this.data.major_evalution.major_list.filter((item:any)=>item.checked).length>=this.data.major_evalution.base_info.max_major_num){
        // 选中的>=最高值
        toast(`最多只能选择${this.data.major_evalution.base_info.max_major_num}个专业！`);
        return;
    }
    this.data.major_evalution.major_list[majorIndex].checked=!ischecked
    this.set({major_evalution:this.data.major_evalution})
  }
  MultyBeixuan(){
    //批量 备选专业
    let formData:any=[];
    this.data.major_evalution.major_list.map((item:any)=>{
        if(item.checked){
          let major:any={
              major_id:item.major_id,
              match_id:item.match_id,
              add_or_del: 1,
              school_id: this.data.info.school_probability_info.school_id, 
              admit_order_type:this.data.info.school_probability_info.admit_order_type,
              subject_group_id:this.data.info.school_probability_info.subject_group_id,
          }
          formData.push(major);
        }
    })
    getData('/data_service/v1/auth/alternative/major/batch',  {
      method:'POST',
      data:formData,
      success:(r:any)=>{
        this.set({majorsBeixuan:true});
        this.data.info.school_probability_info.is_alternative=true;
        this.set({info:this.data.info});
      }
    })
  }
  hideMajors(){
    const c:any=this.getComp("#chooseMajor");
    c.toHide();
  }
  showMajors(){
    const c:any=this.getComp("#chooseMajor");
    c.toShow();
    this.getMajors();
    //@ts-ignore
    wx.hideHomeButton();
  }
  getMajors(){
    if(this.data.major_evalution) return;
    getData(`/data_service/v1/auth/probability/${this.data.info.school_probability_info.school_id}/major_score/can_up`,{
      data:{
        limit:500,
        admit_order_type:this.data.info.school_probability_info.admit_order_type,
        subject_group_id:this.data.info.school_probability_info.subject_group_id,
        search_tag:2,
      },
      success:(r:any)=>{
        this.set({major_evalution:r.data});
      }
    })
  }
  changeAdmit(e:any){
    this.set({admitIndex:e.detail.value});
    this.set({searchData:{...this.data.searchData,admit_order_type:this.data.info.school_probability_info.admit_order_type_list[this.data.admitIndex].v}});
    this.set({major_evalution:null});
    this.set({enroll_evaluation_major_list:null});
    this.getInfo();
  }
  scrollToView(e:any){
    const dataset=e.currentTarget.dataset;
    this.set({scrollViewId:dataset.id});
  }
  getInfo(){
    let url=`/data_service/v1/auth/probability/${this.data.searchData.school_id}/enroll_evaluation`;
    let data={...this.data.searchData};
    let ismajorPossibility=this.data.major_evalution&&this.data.major_evalution.major_list.filter((item:any)=>item.checked).length>0;
    if(ismajorPossibility){
      data.admit_order_type=this.data.info.school_probability_info.admit_order_type;
      let major_cout=this.data.major_evalution.major_list.filter((item:any)=>item.checked).length;
      if(major_cout<this.data.major_evalution.base_info.min_major_num || major_cout>this.data.major_evalution.base_info.max_major_num){
          toast(`请选择${this.data.major_evalution.base_info.min_major_num}-${this.data.major_evalution.base_info.max_major_num}个专业进行测评！`);
          return;
      }
      url=`/data_service/v1/auth/probability/${this.data.searchData.school_id}/enroll_evaluation/major_evaluation`;
      let majors:any=[];
      let enroll_evaluation_major_list:any=[]
      this.data.major_evalution.major_list.map((item:any)=>{
          if(item.checked){
            enroll_evaluation_major_list.push(item);
            majors.push({major_id:item.major_id,match_id:item.match_id});
          }
      })
      data.major_list=majors;
      this.set({enroll_evaluation_major_list:enroll_evaluation_major_list});
      this.set({showChao:this.data.major_evalution.major_list.filter((item:any)=>item.checked).filter((item:any)=>item.is_exceed_min_score).length>0});
      this.set({ majorsBeixuan:false, })
    }
    getData(url,{
      data,
      method:ismajorPossibility?"POST":"GET",
      success:(r:any)=>{
        let admits:any=r.data.school_probability_info.admit_order_type_list;
        if(admits.length>1){
          let i=admits.findIndex((admit:any)=>admit.v==r.data.school_probability_info.admit_order_type);
          this.set({admitIndex:i});
        }
        // 重新设置概率测评专业
        this.set({enroll_evaluation_major_list:r.data.enroll_evaluation_major_list});
        
        this.set({info:r.data});
        if(r.data.plan_wave_info&&r.data.plan_wave_info.x_axis.length>0){  
          let lineChartParams={
              xtag:r.data.plan_wave_info.x_tag,
              xaxis:r.data.plan_wave_info.x_axis,
              dataTag:r.data.plan_wave_info.data_tag,
              datas:r.data.plan_wave_info.datas,
          }
          this.set({lineChartParams:lineChartParams});
          let possibility:any = this.getComp("#possibility");
          possibility.init();
          let lineChart:any = this.getComp("#lineChart");
          lineChart.init();
          const c:any=this.getComp("#chooseMajor");
          c.toHide();
        }
      }
    })
  }
  onInit(e:any){
    for(let key in e){
      e[key]=/^\d+$/g.test(e[key])?Number(e[key]):e[key];
    }
    this.set({searchData:e})
    this.getInfo();
  }
}
Page(new _possibility())