import { getData, GlobalUserInfoPage } from '../../../utilTs/util';
let school_id: number, info: any, popupMajor: any;
enum tabType {"schoolAdmit" = 0,"majorAdmit","plan"};
let schoolAdmit:any,majorAdmit:any,plan:any;
class _page extends GlobalUserInfoPage {
  data = {
    tab: null, //选项卡
    info, //基础信息
    schoolAdmit, //学校录取数据
    majorAdmit, //专业录取数据
    plan, //招生计划
    popupMajor,
    scrollLeft: 0, //分校选项卡水平滚动位置
  };
  //上海备选专业组
  beixuanSchool(){
    let data:any={
      school_id:this.data.info.school_id
    }
    let table:any;
    if(this.data.info.page_model==4){
      // 上海版本
      table=this.data.plan.tables[0];
      data.subject_group_id=table.subject_group_id;
      data.admit_order_type=table.admit_order_type;
    }
    else if(this.data.info.page_model==1){
      // 常规版本
      if(this.data.tab==tabType.schoolAdmit){
        table=this.data.schoolAdmit.tables[0];
      }else if(this.data.tab==tabType.majorAdmit){
        table=this.data.majorAdmit.tables[0];
      }else{
        table=this.data.plan.tables[0];
      }
      data.admit_order_type=table.admit_order_type;
    }else{
      return;
    }
    getData(`/data_service/v1/auth/alternative/school`,{
      method:table.is_alternative?'DELETE':'POST',
      data,
      success:(r:any)=>{
        if(this.data.info.page_model==4){
          // 上海版本
          table.is_alternative=!table.is_alternative;
          this.set({plan:this.data.plan});
        }else if(this.data.info.page_model==1){
          // 常规版本
          let is_alternative=!table.is_alternative;
          if(this.data.schoolAdmit&&this.data.schoolAdmit.tables[0].admit_order_type==table.admit_order_type){
            this.data.schoolAdmit.tables[0].is_alternative=is_alternative;
            this.set({schoolAdmit:this.data.schoolAdmit});
          }
          if(this.data.majorAdmit&&this.data.majorAdmit.tables[0].admit_order_type==table.admit_order_type){
            this.data.majorAdmit.tables[0].is_alternative=is_alternative;
            this.set({majorAdmit:this.data.majorAdmit});
          }
          if(this.data.plan&&this.data.plan.tables[0].admit_order_type==table.admit_order_type){
            this.data.plan.tables[0].is_alternative=is_alternative;
            this.set({plan:this.data.plan});
          }
        }
      }
    })
  }
  beixuanPopMajor() {
    // 备选专业
    let data = {
      school_id: this.data.info.school_id,
      admit_order_type:this.data.popupMajor.major_info.admit_order_type,
      major_id: this.data.popupMajor.major_info.major_id,
      match_id: this.data.popupMajor.major_info.match_id,
      subject_group_id: this.data.popupMajor.major_info.subject_group_id,
    };
    getData(`/data_service/v1/auth/alternative/major`, {
      method:this.data.popupMajor.is_alternative?'DELETE':"POST",
      data,
      success: (r: any) => {
        this.data.popupMajor.is_alternative=!this.data.popupMajor.is_alternative;
        this.set({popupMajor:this.data.popupMajor});
      },
    });
  }
  /**
   * 显示专业弹窗
   * @param e
   */
  getMajorInfo(e: any) {
    let c: any = this.getComp("#popupMajor");
    c.toShow();
    let { item } = this.getElDataSet(e);
    if (this.data.popupMajor &&item.major_id == this.data.popupMajor.major_info.major_id) return;
    getData(
      `/data_service/v1/auth/school/${this.data.info.school_id}/major_score/${item.major_id}`,
      {
        data: {
          school_id: this.data.info.school_id,
          subject_group_id: item.subject_group_id,
          major_id: item.major_id,
          match_id: item.match_id,
          admit_order_type: item.admit_order_type,
        },
        success: (r: any) => {
          let major = {
            subject_equal: r.data.subject_equal,
            is_alternative: r.data.is_alternative,
            major_info: {
              admit_order_type: item.admit_order_type,
              major_id: r.data.major_id,
              major_name: r.data.major_name,
              match_id: r.data.match_id,
              subject_group_id: r.data.subject_group_id,
              subject_limit_id: r.data.subject_limit_id,
            },
            msg_info: {
              major_tag: r.data.major_tag,
              is_base_major: r.data.is_base_major,
              major_warning: r.data.major_warning,
              subjects: r.data.subjects,
            },
            tables: r.data.major_line_info_table,
          };
          this.set({
            popupMajor: { ...major, no_school_link: true, has_beixuan: true },
          });
        },
      }
    );
  }
  reSearch(e: any) {
    if (this.data.tab == tabType.plan) {
      this.getPlan(e.detail);
    } else if (this.data.tab == tabType.majorAdmit) {
      this.getMajorAdmit(e.detail);
    } else if (this.data.tab == tabType.schoolAdmit) {
      this.getSchoolAdmit(e.detail);
    }
  }
  changeSchool(e: any) {
    // 切换分校
    const dataset: any = e.currentTarget.dataset;
    school_id = dataset.schoolid;
    this.set({ plan: null });
    this.set({ majorAdmit: null });
    this.set({ schoolAdmit: null });
    this.setTab();
  }
  setTab(e?: any) {
    // 设置选项卡并请求信息
    if (e) {
      this.set({ tab: e.detail });
      wx.setStorage({
        key: "schoolDataTab",
        data: this.data.tab,
      });
    }
    if (this.data.tab == tabType.plan && !this.data.plan) {
      this.getPlan();
    } else if (this.data.tab == tabType.majorAdmit && !this.data.majorAdmit) {
      this.getMajorAdmit();
    } else if (this.data.tab == tabType.schoolAdmit && !this.data.schoolAdmit) {
      this.getSchoolAdmit();
    }
  }
  getPlan(filter?: any) {
    let url = this.data.plan
      ? `/data_service/v1/auth/school/${school_id}/plan/table`
      : `/data_service/v1/auth/school/${school_id}/plan/v2`;
    getData(url, {
      data: filter || {},
      success: (r: any) => {
        if (r.data.base_data) {
          this.set({ info: r.data.base_data });
          this.set({ plan: r.data });
          wx.setNavigationBarTitle({ title: r.data.base_data.school_name });
        } else {
          //@ts-ignore
          this.data.plan.tables = r.data;
          this.set({ plan: this.data.plan });
        }
      },
    });
  }
  getMajorAdmit(filter?: any) {
    let url = this.data.majorAdmit
      ? `/data_service/v1/auth/school/${school_id}/major_score/table`
      : `/data_service/v1/auth/school/${school_id}/major_score/v2`;
    getData(url, {
      data: filter || {},
      success: (r: any) => {
        if (r.data.base_data) {
          this.set({ info: r.data.base_data });
          this.set({ majorAdmit: r.data });
          wx.setNavigationBarTitle({ title: r.data.base_data.school_name });
        } else {
          //@ts-ignore
          this.data.majorAdmit.tables = r.data;
          this.set({ majorAdmit: this.data.majorAdmit });
        }
      },
    });
  }
  getSchoolAdmit(filter?: any) {
    let url = this.data.schoolAdmit
      ? `/data_service/v1/auth/school/${school_id}/line_table`
      : `/data_service/v1/auth/school/${school_id}/line/v2`;
    getData(url, {
      data: filter || {},
      success: (r: any) => {
        if (r.data.base_data) {
          this.set({ info: r.data.base_data });
          this.set({ schoolAdmit: r.data });
          wx.setNavigationBarTitle({ title: r.data.base_data.school_name });
        } else {
          //@ts-ignore
          this.data.schoolAdmit.tables = r.data;
          this.set({ schoolAdmit: this.data.schoolAdmit });
        }
      },
    });
  }
  onInit(options: any) {
    school_id = options.school_id;
    this.set({ tab: wx.getStorageSync("schoolDataTab") || 0 });
    this.setTab();
  }
}
Page(new _page());
