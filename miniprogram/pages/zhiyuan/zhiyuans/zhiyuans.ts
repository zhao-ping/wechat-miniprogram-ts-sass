import { BasePage, getData, event } from '../../../utilTs/util';
let list:any[],info:any;
class _zhiyuans extends BasePage{
  data={
    state:1,//1 正常 2编辑
    checkedCount:0,
    info,
    list,
    listPage:{
      page:0,
      page_count:1,
    },
    showAdmit:false
  }
  downlaod(e:any){
    // let item=this.getElDataSet(e).item;
  }
  checkZhiyuan(e:any){
    let {index,pinggu}=this.getElDataSet(e);
    if(this.data.state==1){
      if(pinggu){
        wx.navigateTo({url:`/pages/zhiyuan/zhiyuanTest/zhiyuanTest?uca_id=${this.data.list[index].uca_id}`});
      }else{
        wx.navigateTo({url:`/pages/zhiyuan/zhiyuanDetail/zhiyuanDetail?uca_id=${this.data.list[index].uca_id}`});
      }
    }else if(this.data.state==2){
      // 编辑状态
      this.data.list[index].checked=!this.data.list[index].checked;
      this.data.list[index].checked?this.set({checkedCount:this.data.checkedCount+1}):this.set({checkedCount:this.data.checkedCount-1});
      this.set({list:this.data.list});
    }
    
  }
  deleteZhiyuan(){
    let uca_id_list=this.data.list.filter((item:any)=>item.checked).map((item:any)=>item.uca_id);
    getData(`/data_service/v1/auth/application/del`,{
      method:"DELETE",
      data:{uca_id_list},
      success:(r:any)=>{
        let list=this.data.list.filter((item:any)=>!item.checked);
        this.set({list:list});
        this.data.listPage={
          page:0,page_count:1,
        }
        this.getList();
      }
    })
  }
  changeState(){
    // 改变志愿表编辑状态
    // this.set({state:this.data.state==1?2:1});
    if(this.data.state==2&&this.data.checkedCount>0){
      // 删除志愿表
      this.deleteZhiyuan();
      this.set({state:1});
    }else{
      this.set({state:this.data.state==2?1:2});
    }
  }
  newZhiyuan(e?:any){
    let admit_order_type= this.data.info.user_info.admit_order_type
    if(e){
      admit_order_type=this.getElDataSet(e).admit
    }
    getData(`/data_service/v1/auth/application/add`,{
      method:"POST",
      data:{admit_order_type},
      success:(r:any)=>{
        //@ts-ignore
        this.data.list=[r.data,...this.data.list];
        wx.navigateTo({url:`/pages/zhiyuan/zhiyuanDetail/zhiyuanDetail?uca_id=${r.data.uca_id}`});
        this.set({list:this.data.list});
        let c:any=this.getComp("#admitList");
        c.toHide();
      }
    })
  }
  toShowAdmit(){
    if(this.data.info.admit_order_type_list.length<=1){
      // 只有一个批次 直接新建志愿表
      this.newZhiyuan();
    }else{
      let c:any=this.getComp("#admitList");
      c.toShow();
    }
  }
  chooseAdmit(e:any){
    let {admit}=this.getElDataSet(e);
    this.newZhiyuan(admit);
  }
  getList(){
    if(this.data.listPage.page>=this.data.listPage.page_count)return;
    let data={
      limit:20,
      page:this.data.listPage.page+1,
    }
    getData(`/data_service/v1/auth/application/page`,{
      data,
      success:(r:any)=>{
        this.set({list:(r.pager.page==1?r.data:[...this.data.list||[],...r.data])});
        this.set({listPage:r.pager});
      }
    })
  }
  getInfo(){
    getData(`/data_service/v1/auth/application/selection`,{
      success:(r:any)=>{
        this.set({info:r.data});
      }
    })
  }
  onInit(){
    this.getList();
    this.getInfo();
    event.on(this,"zhiyuanTest",()=>{
      this.data.listPage={page:0,page_count:1};
      this.getList();
    })
  }
}
Page(new _zhiyuans())