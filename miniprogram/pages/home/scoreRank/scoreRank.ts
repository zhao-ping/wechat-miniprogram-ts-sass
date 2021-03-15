import { getData, BasePage } from '../../../utilTs/util';
// miniprogram/pages/home/scoreRank/scoreRank.js
class _scoreRank extends BasePage{
  data={
    info:null,
    subjects:[],
    subIndex:0,
    userRank:null,
  }
  changeSub(e:any){
    const i=e.detail||0;
    this.set({subIndex:i});
    //@ts-ignore
    let sub_id=this.data.info.subject_list[i].v;
    this.getInfo(sub_id);
  }
  getInfo(sub_id?:number){
    let data:any={};
    if(sub_id){
      data.sub_id=sub_id;
    }
    getData(`/data_service/v1/allow/province/score_rank`,{
      data,
      success:(r:any)=>{
        if(!sub_id){
          // 首次渲染
          // 设置页面标题
          wx.setNavigationBarTitle({
            title:r.data.province_name+r.data.year+'年一分一段表'
          })
          // 设置文理科选中状态
          let subs:any[]=[],index=0;
          r.data.subject_list.map((sub:any,i:number)=>{
            subs.push(sub.k);
            if(sub.v==r.data.sub_id){index=i}
          })
          this.set({subjects:subs});
          this.set({subIndex:index});
        }
        // 设置页面信息
        this.set({info:r.data});
        setTimeout(() => {
          this.set({userRank:"scrollIntoView"});
        }, 10);
      }
    })
  }
  onInit(){
    this.getInfo();
  }
}
Page(new _scoreRank())