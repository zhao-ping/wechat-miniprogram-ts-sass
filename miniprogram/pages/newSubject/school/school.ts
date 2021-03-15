import { getData} from '../../../utilTs/util';
// miniprogram/pages/newSubject/school/school.js
Page({
  data:{
    search:null,
    info:null,
    items:null,
    tabIndex:0,
    list:[],
    listPage:[],
  },
  changeTab(e:any){
    this.setData({tabIndex:e.detail});
    if(!this.data.list[e.detail]){
      this.getList();
    }
  },
  getInfo(){
    getData(`/data_service/v1/auth/choose_subject/can_choose/search/school_info`,{
      data:this.data.search,
      success:(r:any)=>{
        r.data.values.map((item:any)=>{
          this.data.listPage.push({
            page:0,
            page_count:1,
          })
        });
        this.setData({info:r.data});
        this.getList();
      }
    })
  },
  getList(){
    let i=this.data.tabIndex;
    if(this.data.listPage[i].page>=this.data.listPage[i].page_count){
      return;
    }
    let data:any={
      ...this.data.search,
      mode:1,
      search_type:this.data.info.values[this.data.tabIndex].v,
      limit:20,
      page:this.data.listPage[i].page+1,
    }
    getData(`/data_service/v1/auth/choose_subject/can_choose/search/school/major_list`,{
      data,
      success:(r:any)=>{
        this.data.list[i]=[...this.data.list[i]||[],...r.data]
        this.setData({list:this.data.list});
        this.data.listPage[i]=r.pager;
        this.setData({listPage:this.data.listPage});
      }
    })
  },
  onLoad(e){
    this.setData({search:e});
    this.getInfo();
  }
})