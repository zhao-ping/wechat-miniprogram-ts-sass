import { getData } from '../../../utilTs/util';
// miniprogram/pages/school/rankList/rankList.js
Page({
  data:{
    search_list:null,
    currentRank:null,
    rank_all_type:null,
    filter:null,
    topContainerHeight:null,
    scrollBoxHeight:null,
    scrollTop:0,
    stickys:[],
    list:[],
    listPage:{
      page:0,
      page_count:1,
    }
  },
  showFilter(){
    let c:any=this.selectComponent("#filter");
    c.toShow();
  },
  changeRankType(e:any){
    const dataset=e.currentTarget.dataset;
    this.setData({filter:null});
    this.setData({currentRank:dataset.item});
    this.setData({listPage:{page:0,page_count:1}});
    this.getList();
    this.getRankTypes();
    this.setData({scrollTop:0})
  },
  setScrollBoxHeight(){
    const topContainer=wx.createSelectorQuery();
    topContainer.select("#topContianer").boundingClientRect((r:any)=>{
      this.setData({topContainerHeight:r.height})
      this.setData({scrollBoxHeight:wx.getSystemInfoSync().windowHeight-r.height});
    }).exec()
  },
  getRankTypes(){
    getData(`/static_service/v1/allow/school/rank/search`,{
      data:{type_id:this.data.currentRank.type_id},
      success:(r:any)=>{
        this.setData({search_list:r.data.search_list});
        this.setData({currentRank:r.data.rank_form_info});
        this.setData({rank_all_type:r.data.rank_all_type});
        let c:any=this.selectComponent("#filter");
        c.initFilters();
        this.setScrollBoxHeight();
      }
    })
  },
  getList(filter?:any){
    console.log(filter)
    if(filter&&filter.detail.filters){
      this.setData({
        listPage:{page:0,page_count:1}
      })
      this.setData({filter:filter.detail});
    }else{
      if(this.data.listPage.page>=this.data.listPage.page_count){
        return;
      }
    }
    let data={
      page:this.data.listPage.page+1,
      type_id:this.data.currentRank.type_id,
      limit:20,
    }
    if(this.data.filter){
      data={...data,...this.data.filter.filters};
    }
    getData(`/static_service/v1/allow/school/rank/data_list`,{
      data,
      success:(r:any)=>{
        this.setData({listPage:r.pager});
        if(r.pager.page==1){
          this.setData({list:r.data});
        }else{
          this.setData({list:[...this.data.list,...r.data]});
        }
        let stickys:any[]=[];
        let elStickys=wx.createSelectorQuery();
        elStickys.selectAll(".sticky").boundingClientRect((r:any)=>{
          r.map((item:any,i:number)=>{
            stickys.push({height:item.height,isSticky:false});
          })
         this.setData({stickys:stickys});
        }).exec()
      }
    })
  },
  onScroll(){
    let elStickys=wx.createSelectorQuery();
    elStickys.selectAll(".stickyContianer").boundingClientRect((r:any)=>{
      r.map((item:any,i:number)=>{
        this.data.stickys[i].isSticky=item.top-this.data.topContainerHeight<=0;
      })
      this.setData({stickys:this.data.stickys});
    }).exec();
  },
  onLoad(e:any){
    this.setData({currentRank:{type_id:e.type_id||0}});
    this.getRankTypes();
    this.getList();
  }
})