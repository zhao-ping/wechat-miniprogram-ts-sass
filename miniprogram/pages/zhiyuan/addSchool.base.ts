import { ScoreChooseBase } from '../../utilTs/scoreChoose.base';
import { getData } from '../../utilTs/util';
//填志愿-添加学校或者专业组，浙江添加专业 需要继承的class
export class AddSchoolBase extends ScoreChooseBase{
    constructor(protected listApi: string, public type: number) {
        super(listApi, type);
        this.data={
            ...this.data,
            isZhiyuanPage:true,//是否是填志愿流程页面
            uca_id:null,
            statusBarHeight:0,
        }
    }
    /**
     * 返回志愿表
     */
    toApplication(){
        wx.navigateBack();
    }
    //浙江填报专业
    addMajor(e:any){
        let {item,index}=this.getElDataSet(e);
        let url:string,data:any;
        if(item.is_application_checked){
            url=`/data_service/v1/auth/application/school/del`;
            data={
                uca_id:this.data.uca_id,
                ucas_id:item.ucas_id,
            }
        }else{
            url=`/data_service/v1/auth/application/school/add`;
            data={
                uca_id:this.data.uca_id,
                school_id:item.school_id,
                subject_group_id:item.subject_group_id,
                subject_limit_id:item.subject_limit_id,
                major_id:item.major_id,
                match_id:item.match_id,
                sort_index:this.data.sort_index,
            }
        }
        getData(url,{
            method:item.is_application_checked?"DELETE":'POST',
            data,
            success:(r:any)=>{
                this.data.list[index].ucas_id=r.data.ucas_id;
                this.data.list[index].is_application_checked=!item.is_application_checked;
                this.set({list:this.data.list});
            }
        })
    }
    /**
     * 常规省填报学校 或者 上海填报专业组
     * @param e 
     */
    addSchool(e:any){
        let {item,index}=this.getElDataSet(e);
        let url:string=item.is_application_checked?`/data_service/v1/auth/application/school/del`:`/data_service/v1/auth/application/school/add`;
        let data:any;
        if(item.is_application_checked){
            url=`/data_service/v1/auth/application/school/del`;
            data={
                uca_id: this.data.uca_id,
                ucas_id:item.ucas_id,
                school_id: item.school_id,
                subject_group_id: item.subject_group_id,
            }
        }else{
            url=`/data_service/v1/auth/application/school/add`;
            data={
                uca_id: this.data.uca_id,
                school_id: item.school_id,
                subject_group_id: item.subject_group_id,
                subject_limit_id: item.subject_limit_id,
                major_id: item.major_id,
                match_id: 1,
                sort_index: this.data.sort_index,
                is_adjust: true,
                adjust_type: null,
            };
        }
        getData(url,{
            data,
            method:item.is_application_checked?"DELETE":"POST",
            success:(r:any)=>{
                this.data.list[index].is_application_checked=!item.is_application_checked;
                this.set({list:this.data.list});
                if(this.data.sort_index){
                    wx.navigateBack();
                }else{
                    this.data.list[index].ucas_id=r.data.ucas_id;
                }
            }
        })
    }
    onInit(e:any){
        this.set({uca_id:e.uca_id?Number(e.uca_id):0});
        this.set({sort_index:e.sort_index?Number(e.sort_index):0});
        this.getList();
    }
    onShow(){
        const app:any=getApp();
        this.set({statusBarHeight:app.systemInfo.statusBarHeight});
    }
}