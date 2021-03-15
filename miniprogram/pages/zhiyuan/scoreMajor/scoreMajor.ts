import { ScoreChooseBase } from "../../../utilTs/scoreChoose.base";
import { event } from '../../../utilTs/util';
// miniprogram/pages/zhiyuan/scoreSchool/scoreSchool.js
class _scoreMajor extends ScoreChooseBase{
  constructor(protected listApi:string,public type:number){
    super(listApi,type);
    this.data={
      ...this.data,
    }
  }
  batchMajor(){
    // 批量备选或取消备选专业订阅
    event.on(this,"batchMajor",(options:any)=>{
      options.data.map((item:any)=>{
        this.data.list.map((major:any)=>{
          if(major.school_id==item.school_id&&major.major_id==item.major_id&&major.match_id==item.match_id){
            major.is_alternative=item.add_or_del==1?true:false;
          }
        })
      })
      this.set({list:this.data.list});
    })
  }
}
Page(new _scoreMajor(`/data_service/v1/auth/requirement/major/list`,2))