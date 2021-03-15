import { getData } from '../../../utilTs/util';
import { PopupInfoBase } from '../../../utilTs/popupInfo.base';
class _addMajor extends PopupInfoBase{
  constructor(listApi:string,type:number){
    super(listApi,type);
    this.data={
      ...this.data,
      isZhiyuanPage:true,
      tabIndex:1,
      params:null,
      baseInfo:null,
      checkedMajors:null,
      list:null,
      listPage:{page:0,page_count:1},
    }
  }
  /**
   * 填报专业或取消填报
   * @param e 
   */
  addOrDelMajor(e:any){
    let {item}=this.getElDataSet(e);
    let isAdd=(this.data.tabIndex==1&&!item.is_application_checked);//是不是添加专业
    let i=this.data.list.findIndex((tem:any)=>tem.major_id==item.major_id&&tem.match_id==item.match_id);//全部专业index值
    let index=this.data.checkedMajors.findIndex((tem:any)=>tem.major_id==item.major_id&&tem.match_id==item.match_id);//已填专业index值，可能不存在
    let data:any={
      uca_id: this.data.params.uca_id,
      ucas_id:this.data.params.ucas_id,
    }
    if(isAdd){
      data={
        ...data,
        subject_group_id:this.data.params.subject_group_id,
        major_id: item.major_id,
        match_id: item.match_id,
      }
    }else{
      data={
        ...data,
        ucam_id:index!=-1?this.data.checkedMajors[index].ucam_id:null,
      }
    }
    getData(isAdd?`/data_service/v1/auth/application/major/add`:`/data_service/v1/auth/application/major/del`,{
      method:isAdd?'POST':'DELETE',
      data,
      success:(r:any)=>{
        this.data.list[i].is_application_checked=!this.data.list[i].is_application_checked;
        this.set({list:this.data.list});
        this.set({checkedMajors:r.data.application_major_list})
      }
    })
  }
  /**
     * 上移或下移
     * @param e 
     */
   move(e:any){
    let {index,sort}=this.getElDataSet(e);
    let item=this.data.checkedMajors[index];
    let data={
        uca_id: this.data.params.uca_id,
        ucas_id: this.data.params.ucas_id,
        sort_type: sort,//上移1/下移2，针对常规省/上海/学上海使用，等于0则无效
        ucam_id: item.ucam_id,//移到特定的位置，针对浙江/学浙江使用，等于0则无效
    }
    getData(`/data_service/v1/auth/application/major/update_sort`,{
      method:"PUT",
      data,
      success:(r:any)=>{
          this.set({checkedMajors:r.data.application_major_list});
      }
    })
  }
  changeTab(e:any){
    this.set({tabIndex:e.detail});
  }
  getCheckedMajors(){
    getData(`/data_service/v1/auth/application/${this.data.params.uca_id}/school/${this.data.params.ucas_id}`,{
      success:(r:any)=>{
        this.set({baseInfo:r.data.base_info});
        this.set({checkedMajors:r.data.application_major_list});
      }
    })
  }
  getList(){
    if(this.data.listPage.page>=this.data.listPage.page_count) return;
    let data={
      ...this.data.params,
      limit:20,
      page:this.data.listPage.page+1,
    }
    getData(this.listApi,{
      data,
      success:(r:any)=>{
        if(this.data.listPage.page==0){
          this.set({list:r.data.major_list});
        }else{
          this.set({list:[...this.data.list,...r.data.major_list]});
        }
        this.set({listPage:r.pager});
      }
    })
  }
  toApplication(){
    wx.navigateBack();
  }
  onInit(e:any){
    for(let key in e){
      e[key]=/^\d+$/g.test(e[key])?Number(e[key]):e[key];
    }
    this.set({params:e});
    this.getCheckedMajors();
    this.getList();
  }
}
Page(new _addMajor(`/data_service/v1/auth/application/school/major_list`,2));