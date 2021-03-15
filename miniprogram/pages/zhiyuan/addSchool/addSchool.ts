import { getData } from '../../../utilTs/util';
import { AddSchoolBase } from '../addSchool.base';
class _addSchool extends AddSchoolBase{
    constructor(protected listApi: string, public type: number) {
        super(listApi, type);
        this.data={
            ...this.data,
            sort_index:null,
            tabIndex:0,
            beixuanFirst:true,//第一次请求我的备选无数据将会跳转到VIP精选
            scrollTop:0,
            sorts:[null,null],
            sortValue:null,
            isShowSorts:false,
        }
    }
    //改变排序方式
    changeSort(e:any){
        let {item,index}=this.getElDataSet(e);
        this.data.sorts[this.data.tabIndex].default_value=item;
        this.data.sorts[this.data.tabIndex].default_index=index;
        this.set({sorts:this.data.sorts});
        this.data.list=null,
        this.data.listPage={page:0,page_count:1};
        this.getList();
        this.set({isShowSorts:false});
    }
    //显示或隐藏排序
    showSorts(){
        this.set({isShowSorts:!this.data.isShowSorts});
    }
    changeTab(e?:any){
        if(e){
           this.set({tabIndex:e.detail}); 
        }
        if(this.data.tabIndex==0){
            this.listApi=`/data_service/v1/auth/alternative/school/list`;
        }else{
            this.listApi=`/data_service/v1/auth/probability/can_up/vip_list`;
        }
        this.data.list=null,
        this.data.listPage={page:0,page_count:1};
        this.getSort();
        this.getList();
    }
    getSort(){
        // 浙江省暂无排序
        if(this.data.globalUserInfo.prov_model_ex==3)return;
        if(!this.data.sorts[this.data.tabIndex]){
            getData(`/data_service/v1/auth/alternative/application/search`,{
                data:{search_tag:this.data.tabIndex==0?1:2},
                success:(r:any)=>{
                    this.data.sorts[this.data.tabIndex]=r.data.search_list[0];
                    this.set({sorts:this.data.sorts});
                }
            })
        }
    }
    onInit(e:any){
        this.set({uca_id:e.uca_id?Number(e.uca_id):0});
        this.set({sort_index:e.sort_index?Number(e.sort_index):0});
        this.getSort();
        this.getList();
    }
}
Page(new _addSchool(`/data_service/v1/auth/alternative/school/list`,2))