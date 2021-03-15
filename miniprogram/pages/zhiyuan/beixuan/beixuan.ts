import { ScoreChooseBase } from "../../../utilTs/scoreChoose.base";
import { getData } from '../../../utilTs/util';
// miniprogram/pages/zhiyuan/scoreSchool/scoreSchool.js
class _beixuan extends ScoreChooseBase {
  constructor(protected listApi: string, public type: number) {
    super(listApi, type);
    this.data = {
      ...this.data,
      schoolIndex:null,
      popupSchool:null,
    };
  }
  /**
   * 获取备选列表筛选条件
   */
  getSearch(){
    getData(`/data_service/v1/auth/alternative/school/list/search`,{
      success:(r:any)=>{
        this.set({ filterList: r.data.search_list });
        this.getList()
      }
    })
  }
}
Page(new _beixuan(`/data_service/v1/auth/alternative/school/list`, 1));
