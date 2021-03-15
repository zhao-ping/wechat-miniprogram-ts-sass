// 搜学校搜专业基类
import { GlobalUserInfoPage, getData } from './util';

/**
 * listApi 列表请求参数
 * type 类型 1 学校，2 专业
 */
export class PopupInfoBase extends GlobalUserInfoPage {
  constructor(protected listApi: string, public type: number) {
    super();
    this.data = {
      ...this.data,
      userInfo: null,
      showPopupMajor: false,
      popupMajor: null, //专业弹窗
    };
  }
  /**
   * 跳转到学校详情页
   */
  toSchoolDetail(e:any){
    if(!this.data.isZhiyuanPage){
      let item=this.getElDataSet(e).item;
      wx.navigateTo({url:`/pages/school/school/school?school_id=${item.school_id}`})
    }
  }
  /**
   * 该校其他专业
   */
  showMoreMajors(e: any) {
    let { school_id, subject_group_id } = this.getElDataSet(e).item;
    let index = this.getElDataSet(e).index;
    let url="";
    if(this.data.isZhiyuanPage){
      url=`/pages/zhiyuan/scoreMajorMoreMajors/scoreMajorMoreMajors?school_id=${school_id}&uca_id=${this.data.uca_id}&index=${index}&isZhiyuanPage=${this.data.isZhiyuanPage}`;
    }else{
      url=`/pages/zhiyuan/scoreMajorMoreMajors/scoreMajorMoreMajors?school_id=${school_id}&admit_order_type=${this.data.baseInfo.admit_order_type}&search_tag=1&subject_group_id=${subject_group_id}&index=${index}`;
    }
    wx.navigateTo({url});
  }
  /**
   * 显示专业弹窗
   * @param e
   */
  getMajorInfo(e: any) {
    let c: any = this.getComp("#popupMajor");
    c.toShow();
    let { school_id, major_id, match_id ,subject_group_id} = this.getElDataSet(e).item;
    if(this.data.params?.school_id){
      school_id=this.data.params.school_id
    }
    if(this.data.params?.subject_group_id){
      subject_group_id=this.data.params.subject_group_id
    }
    if (
      this.data.popupMajor &&
      school_id == this.data.popupMajor.major_info.school_id &&
      major_id == this.data.popupMajor.major_info.major_id &&
      major_id == this.data.popupMajor.major_info.major_id
    )
      return;
    getData(
      `/data_service/v1/auth/school/${school_id}/major_score/${major_id}/can_up`,
      {
        data: {
          school_id,
          subject_group_id,
          major_id,
          match_id,
          admit_order_type:this.data.baseInfo?this.data.baseInfo.admit_order_type:this.data.info.application.admit_order_type,
        },
        success: (r: any) => {
          this.set({ popupMajor: r.data });
        },
      }
    );
  }
  /**
   * 从学校分弹窗 跳转到学校更多专业
   */
  toMoreMajors(e:any){
    let c:any=this.getComp("#popupSchool");
    c.toHide();
    let {school_id,admit_order_type,subject_group_id}=this.data.popupSchool.school_info;
    wx.navigateTo({url:`/pages/zhiyuan/scoreMajorMoreMajors/scoreMajorMoreMajors?school_id=${school_id}&admit_order_type=${admit_order_type}&search_tag=1&index=${this.data.schoolIndex}&subject_group_id=${subject_group_id}`});
  }
  /**
   * 学校分弹窗
   * @param e 
   */
  getSchoolInfo(e:any){
    let c:any=this.getComp("#popupSchool");
    c.toShow();
    let {school_id,subject_group_id,admit_order_type}=this.getElDataSet(e).item;
    let schoolIndex=this.getElDataSet(e).index;
    this.data.schoolIndex=schoolIndex;
    if(this.data.popupSchool&&(school_id==this.data.popupSchool.school_info.school_id)&&(subject_group_id==this.data.popupSchool.school_info.subject_group_id)&&(this.data.popupSchool&&school_id==this.data.popupSchool.school_info.school_id)&&(admit_order_type==this.data.popupSchool.school_info.admit_order_type)){
      return;
    }
    getData(`/data_service/v1/auth/school/${school_id}/line/can_up`,{
      data:{
        school_id,
        subject_group_id,
        admit_order_type:admit_order_type||(this.data.baseInfo?this.data.baseInfo.admit_order_type:this.data.info.application.admit_order_type),
      },
      success:(r:any)=>{
        this.set({popupSchool:r.data});
      }
    })
  }
}
