import { AddSchoolBase } from '../addSchool.base';
class _addSearch extends AddSchoolBase{
  constructor(listApi:string,type:number){
    super(listApi,type);
    this.data={
      ...this.data,
      school_name:"",
    }
  }
  reserch(){
    this.data.listPage={
      page:0,
      page_count:1,
    }
    this.set({list:null});
    this.getList();
  }
  onInit(e:any){
    this.set({uca_id:e.uca_id?Number(e.uca_id):0});
    this.set({sort_index:e.sort_index?Number(e.sort_index):0});
  }
}
Page(new _addSearch(`/data_service/v1/auth/application/school/search_list`,2))