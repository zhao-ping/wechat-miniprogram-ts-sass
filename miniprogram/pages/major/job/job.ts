import { getData, BasePage } from '../../../utilTs/util';
// miniprogram/pages/major/job/job.js
let info:any;
class _job extends BasePage{
  data= {
    tab:0,
    items:null,
    info,
    title_list:null,
    employment:[],
    jobIndex:0,
  }
  changeJobIndex(e:any){
    let dataset=e.currentTarget.dataset;
    this.set({jobIndex:dataset.index});
    let c:any=this.getComp("#jobPercent");
    c.changeByIndex(dataset.index);
  }
  changeTab(e:any){
    this.set({tab:e.detail});
    this.getInfo();
  }
  getInfo(major_id?:number){
    //@ts-ignore
    if(this.data.employment[this.data.tab]){
      return;
    }
    getData(`/static_service/v1/allow/major/${major_id||this.data.info.major_info.major_id}/employment`,{
      data:{type:this.data.tab+1},
      success:(r:any)=>{
        if(!this.data.info){
          this.set({title_list:r.data.title_list});
          this.set({items:r.data.title_list.map((item:any)=>item.k)});
          this.set({info:{major_info:r.data.major_info}});
        }
        //@ts-ignore
        this.data.employment[this.data.tab]=r.data.employment_data;
        this.set({employment:this.data.employment});
      }
    })
  }
  onInit(e:any){
    this.getInfo(e.major_id);
  }
}
Page(new _job());