import { toast } from '../../../utilTs/util';
// pages/component/copy/copy.js
Component({
  options: {
    multipleSlots: true,
    addGlobalClass: true,
  },
  properties: {
    id:{
      type:String,
      value:"",
    },
    value:{
      type:String,
      value:"",
    },
  },
  data: {
    isShowCopy:false,
  },
  methods: {
    show(){
      this.setData({isShowCopy:true});
      // 隐藏其他copy
      this.triggerEvent('show');
    },
    hide(){
      this.setData({isShowCopy:false});
    },
    copy(){
      wx.setClipboardData({
        data: this.data.value,
        success: (res) => {
          toast("复制成功");
          this.setData({isShowCopy:false});
        },
      });
    }
  }
})
