import { translateUrl } from '../../../utilTs/util';
// pages/component/articleContent/articleContent.js
Component({
  options:{
    addGlobalClass:true,
  },
  properties: {
    content:{
      type:String,
      value:""
    }
  },
  data: {
    nodes:[]
  },
  lifetimes:{
    ready(){
      let nodes:any[]=this.properties.content.replace(/<\/div><p/g,`<\/div>==0==<p`).replace(/<\/div><div/g,`<\/div>==0==<div`).replace(/<\/section>/g,`</section>==0==`).replace(/<\/p>/g,`</p>==0==`).split(`==0==`);
      nodes.map((node:any,i:number)=>{
        if(node.indexOf(`yuanmeng://`)!=-1){
          // nodes[i]=`这是一个链接`
          let urls=node.match(/yuanmeng:\/\/.+?["|']/gi)[0].replace(/["|']/g,'').split("?");
          nodes[i]={
            type:"link",
            link:urls[1]?`${translateUrl[urls[0]]}?${urls[1]}`:translateUrl[urls[0]],
            node,
          };
        }else if(/https?:\/\/.+?\.pdf/gi.test(node)){
          //pdf
          let url=node.match(/https?:\/\/.+?\.pdf/gi);
          nodes[i]={
            type:"pdf",
            url:url[0],
            node,
          }
        }
        else if(/https?:\/\/.+?\.(jpg|png|svg|jpeg|gif)/gi.test(node)){
          // 图片
          let url=node.match(/https?:\/\/.+?\.(jpg|png|svg|jpeg|gif)/gi);
          nodes[i]={
            type:"image",
            url:url,
            node,
          };
        }else{
          //rich-text不支持 color="#111111" 这种
          let colors:any=node.match(/color=\"#.*?\"/g);
          colors?.map((item:string)=>{
            //@ts-ignore
            let color=item.replace(/\'|\"/,'').replace("=",":");
            node=node.replace(item,`style=\"${color}\"`);
          })
          nodes[i]={
            type:"text",
            node,
          };
        }
        
      })
      this.setData({nodes});
    },
  },
  methods: {
    previewImg(e:any){
      let item=e.currentTarget.dataset.item;
      wx.previewImage({urls:item.url});
    },
    previewPdf(e:any){
      let item=e.currentTarget.dataset.item;
      wx.showLoading({title:`加载中，请稍后···`});
      wx.downloadFile({
        url: item.url,
        success: function (res) {
          const filePath = res.tempFilePath;
          wx.openDocument({
            filePath: filePath,
            success: function (res) {
              wx.hideLoading();
            }
          })
        }
      })
    }
  }
})
