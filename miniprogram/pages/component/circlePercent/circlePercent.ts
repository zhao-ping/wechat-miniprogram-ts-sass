Component({
  properties: {
    lineWidth:{
      type:Number,
      value:0.1,
    },
    bgColor:{
      type:String,
      value:"#eaeaea",
    },
    color:{
      type:String,
      value:"#4d89ff",
    },
    title:{
      type:String,
      value:""
    },
    percent:{
      type:Number,
      value:0.5
    },
  },
  data: {
    width:80,
  },
  lifetimes:{
    ready(){
      this.draw();
    }
  },
  methods: {
    draw(){
      const circlePercentContainer = this.createSelectorQuery()
      circlePercentContainer.select('#circlePercentContainer').boundingClientRect((r:any)=>{
        let width=r.width;
        this.setData({width:width});
        let canvasQuery=this.createSelectorQuery();
        //@ts-ignore
        canvasQuery.select("#canvas").fields({ node: true, size: true })
        .exec((res) => {
          const canvas = res[0].node
          const ctx = canvas.getContext('2d')
          let dpr = wx.getSystemInfoSync().pixelRatio;
          const isAnd=wx.getSystemInfoSync().system.indexOf("iOS")==-1;
          dpr=isAnd?dpr:1;
          canvas.width = width *dpr;
          canvas.height = width *dpr;
          ctx.scale(dpr, dpr);
          
          ctx.textAlign='center';
          ctx.textBaseline='middle';
          ctx.font=`${width*0.2}px sans-serif`;
          ctx.fillStyle="#2f2f2f";
          ctx.fillText(this.data.title, width/2,width/2);
          
          // 环形底色
          // ctx.lineCap='round';
          ctx.lineWidth=width*this.data.lineWidth;
          const startDeg=-0.5*Math.PI;
          ctx.strokeStyle=this.data.bgColor;
          ctx.beginPath();
          ctx.arc(width/2, width/2, (width-ctx.lineWidth)/2,0, Math.PI*2, false);
          ctx.stroke();
          // 比例环形底色
          ctx.strokeStyle=this.data.color;
          ctx.beginPath();
          ctx.arc(width/2, width/2, width/2-ctx.lineWidth/2,startDeg, Math.PI*2*this.data.percent+startDeg, false);
          ctx.stroke();
        })
      }).exec()
    }
  }
})
