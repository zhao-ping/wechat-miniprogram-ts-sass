import { getData, toast } from '../../../utilTs/util';
// miniprogram/pages/user/feedback/feedback.js
Page({
  data:{
    content:null,
    contact:null,
  },
  feedback(){
    if(!this.data.content){
      toast("请输入反馈内容");
      return;
    }
    let data={
      content:this.data.content,
      contact:this.data.contact,
    };
    getData(`/user_service/v1/auth/user/feedback`,{
      method:"POST",
      data,
      success:(r)=>{
        toast("反馈成功");
        setTimeout(() => {
          wx.switchTab({url:`/pages/user/user/user`})
        }, 2000);
      }
    })
  }
})