import { getData, BasePage } from '../../../utilTs/util';
// miniprogram/pages/major/major/majog.js
let info:any;
class _major extends BasePage{
  data={
    info,
  }
  attentMajor(){
    getData(`/user_service/v1/auth/attention/major/${this.data.info.major_info.major_id}`,{
      method:this.data.info.major_info.is_attention?'DELETE':'POST',
      success:(r:any)=>{
        this.data.info.major_info.is_attention=!this.data.info.major_info.is_attention
        this.set({info:this.data.info});
      }
    })
  }
  getInfo(major_id:number){
    getData(`/static_service/v1/allow/major/info?major_id=${major_id}`,{
      success:(r:any)=>{
        this.set({info:r.data});
      }
    })
  }
  onInit(e:any){
    this.getInfo(e.major_id);
  }
}
Page(new _major());