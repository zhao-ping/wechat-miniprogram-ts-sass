import { BasePage, getData, IresBody } from '../../../utilTs/util';
// miniprogram/pages/user/concerned/concerned.js
class _concerned extends BasePage {
  data = {
    tabIndex: 0,
    list: null,
    listPage: {
      page: 0,
      page_count: 1,
    },
  };
  changeTab(e:any){
    this.set({tabIndex:e.detail})
    this.set({listPage:{page: 0,page_count: 1,}});
    this.set({list:null});
    this.getList()
  }
  getList(){
    if (this.data.listPage.page >= this.data.listPage.page_count) {
      return;
    }
    const url = this.data.tabIndex == 0 ? `/user_service/v1/auth/attention/school/page` : `/user_service/v1/auth/attention/major/page`;
    let data = {
      page: this.data.listPage.page+1,
      limit: 20,
    };
    getData(url, {
      data,
      success: (r: IresBody) => {
        this.set({ list: [...(this.data.list || []), ...r.data] });
        this.set({listPage:r.pager});
      },
    });
  }
  onInit() {
    this.getList()
  }
}
Page(new _concerned());
