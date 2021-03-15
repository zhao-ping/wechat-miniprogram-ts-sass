// pages/component/tab/tab.js
Component({
  properties: {
    mode:{
      type:String,
      value:"string",//object | string
    },
    key:{
      type:String,
      value:"k",
    },
    items:Array,
    index:Number,
  },
  data: {
    aniLine:null,
    index:0,
    items:[],
  },
  methods: {
    aniStart:function(width:number,left:number){
      var animation = wx.createAnimation({
        duration: 300,
        timingFunction: 'ease',
      });
      animation.width(width).left(left).step();
      this.setData({
        aniLine:  animation.export()
      })
    },
    setIndex(index:number){
      this.setData({index:index});
      this.setTab();
    },
    setTab(e?:any){
      let index:number=this.data.index;
      if(e){
        index=e.currentTarget.dataset.index;
        this.setData({index:index});
        this.triggerEvent('change', index,{});
      }
      let item=this.createSelectorQuery();
      item.selectAll(".item").boundingClientRect((r: { [x: string]: any; })=>{
        let currentItem:any=r[index];
        let width=currentItem.width*0.5,left=currentItem.left+currentItem.width*0.25;
        this.aniStart(width,left);
      }).exec();
    }
  },
  lifetimes:{
    ready(){
      this.setTab();
    }
  }
})
