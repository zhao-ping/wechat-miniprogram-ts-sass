import {  BasePage } from '../../../utilTs/util';
class _page extends BasePage{
  onInit(e:any){
    console.log(e);
    this.toast("hello");
  }
}
Page(new _page());