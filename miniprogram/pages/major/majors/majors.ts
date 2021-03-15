import { getData, BasePage } from '../../../utilTs/util';
let options:any;
class _majors extends BasePage{
  data={
    options,
    lv1:0,
    lv2:0,
    info:null,
    tabItems:null,
    tabIndex:0,
    scrollViewHeight:0,
  }
  changeRootMajor(e:any){
    this.set({lv1:e.currentTarget.dataset.index});
    this.set({lv2:0});
  }
  changeSecMajor(e:any){
    let index=e.currentTarget.dataset.index;
    if(this.data.lv2==index){
      this.set({lv2:null});
    }else{
      this.set({lv2:index});
    }
  }
  setScrollContainner(){
    const topContainer=wx.createSelectorQuery();
    topContainer.select("#topContainer").boundingClientRect((r:any)=>{
      const syst:any=wx.getSystemInfoSync();
      this.set({scrollViewHeight:syst.windowHeight-r.height});
    }).exec()
  }
  changeTab(e:any){
    this.set({tabIndex:e.detail});
    this.set({lv1:0});
    this.set({lv2:0});
  }
  getInfo(){
    getData(`/static_service/v1/allow/major/all_major`,{
      success:(r:any)=>{
        let items:any[]=[];
        r.data.map((item:any)=>{
          items.push(item.type_name);
        })
        if(this.data.options){
          // 选中本科或者专科
          r.data[this.data.tabIndex].root_major_list.map((root:any,index:number)=>{
            if(root.major_id==this.data.options.root_major_id){
              setTimeout(() => {
                this.set({lv1:index});
              }, 0);
              root.sec_major_list.map((sec:any,i:number)=>{
                if(sec.major_id==this.data.options.major_id){
                  setTimeout(() => {
                    this.set({lv2:i});
                  }, 0);
                }
              })
            }
          })
        }
        this.set({tabItems:items});
        this.set({info:r.data});
        this.setScrollContainner();
      }
    })
  }
  onInit(e:any){
    this.set({options:e});
    this.set({tabIndex:this.data.options.major_type==2?1:0});
    this.getInfo();
  }
}
Page(new _majors());