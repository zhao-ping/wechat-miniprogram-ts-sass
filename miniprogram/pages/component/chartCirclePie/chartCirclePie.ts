// pages/component/chartCirclePie/chartCirclePie.js
let ctx:any;
type PieItem={
  k:string,
  v:number,
  color:string,
  percent:number,
  startAngle:number,
  endAngle:number,
}
let datas:PieItem[]=[];
Component({
  options:{
    addGlobalClass:true,
  },
  properties: {
    lineWidth:{
      type:Number,
      value:0.2,
    },
    items:{
      type:Array,
      value:[]
    },
    index:{
      type:Number,
      value:0,
    }
  },
  data: {
    startAngle:-0.5*Math.PI,
    offset:0.25,
    index:0,
    width:0,
    canvasWidth:0,
    datas,
  },
  lifetimes:{
    ready(){
      this.init();
    }
  },
  methods: {
    calculate(){
      let datas:PieItem[]=[];
      let startAngle=this.data.startAngle;
      this.data.items.map((item:any,i:number)=>{
        let newItem:PieItem={startAngle,endAngle:startAngle+Math.PI*2*(item.v/100),...item,percent:item.v%100,};
        datas.push(newItem);
        startAngle=newItem.endAngle;
      })
      this.setData({datas:datas});
    },
    draw(){
      ctx.clearRect(0,0,this.data.width,this.data.width);
      let 
      width=this.data.width,
      lineWidth=width*this.data.lineWidth,
      offset=lineWidth*this.data.offset,
      r=(width-lineWidth)/2-offset,
      center=[width/2,width/2];
      ctx.lineWidth=lineWidth;
      this.data.datas.map((item:PieItem,i:number)=>{
        ctx.beginPath();
        ctx.strokeStyle=item.color;
        let itemCenter:Array<number>=[];
        if(i==this.data.index){
          let offsetAngle=item.startAngle+(item.endAngle-item.startAngle)/2;
          let degree=offsetAngle-this.data.startAngle;
          if(-0.5*Math.PI<=offsetAngle&&offsetAngle<0){
            // 1象限
            itemCenter=[
              center[0]+offset*Math.sin(degree),
              center[0]-offset*Math.cos(degree),
            ]
          }else if(0<=offsetAngle&&offsetAngle<0.5*Math.PI){
            // 2象限
            itemCenter=[
              center[0]+offset*Math.sin(Math.PI-degree),
              center[0]+offset*Math.cos(Math.PI-degree),
            ]
          }
          else if(0.5*Math.PI<=offsetAngle&&offsetAngle<Math.PI){
            // 3象限
            itemCenter=[
              center[0]-offset*Math.sin(degree-Math.PI),
              center[0]+offset*Math.cos(degree-Math.PI),
            ]
          }
          else if(Math.PI<=offsetAngle&&offsetAngle<1.5*Math.PI){
            // 4象限
            itemCenter=[
              center[0]-offset*Math.sin(-degree),
              center[0]-offset*Math.cos(-degree),
            ]
          }
        }
        let c=(i==this.data.index?itemCenter:center);
        ctx.arc(...c,r,item.startAngle,item.endAngle,false);
        ctx.stroke();
      })
    },
    init(){
      const canvasContainer=this.createSelectorQuery();
      canvasContainer.select("#canvasContainer").boundingClientRect((r:any)=>{
        let width=r.width;
        this.setData({width:width});
        let canvasQuery=this.createSelectorQuery();
        this.setData({width:r.width});
        //@ts-ignore
        canvasQuery.select("#canvas").fields({ node: true, size: true })
        .exec((res) => {
          const canvas = res[0].node
          ctx = canvas.getContext('2d')
          let dpr = wx.getSystemInfoSync().pixelRatio;
          const isAnd=wx.getSystemInfoSync().system.indexOf("iOS")==-1;
          dpr=isAnd?dpr:1;
          canvas.width = width *dpr;
          canvas.height = width *dpr;
          this.setData({canvasWidth:canvas.width});
          ctx.scale(dpr, dpr);
          ctx.fillRect(0,0,width,width);
          this.calculate();
          this.draw();
        })
      }).exec()
    },
    changeByTab(e:any){
      let [x0,y0]=[e.currentTarget.offsetLeft+this.data.width/2,e.currentTarget.offsetTop+this.data.width/2];
      let [x1,y1]=[e.detail.x,e.detail.y];
      let angle=Math.atan((y1-y0)/(x1-x0));
      if(x1<x0){
        angle=Math.PI+angle;
      }
      for(let i=0;i<this.data.datas.length;i++){
        let item:PieItem=this.data.datas[i];
        if(item.startAngle<angle&&item.endAngle>=angle){
          this.changeByIndex(i);
          break;
        }
      } 
    },
    changeByIndex(i:number){
      this.setData({index:i});
      this.draw();
    }
  }
})
