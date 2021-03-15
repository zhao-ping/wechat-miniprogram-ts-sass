import { getData} from '../../../utilTs/util';
import { PopupInfoBase } from '../../../utilTs/popupInfo.base';
class _zhiyuanDetail extends PopupInfoBase{
    constructor(){
        super("",0);
        this.data={
            ...this.data,
            isZhiyuanPage:true,
            scrollview:"bottom",
            uca_id:null,
            info:null,
            currentAdjust:[1],//上海专用
            sorts:[],
            sortIndex:0,
            currentIndex:null,
        }
    }
    /**
     * 上海显示调剂
     */
    showAdjust(e:any){
        let {item,index}=this.getElDataSet(e);
        this.set({currentAdjust:item.adjust_type});
        this.set({currentIndex:index})
        let adjust:any=this.getComp("#adjust");
        adjust.toShow()
    }
    /**上海选择调剂 */
    chooseAdjust(e:any){
        let {item,index}=this.getElDataSet(e);
        if(item.type==0){
            this.data.currentAdjust=[item.v];
        }else{
            let adjusts=[];
            this.data.info.adjust_type_info.adjust_type_list.map((adjust:any)=>{
                if(adjust.type==1&&this.data.currentAdjust.includes(adjust.v)){
                    adjusts.push(adjust.v);
                }
            });
            adjusts.push(item.v)
            let adjust=new Set(adjusts);
            this.data.currentAdjust=Array.from(adjust);
        }
        this.set({currentAdjust:this.data.currentAdjust});
        this.data.info.application_school_list[index].adjust_type=this.data.currentAdjust;
        this.set({info:this.data.info});
    }
    /**
     * 修改调剂 上海
     */
    adjustShanghai(){
        let item=this.data.info.application_school_list[this.data.currentIndex];
        getData(`/data_service/v1/auth/application/school/update_adjust`,{
            method:"PUT",
            data:{
                uca_id: this.data.uca_id,
                ucas_id: item.ucas_id,
                adjust_type:this.data.currentAdjust,
            },
            success:(r:any)=>{
                this.set({info:r.data});
                this.hideAdjust();
            }
        })
    }
    /**
     * 上海隐藏调剂弹窗
     */
    hideAdjust(){
        let adjust:any=this.getComp("#adjust");
        adjust.toHide();
    }
    /**
     * 修改调剂 常规省 
     */
     adjust(e:any){
        let {index}=this.getElDataSet(e);
        let item=this.data.info.application_school_list[index];
        getData(`/data_service/v1/auth/application/school/update_adjust`,{
            method:"PUT",
            data:{
                uca_id: this.data.uca_id,
                ucas_id: item.ucas_id,
                is_adjust: !item.is_adjust
            },
            success:(r:any)=>{
                this.data.info.application_school_list[index].is_adjust=!item.is_adjust;
                this.set({info:this.data.info});
            }
        })
     }
    /**
     * 上移或下移
     * @param e 
     */
    move(e:any){
        if(!this.canEdit()) return;
        let {index,sort}=this.getElDataSet(e);
        let item=this.data.info.application_school_list[index];
        let data={
            uca_id: this.data.uca_id,
            ucas_id: item.ucas_id,
            sort_type: sort,//上移1/下移2，针对常规省/上海/学上海使用，等于0则无效
            sort_index: 0,//移到特定的位置，针对浙江/学浙江使用，等于0则无效
        }
        this.httpSort(data);
    }
    httpSort(data:any){
        getData(`/data_service/v1/auth/application/school/update_sort`,{
            method:"PUT",
            data,
            success:(r:any)=>{
                this.set({info:r.data});
            }
        })
    }
    /**
     * 编辑
     * @param e 
     */
    edit(e:any){
        if(!this.canEdit()) return;
        let {index}=this.getElDataSet(e);
        this.set({currentIndex:index});
        this.set({sortIndex:index});
        let c:any=this.getComp("#sort");
        c.toShow();
    }
    // 监听排序
    watchSort(e:any){
        this.set({sortIndex:e.detail.value[0]})
    }
    /**
     * 排序
     */
    setSort(){
        if(!this.canEdit()) return;
        let c:any=this.getComp("#sort");
        c.toHide();
        let data={
            uca_id: this.data.uca_id,
            ucas_id: this.data.info.application_school_list[this.data.currentIndex].ucas_id,
            sort_type: 0,//上移1/下移2，针对常规省/上海/学上海使用，等于0则无效
            sort_index: this.data.sortIndex+1,//移到特定的位置，针对浙江/学浙江使用，等于0则无效
        }
        this.httpSort(data);
    }
    /**
     * 删除
     * @param e 
     */
    delete(e:any){
        if(!this.canEdit()) return;
        let {index}=this.getElDataSet(e);
        let item=this.data.info.application_school_list[index];
        getData(`/data_service/v1/auth/application/school/del`,{
            method:"DELETE",
            data:{
                uca_id:this.data.uca_id,
                ucas_id:item.ucas_id,
            },
            success:(r:any)=>{
                this.set({info:r.data});
            }
        })
    }
    getInfo(){
        getData(`/data_service/v1/auth/application/${this.data.uca_id}`,{
            success:(r:any)=>{
                this.set({info:r.data});
                wx.setNavigationBarTitle({title:r.data.application.application_name});
                if(this.data.globalUserInfo.prov_model_ex!=1){
                    this.set({scrollview:"bottom"});
                }
                let sorts=[];
                for(let i=0;i<r.data.application_school_list.length;i++){
                    sorts.push(r.data.application_school_list[i].sort_index_str);
                }
                this.set({sorts});
            }
        })
    }
    //是否可编辑
    canEdit():boolean{
        if(!this.data.info.application.is_support_update){
            wx.showModal({
                title:"提示",
                content:this.data.info.application.is_support_update_desc,
            })
        }
        return this.data.info.application.is_support_update;
    }
    //添加学校或者专业或者专业组
    toAddSchool(e:any){
        if(!this.canEdit()) return;
        let {sort}=this.getElDataSet(e);
        wx.navigateTo({url:`/pages/zhiyuan/addSchool/addSchool?uca_id=${this.data.uca_id}&sort_index=${sort}`});
    }
    // 添加专业
    toAddMajor(e:any){
        if(!this.canEdit()) return;
        let {item}=this.getElDataSet(e);
        wx.navigateTo({url:`/pages/zhiyuan/addMajor/addMajor?uca_id=${this.data.uca_id}&ucas_id=${item.ucas_id}&school_id=${item.school_id}&subject_group_id=${item.subject_group_id}`});
    }
    onInit(e:any){
        this.set({uca_id:Number(e.uca_id)});
    }
    onShow(){
        this.getInfo();
    }
}
Page(new _zhiyuanDetail());