Component({
  options:{
    addGlobalClass:true,
  },
  properties: {
    lineWidth:{
      type:Number,
      value:0.08,
    },
    bgColor:{
      type:String,
      value:"#eaeaea",
    },
    color:{
      type:String,
      value:"#999",
    },
    title:{
      type:String,
      value:""
    },
    percent:{
      type:Number,
      value:0
    },
  },
  data: {
    percent:null,
    width:80,
  },
  lifetimes:{
    ready(){
      this.init();
    }
  },
  methods: {
    init(){
      let {lineWidth,bgColor,color,percent}=this.data;
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
          ctx.font=`${width*0.12}px sans-serif`;
          ctx.fillStyle="#999";
          ctx.fillText("录取率", width/2,width*0.9);
          
          // 环形底色
          ctx.lineCap='round';
          ctx.lineWidth=width*lineWidth;
          const fullDeg=Math.PI*2*0.8;
          const startDeg=0.5*Math.PI+(2*Math.PI-fullDeg)/2;
          ctx.strokeStyle=bgColor;
          ctx.beginPath();
          ctx.arc(width/2, width/2, (width-ctx.lineWidth)/2,startDeg, startDeg+fullDeg, false);
          ctx.stroke();
          // 比例环形底色
          ctx.strokeStyle=color;
          ctx.beginPath();
          ctx.arc(width/2, width/2, width/2-ctx.lineWidth/2,startDeg, startDeg+fullDeg*percent, false);
          ctx.stroke();
        })
      }).exec()
    }
  }
})
