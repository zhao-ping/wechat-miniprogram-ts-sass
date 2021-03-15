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
    show:{
      type:Boolean,
      value:false,
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    isShow:false,
  },
  ready(){
    this.setData({isShow:this.data.show});
  },
  /**
   * 组件的方法列表
   */
  methods: {
    toShow(){
      this.setData({isShow:true})
    },
    toHide(emit:boolean=true){
      this.setData({isShow:false});
      if(emit){
        this.triggerEvent('hide');
      }
    },
    onHide(e:any){
      this.triggerEvent('onHide',e)
    }
  }
})
