import { BasePage,getData } from '../../../utilTs/util';
let historyMajor=new Set(),historySchool=new Set();
class _search extends BasePage {
  data = {
    searchStr: "",
    tabIndex: 0,
    historyMajor,
    historySchool,
    collectionSchool: null,
    collectionMajor: null,
    list: null,
    listPage: {
      page: 0,
      page_count: 1,
    },
  };
  changeTab(e:any) {
    let tabIndex = e.detail;
    this.set({ tabIndex });
    this.set({ list: null });
    this.set({ listPage: { page: 1, page_count: 1 } });
    this.set({ searchStr: "" });
    if (tabIndex == 0 && !this.data.collectionSchool) {
      this.getSchoolCollection();
    } else if (tabIndex == 1 && !this.data.collectionMajor) {
      this.getMajorCollection();
    }
  }
  getSchoolCollection() {
    getData(`/user_service/v1/auth/attention/school/page`, {
      success: (r: any) => {
        this.set({ collectionSchool: r.data });
      },
    });
  }
  getMajorCollection() {
    getData(`/user_service/v1/auth/attention/major/page`, {
      success: (r: any) => {
        this.set({ collectionMajor: r.data });
      },
    });
  }
  addHistory(e:any){
      this.set({searchStr:this.getElDataSet(e).item});
      this.reGetList();
  }
  removeHistory(){
      if(this.data.tabIndex==0){
        this.set({historySchool:[]});
        wx.removeStorage({key:"historySchool"});
      }else{
        this.set({historyMajor:[]});
        wx.removeStorage({key:"historyMajor"});
      }
  }
  reGetList() {
    if(this.data.tabIndex==0){
        let history=new Set([this.data.searchStr,...this.data.historySchool]);
        this.set({historySchool:[...history]});
        wx.setStorage({
            key:"historySchool",
            data:this.data.historySchool,
        })
    }else{
        // major
        let history=new Set([this.data.searchStr,...this.data.historyMajor]);
        this.set({historyMajor:[...history]});
        wx.setStorage({
            key:"historyMajor",
            data:this.data.historyMajor,
        })
    }
    this.set({ list: null });
    this.set({ listPage: { page: 0, page_count: 1 } });
    this.getList();
  }
  getList() {
    if (this.data.listPage.page >= this.data.listPage.page_count) return;
    let url: string =
      this.data.tabIndex == 0
        ? `/static_service/v1/allow/school/page`
        : `/static_service/v1/allow/major/search`;
    let data = {
      page: this.data.listPage.page + 1,
      limit: 20,
      school_name: this.data.searchStr,
      major_name: this.data.searchStr,
    };
    getData(url, {
      data,
      success: (r: any) => {
        if (r.pager.page == 1) {
          this.set({ list: r.data });
        } else {
          console.log(r);
          //@ts-ignore
          this.set({ list: [...this.data.list, ...r.data] });
        }
        this.set({ listPage: r.pager });
      },
    });
  }
  onInit(e: any) {
    let tabIndex = e.tabIndex || 0;
    this.set({ tabIndex });
    if (this.data.tabIndex == 0) {
      this.getSchoolCollection();
    } else {
      this.getMajorCollection();
    }
    // 历史记录
    this.set({historyMajor:wx.getStorageSync("historyMajor")||[]});
    this.set({historySchool:wx.getStorageSync("historySchool")||[]});
  }
}
Page(new _search());
