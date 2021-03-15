import { ScoreChooseBase } from "../../../utilTs/scoreChoose.base";
import { getData } from '../../../utilTs/util';
// miniprogram/pages/zhiyuan/scoreSchool/scoreSchool.js
class _possibleSchool extends ScoreChooseBase {
  constructor(protected listApi: string, public type: number) {
    super(listApi, type);
    this.data = {
      ...this.data,
      showRange:false,
      schoolIndex:null,
      popupSchool:null,
      admitList:null,
      sortList:null,
      schoolRange:null,
    };
  }
  changeSort(e:any){
    this.data.sortList.default_value=this.data.sortList.values[e.detail.value];
    this.set({sortList:this.data.sortList});
    let c:any=this.getComp("#school-filter");
    c.setFilter("sort_type",this.data.sortList.default_value);
    c.submit();
  }
  changeAdmit(e:any){
    this.data.admitList.default_value=this.data.admitList.values[e.detail.value];
    this.set({admitList:this.data.admitList});
    let c:any=this.getComp("#school-filter");
    c.setFilter("admit_order_type",this.data.admitList.default_value);
    c.submit();
  }
  changeRange(){
    let c:any=this.getComp("#school-filter");
    c.setFilter("school_range", {v:this.data.baseInfo.school_range==1?2:1});
    c.submit();
  }
  getSearch(){
    getData(`/data_service/v1/auth/probability/can_up/search`,{
      success:(r:any)=>{
        let admit=r.data.search_list.find((f:any)=>f.key=="admit_order_type");
        if(admit){
         admit.hide=true; 
        }
        let sort=r.data.search_list.find((f:any)=>f.key=="sort_type");
        sort.hide=true;
        this.set({admitList:admit});
        this.set({sortList:sort});
        this.set({filterList:r.data.search_list});
      }
    })
    this.getList();
  }
}
Page(new _possibleSchool(`/data_service/v1/auth/probability/can_up/list`, 1));
