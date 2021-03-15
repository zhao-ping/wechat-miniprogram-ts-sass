import { getData, toast, event, BasePage } from '../../../utilTs/util';
// var amap=require("../../../libs/amap-wx");
let provinceName:string="四川";
interface Province{
    prov_id:number;
    name:string;
    is_support:boolean;
    sub_list:Subs[];
    [name:string]:any;
}
interface Subs{
    sub_titile:string;
    choose_number:number;
    sub_info:Sub[];
}
interface Sub{
    k:string|number;
    v:number;
    checked:boolean;
}
class _setScore extends BasePage{
    data:any={
        province:null,
        score:null,
        rank:null,
        subjects:null,
        info:null,        
    }
    showProvince(){
        let c:any=this.getComp("#provinceList");
        c.toShow();
        wx.setNavigationBarTitle({title:"请选择省份"})
    }
    setInfo(){
        let data:any={
            prov_id:this.data.province.prov_id,
            score:Number(this.data.score),
            rank:Number(this.data.rank),
            subject_id_list:null,
        }
        if(!this.data.province){
            toast("请选择省份！");
            return;
        }
        let province:Province=this.data.province;
        let subject_id_list=[];
        for(let subs of province.sub_list){
            let subCount=subs.choose_number;
            let count=0;
            for(let sub of subs.sub_info){
                if(sub.checked){
                    count++;
                    subject_id_list.push(sub.v);
                }
            }
            if(subCount!=count){
                toast("您的选科不全");
                return;
            }
        }
        data.subject_id_list=subject_id_list;
        if(!this.data.score){
            toast("请填写正确的分数！");
            return;
        }
        getData(`/user_service/v1/auth/user/update_base_info`,{
            method:"PUT",
            data,
            success:()=>{
                event.push("updateUserInfo");
                wx.switchTab({url:"/pages/home/home/home"});
            }
        })
    }
    changeProvince(e:any){
        const dataset=e.currentTarget.dataset;
        let prov:Province=dataset.province;
        if(prov.is_support){
            this.setProvince(prov);
            wx.setNavigationBarTitle({title:"圆梦志愿"})
        }else{
            toast("暂不支持此省份！");
        }
    }
    changeSub(e:any){
        const dataset=this.getElDataSet(e);
        let subsIndex=dataset.subsIndex;
        let subIndex=dataset.subIndex;
        let province:Province={...this.data.province};
        let subs=province.sub_list[subsIndex];
        if(subs.choose_number==1){
            // 单选
            subs.sub_info.map(sub=>sub.checked=false);
            subs.sub_info[subIndex].checked=true;
        }else{
            // 多选
            if(subs.sub_info[subIndex].checked){
                // 取消选择
                subs.sub_info[subIndex].checked=false
            }else{
                // 选择
                let checkedSubs=subs.sub_info.filter(sub=>sub.checked);
                if(checkedSubs.length>=subs.choose_number){
                    toast(`您最多只能选择${subs.choose_number}个科目，请先取消其他选科，再重新选择！`);
                }else{
                    subs.sub_info[subIndex].checked=true;
                }
            }
        }
        
        this.set({province:province});
    }
    setProvince(prov:Province){
        prov.sub_list.map((subs:any)=>{
            subs.sub_info.map((sub:any)=>{
                sub.checked=false;
            })
            subs.sub_info[0].checked=true;
        })
        this.set({province:prov});
        let c:any=this.getComp("#provinceList");
        c.toHide();
    }
    getInfo(){
        getData(`/user_service/v1/allow/user/prov_subjects`,{
            success:(r)=>{
                const locationInter=setInterval(()=>{
                    if(provinceName){
                        clearInterval(locationInter);
                        this.set({info:r.data})
                        let isContinue=true;
                        for(let letter of r.data){
                            for(let prov of letter.prov_list){
                                if(prov.name.indexOf(provinceName)!=-1){
                                    this.setProvince(prov);
                                    isContinue=false;
                                    break;
                                }
                            }
                            if(!isContinue){
                                break;
                            }
                        }
                    }
                },20)
            }
        })
    }
    onShow(){
        this.getInfo();
        // @ts-ignore
        wx.hideHomeButton();
    }
}
Page(new _setScore())