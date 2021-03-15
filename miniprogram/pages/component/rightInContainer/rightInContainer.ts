// pages/component/rightInContainer.js
Component({
  options:{
    multipleSlots:true,
    addGlobalClass:true,
  },
  /**
   * 组件的属性列表
   */
  properties: {
  },

  /**
   * 组件的初始数据
   */
  data: {
    isShow:false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toShow(){
      this.setData({isShow:true})
    },
    toHide(){
      this.setData({isShow:false});
    },
    onHide(e?:any){
      // this.triggerEvent('onHide');
      this.triggerEvent('hide');
    }
  }
})
