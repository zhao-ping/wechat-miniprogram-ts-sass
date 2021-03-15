import { getData, BasePage } from '../../../utilTs/util';
// miniprogram/pages/major/detail/detail.js
class _detail extends BasePage{
  data={
    info:null,
  }
  getInfo(major_id:number){
    getData(`/static_service/v1/allow/major/${major_id}/detail`,{
      success:(r:any)=>{
        this.set({info:r.data})
      }
    })
  }
  onInit(e:any){
    this.getInfo(e.major_id)
  }
}
Page(new _detail());