import { getData } from '../../../utilTs/util';
// miniprogram/pages/school/value/value.js
Page({
    data:{
        info:null,
    },
    getInfo(school_id:number){
        getData(`/static_service/v1/allow/school/${school_id}/study_value`,{
            success:(r:any)=>{
                this.setData({info:r.data});
            }
        })
    },
    onLoad(options:any){
        this.getInfo(options.school_id);
    }
})