import { getData, event, BasePage } from '../../../utilTs/util';
class _scoreNature extends BasePage{
  data={
    info:null,
  }
  getInfo(){
    getData(`/user_service/v1/auth/score_nature/total_info`,{
      success:(r:any)=>{
        this.set({info:r.data})
      }
    })
  }
  onInit(){
    event.on(this,"updateScoreNature",this.getInfo);
    this.getInfo();
  }
}
Page(new _scoreNature());