interface LineChartDatas{
  reverse:any,
  xaxis:any,
  xtag:any,
  datas:any,
  dataTag:any,
  subDatas:any,
  subDataTag:any,
  color:any,
  dataColor:any,
  subDataColor:any,
  lineAreaPercent:any,
}
// 将16进制颜色改成rgba
function colorRgb(color:string){
  color = color.toLowerCase();
  var pattern = /^#([0-9|a-f]{3}|[0-9|a-f]{6})$/;
  if(color && pattern.test(color)) {
      if(color.length == 4) {
          // 将三位转换为六位
            color = '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
      }
      //处理六位的颜色值
      var colorNew = [];
      for (var i=1; i<7; i+=2) {
          colorNew.push(parseInt("0x"+color.slice(i, i+2)));  
      }
      return "RGB(" + colorNew.join(",") + ")";
  }
  return color;
};
Component({
  properties: {
    datas:null,
  },
  data: {
    width:80,
    height:80,
  },
  lifetimes:{
    ready(){
      this.init();
    }
  },
  methods: {
    init(){
        const chartContainer = this.createSelectorQuery()
        chartContainer.select('#chartContainer').boundingClientRect((r:any)=>{
        let width=r.width,height=width*0.5;
        this.setData({width:width});
        this.setData({height:height});
        let canvasQuery=this.createSelectorQuery();
        //@ts-ignore
        canvasQuery.select("#lineCanvas").fields({ node: true, size: true })
        .exec((res) => {
          const canvas = res[0].node
          const ctx = canvas.getContext('2d');
          let dpr = wx.getSystemInfoSync().pixelRatio;
          let 
          fontSizeRate=(width<320?0.78:(width>414?1:width/414)),
          left=fontSizeRate*20,
          right=width-left,
          dataLeft=left*2,
          dataRight=width-dataLeft,
          dataTop=fontSizeRate*50,
          bottom=height-fontSizeRate*30,
          dataBottom=bottom-fontSizeRate*20;
          const isAnd=wx.getSystemInfoSync().system.indexOf("iOS")==-1;
          dpr=isAnd?dpr:1;
          canvas.width = width *dpr;
          canvas.height = width*0.5*dpr;
          ctx.scale(dpr, dpr);
          //@ts-ignore
          let d:LineChartDatas={lineAreaPercent:0.3,xtag:'',xaxis:[],dataTag:'',datas:[],subDataTag:'',subDatas:[], color:"#3F9FF8",subDataColor:"#999",reverse:false,...this.data.datas}
          let {reverse,xaxis,xtag,datas,dataTag,subDatas,subDataTag,color,dataColor,subDataColor,lineAreaPercent}=d;
          let dataValue:any=datas;
          dataColor=color;
           // 清除画布
          ctx.clearRect(0,0,width,height);
          // 画x轴
          ctx.strokeStyle="#eaeaea";
          ctx.lineWidth=height*0.003;
          ctx.beginPath();
          ctx.moveTo(left,bottom);
          ctx.lineTo(right,bottom);
          ctx.stroke();
          //x轴标注
          let xPoints:any=[];
          ctx.fillStyle="#999";
          ctx.textAlign="center";
          ctx.textBaseline="top";
          ctx.font=`${fontSizeRate*14}px  Helvetica`;
          let dataLength=xaxis.length;
          let everyX=(dataRight-dataLeft)/2;
          if(dataLength>1){
              everyX=(dataRight-dataLeft)/(dataLength-1);
              for(let i=0;i<xaxis.length;i++){
                  let x=dataLeft+i*everyX;
                  xPoints.push(x);
                  ctx.beginPath();
                  ctx.fillText(xaxis[i]+xtag,x,bottom+fontSizeRate*8);
                  ctx.fill();
              }
          }else{
              let x=dataLeft+everyX;
              xPoints=[dataLeft+(dataRight-dataLeft)*0.5];
              ctx.beginPath();
              ctx.fillText(xaxis[0]+xtag,x,bottom+fontSizeRate*8);
              ctx.fill();
          }
          //计算点的Y轴位置
          let max=Math.max(...datas);
          let min=Math.min(...datas);
          let randYPercent=0.2;//折线波动范围
          let everyH=0;
          if(max!=min){
              if(lineAreaPercent){
                  randYPercent=lineAreaPercent;
              }else{
                  randYPercent=(max-min)/max;
              }
              everyH=randYPercent*(dataBottom-dataTop)/(max-min);
          }
          const movedH=(dataBottom-dataTop)*(1-randYPercent)/2;
          dataBottom=dataBottom-movedH;
          dataTop=dataTop+movedH;
          // 画色块
          let yPoints:any=[];
          ctx.beginPath();
          let grd=ctx.createLinearGradient(0,dataTop,0,bottom);
          // grd.addColorStop(0,"rgba(63, 159, 248, 0.14)");
          // grd.addColorStop(1,"rgba(63, 159, 248, 0)");
          
          let rgbaColor=colorRgb(color).replace("RGB","RGBA");
          grd.addColorStop(0,rgbaColor.replace(')',',0.14)'));
          grd.addColorStop(1,rgbaColor.replace(')',',0)'));
          ctx.fillStyle=grd;
          ctx.moveTo(dataRight,bottom);
          ctx.lineTo(dataLeft,bottom);
          if(dataLength>1){
              datas.map((item:any,i:number)=>{
                  let y;
                  if(reverse){
                      y=dataTop+(item-min)*everyH;
                  }else{
                      y=dataBottom-(item-min)*everyH;
                  }
                  yPoints.push(y);
                  ctx.lineTo(xPoints[i],y);
              });
          }else{
              let y;
              if(reverse){
                  y=dataTop;
              }else{
                  y=dataBottom;
              }
              yPoints.push(y);
              ctx.lineTo(dataLeft,y);
              ctx.lineTo(dataRight,y);
          }
          ctx.closePath();
          ctx.fill();
          // 画折线
          ctx.beginPath();
          ctx.strokeStyle=color;
          ctx.lineWidth=fontSizeRate*2;
          if(dataLength>1){
              datas.map((item:any,i:number)=>{
                  if(i==0){
                      ctx.moveTo(xPoints[i],yPoints[i]);
                  }else{
                      ctx.lineTo(xPoints[i],yPoints[i]);
                  }
              })
          }else{
              let y=dataBottom;
              ctx.moveTo(dataLeft,y);
              ctx.lineTo(dataRight,y);
          }
          ctx.stroke();
          //折线点和折线文字标注
          ctx.textAlign="center";
          ctx.textBaseline="bottom";
          ctx.font=`${fontSizeRate*16}px  Helvetica`;
          dataValue.map((item:any,i:number)=>{
              ctx.beginPath();
              ctx.fillStyle="#fff";
              ctx.arc(xPoints[i],yPoints[i],fontSizeRate*4.5,0,Math.PI*2);
              ctx.fill();
              ctx.stroke();
              ctx.fillStyle=dataColor;
              if(subDataTag!=''){
                  ctx.font=`${fontSizeRate*18}px  Helvetica`;
                  ctx.fillText(item+dataTag,xPoints[i],yPoints[i]-fontSizeRate*30);
                  ctx.font=`${fontSizeRate*14}px  Helvetica`;
                  ctx.fillStyle=subDataColor;
                  ctx.fillText(`(${subDatas[i]}${subDataTag})`,xPoints[i],yPoints[i]-fontSizeRate*10);
              }else{
                  ctx.fillText(item+dataTag,xPoints[i],yPoints[i]-fontSizeRate*10);
              }
          })
        })
      }).exec()
    }
  }
})
