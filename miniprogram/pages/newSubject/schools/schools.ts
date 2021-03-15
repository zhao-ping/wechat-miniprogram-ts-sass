import { getData } from '../../../utilTs/util';
// miniprogram/pages/newSubject/major/major.js
Page({
  data: {
    options: null,
    info: null,
    items:null,
    tabIndex:0,
    filter: null,
    scrollTop:0,
    list: null,
    listPage: {
      page: 0,
      page_count: 1,
    },
  },
  showFilter(){
    const c:any=this.selectComponent("#schoolFilter");
    c.toShow();
  },
  changeTab(e:any){
    this.setData({tabIndex:e.detail});
    this.data.listPage.page=0;
    this.getList();
  },
  changeProv(e: any) {
    let index=e.detail.value;
    this.data.info.search_list[0].default_value=this.data.info.search_list[0].values[index];
    this.setData({info:this.data.info});
    this.data.listPage.page=0;
    this.getList();
  },
  getSearch() {
    getData(`/data_service/v1/auth/choose_subject/can_choose/school_search`, {
      data:{...this.data.options,type_id:1,},
      success: (r: any) => {
        wx.setNavigationBarTitle({ title: r.data.base_info.major_name});
        let items=r.data.values.map((item:any)=>item.k);
        this.setData({items});
        this.setData({ info: r.data });
      },
    });
  },
  getList(e?:any) {
    let data = {
      ...this.data.options,
      limit:20,
    };
    if(this.data.info){
      data.type_id=this.data.info.values[this.data.tabIndex].v;
      data.prov_id=this.data.info.search_list[0].default_value.v;
    }
    if(e&&e.detail.filters){
      // 点了筛选条件
      this.data.listPage.page=0;
      this.setData({filter:e.detail});
    }
    if(this.data.filter){
      data={...data,...this.data.filter.filters};
    }
    data.page=this.data.listPage.page+1;
    getData(`/data_service/v1/auth/choose_subject/can_choose/school_list`, {
      data,
      success: (r: any) => {
        if(r.pager.page==1){
          this.setData({scrollTop:0});
          this.setData({list:r.data})
        }else{
          this.setData({list:[...this.data.list,...r.data]});
        }
        this.setData({ listPage: r.pager });
      },
    });
  },
  onLoad(e: any) {
    this.setData({options: e });
    this.getSearch();
    this.getList();
  },
});
