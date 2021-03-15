import { getData, BasePage, event } from '../../../utilTs/util';
let info:any;
class _nature extends BasePage{
  data={info}
  submit(){
    let data:any[]=[];
    this.data.info.list.map((item:any)=>{
      let nature:object={key:item.key,value:item.value.filter((tem:any)=>tem.is_choose).map((tem:any)=>tem.v).join("|")};
      data.push(nature);
    })
    getData(`/user_service/v1/auth/score_nature/nature_trait`,{
      method:"POST",
      data,
      success:(r:any)=>{
        this.toast("设置成功");
        event.push("updateScoreNature")
        setTimeout(() => {
          wx.navigateBack();
        }, 1000);
      }
    })
  }
  select(e:any){
    if(this.data.info!=null){
      let {index,i}=e.currentTarget.dataset;
      let is_single=this.data.info.list[index].is_single;
      if(is_single){
        this.data.info.list[index].value.map((item:any)=>{
          item.is_choose=false;
        })
        this.data.info.list[index].value[i].is_choose=true;
      }else{
        this.data.info.list[index].value[i].is_choose=!this.data.info.list[index].value[i].is_choose;
      }
      this.set({info:this.data.info});
    }
  }
  getInfo(){
    getData(`/user_service/v1/auth/score_nature/nature_trait`,{
      success:(r:any)=>{
        this.set({info:r.data});
      }
    })
  }
  onInit(){
    this.getInfo();
  }
}
Page(new _nature())