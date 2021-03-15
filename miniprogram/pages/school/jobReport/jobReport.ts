import { getData } from '../../../utilTs/util';
Page({
    data:{
        info:null,
    },
    getInfo(school_id:number){
        getData(`/static_service/v1/allow/school/${school_id}/introduce`,{
            success:(r:any)=>{
                this.setData({info:r.data});
            }
        })
    },
    onLoad(options:any){
        this.getInfo(options.school_id);
    }
})