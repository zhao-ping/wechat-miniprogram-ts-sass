import * as TIM from 'tim-wx-sdk';
import * as TIMUploadPlugin from "tim-upload-plugin";
import { parseEmojiText } from './emojiMap';
import { timOpen } from '../utilTs/conf';
import { Md5 } from 'ts-md5';
export const translateUrl:any = {
  "yuanmeng://home": "/pages/home/home/home",                    // APP首页 只要是yuanmeng:// 都可以到app首页
  "yuanmeng://major_detail": "/pages/major/major/major",                   //专业详情
  "yuanmeng://school_detail": "/pages/school/school/school",                  //学校详情
  "yuanmeng://buy_vip": "/pages/vip/info/info",                        //VIP展示页面
  "yuanmeng://user_bei_xuan": "/pages/zhiyuan/beixuan/beixuan",                  //用户中心我的备
  "yuanmeng://can_school": "/pages/zhiyuan/possibleSchools/possibleSchools",                     //能上的学校
  "yuanmeng://school_rank": "/pages/school/rankType/rankType",                    //学校排行首页
  "yuanmeng://school_rank_detail": "/pages/school/rankType/rankType",             //学校排行 指定页   id// 武书连Id。。message// 武书连。。。
  "yuanmeng://all_scholl": "/pages/school/schools/schools",                    //学校大全
  "yuanmeng://all_major": "/pages/major/majors/majors",                     //专业大全
  "yuanmeng://probability_forecast_search": "/pages/school/searchSchoolPossibility/searchSchoolPossibility",    //概率预测搜索页面
  "yuanmeng://school_probability_detail": "/pages/school/searchSchoolPossibility/searchSchoolPossibility",      //学校概率测试页面。  需要后台判断用户是否是VIP id 学校ID
  "yuanmeng://problem_home": "/pages/user/question/questions/questions",                  //常见问题首页 id // 1产品使用 2 产品购买 3 产品安全
  "yuanmeng://major_home": "/pages/major/majors/majors",                    //专业大全首页
  "yuanmeng://update_score": "/pages/user/setScore/setScore",                  //修改分数
  "yuanmeng://valunteer_edit": "/pages/zhiyuan/zhiyuans/zhiyuans",               //填志愿  0 新建 其他为修改志愿
  "yuanmeng://score_line": "/pages/home/provinceLine/provinceLine",                  //批次线
  "yuanmeng://subsection_line": "/pages/home/scoreRank/scoreRank",               //一分一段表
  "yuanmeng://plan_detail": "/pages/school/searchSchoolPlan/searchSchoolPlan",                  //招生计划详情
  "yuanmeng://plan_search": "/pages/school/searchSchoolPlan/searchSchoolPlan",                  //招生计划搜索
  "yuanmeng://question": "/pages/user/question/questions/questions",                    // 常见问题
  "yuanmeng://choose_subject": "/pages/newSubject/newSubject/newSubject",                //新高考选科
  "yuanmeng://my_volunteer_form":"/pages/zhiyuan/zhiyuans/zhiyuans",//志愿风险评估
  "yuanmeng://grade_report":"/pages/scoreReport/report/report",//成绩报告
  "yuanmeng://search_major":"/pages/zhiyuan/scoreMajor/scoreMajor", //按分数选专业
  "yuanmeng://search_school":"/pages/zhiyuan/scoreSchool/scoreSchool",//按分数选学校
  "yuanmeng://quality_article_detail":"/pages/article/suxueDetail/suxueDetail"//填报速学
}
const app:any=getApp();
/**
 * http请求返回数据格式定义
 */
interface Ipager{
  page:number;
  count:number;
  pagecount:number;
}
export
interface IresBody{
  auth_token:String;
  data:any;
  pager:Ipager;
}
export
interface Iresponse{
  code:number;
  body:IresBody;
  msg:string;
  time:number;
}
// 请求数据
let mistiming=0;
export
function getData(url:string,
  {showLoadding=false,method="GET",data={},success=function(r:any){},fail=function(r:any){}}:
  {showLoadding?:boolean,method?:"GET"|"PUT"|"OPTIONS"|"POST"|"DELETE",data?:any,success?:(r:any)=>void,fail?:(r:any)=>void}):void{
  try {
    if(showLoadding){};
    //@ts-ignore
    app.conf.requestHeader.timestamp=mistiming+Date.parse(new Date())/1000;
    const miniAppId=`ymzy.mini`,miniAppSecret=`ymzy.mini`,source=5,token=app.conf.requestHeader.token;
    let Authorization=Md5.hashStr(`${miniAppId}@${miniAppSecret}@${source}@${token}@${app.conf.requestHeader.timestamp}`);
    app.conf.requestHeader.Authorization=`${Authorization}`.toUpperCase();
    wx.request({
      method:method,
      header:app.conf.requestHeader,
      url:`${app.conf.requestHost}${url}`,
      data:data,
      success:(r:wx.DataResponse)=>{
        let res=r.data as Iresponse;
        //@ts-ignore
        mistiming=res.time-Date.parse(new Date())/1000;
        const newToken=(r.header as any).token||(r.header as any).Token;
        if(newToken){
          app.conf.requestHeader.token=newToken;
          // @ts-ignore
          wx.setStorage({
            key: "token",
            data: newToken,
          });
        }
        
        if(res.code==0){
          // 数据操作成功
          success&&success(res.body);
        }else if(res.code==101){
          console.info("VIP转化！");
          let vipInfo=res.body.data;
          wx.showModal({
            title:vipInfo.title,
            content:vipInfo.btn_text,
            success:(r:any)=>{
              if(r.confirm){
                wx.navigateTo({url:"/pages/vip/pay/pay"})
              }else{
                wx.navigateBack();
              }
            }
          })
        }else if(res.code==1||res.code==6){
          // 提示信息
          toast(res.msg);
        }else if(res.code==100){
          // 用户需要登录
          app.globalData.user_info=null;
          wx.redirectTo({url:"/pages/login/login/login"});
        }else if(res.code==113){
          console.info("模块功能关闭！");
        }else if(res.code==403){
          //重新请求
          // getData(url,{showLoadding,method,data,success,fail});
        }else if(res.code===404){
          console.error("API挂了");
        }else if(res.code==114){
          // 支付失败
          fail&&fail(res.msg);
        }
      },
    })
  } catch (e) {
    console.log(e)
    // Do something when catch error
  }
}
// 微信登录
export
function wechatLogin():void{
  wx.login({
    success(r){
      console.info("这里是公共方法微信登录占位");
    }
  })
}
// 验证手机号
export 
function isMobile(mobile:string):boolean {
  return mobile?/^\d{11}$/.test(mobile):false;
}
// 消息提示
export 
function toast(message:string,duration:number=2000,icon:any="none"):void{
  wx.showToast({title:message,icon:icon,duration,})
}
//计算适配 rpx=>px
export
function transformPx(px:number):number{
  return px/(750/2)*wx.getSystemInfoSync().windowWidth;
}
//更新localstorage
export 
function refreshHistory(arr:any[],newOne:any,key:string="school_id"):any[]{
  for(let i=0;i<arr.length;i++){
    if(arr[i][key]==newOne[key]){
      arr.splice(i,1);
      break;
    }
  }
  arr.unshift(newOne)
  return arr.splice(0,10);
}

// 圆梦志愿文章专用，把文章内容转化成rich-text可用的class模式
export 
function translateArticleContent(content:string):string{
  return content.replace(/<img/g,`<img class="img"`).replace(/<p/g,`<p class="p"`).replace(/<table/g,`<table class="table"`).replace(/<h3/g,`<h3 class="h3"`);
}
//清除部分本地缓存
export
function clearSomeLocalstorage(){
  wx.clearStorageSync();
}
/**
 * 拓展Page页面
 * 带有 elToast / toast / set 方法
 */
export 
class BasePage implements wx.PageOptions{
  constructor(){

  }
  getElDataSet(e:any):any{
    return e.currentTarget.dataset;
  }
  createSelector(){
    //@ts-ignore
    return this.createSelectorQuery();
  }
  back(){
    wx.navigateBack();
  }
  elToast(e:any){
    let message=e.currentTarget.dataset.message||"消息提示占位符";
    let duration=e.currentTarget.dataset.duration||1500;
    wx.showToast({
      title:message,
      duration,
      icon:"none",
    })
  }
  toast(message:string,duration:number=1500){
    wx.showToast({
      title:message,
      duration,
      icon:"none",
    })
  }
  set(data:any){
    //@ts-ignore
    this.setData(data);
  }
  getComp(id:string){
    //@ts-ignore
    return this.selectComponent(id);
  }
  onInit(options?: object){}
  onLoad(options: object):void{
    this.onInit(options);
    wx.getStorage({
      key:"token",
      success:(r:any)=>{
        if(timOpen){
          !tim&&initTim().then((r:any)=>{
            let promise = tim.getConversationList();
            promise.then((imResponse:any) =>{
              const conversationList = imResponse.data.conversationList; // 会话列表，用该列表覆盖原有的会话列表
              this.set({unreadCount:conversationList[0].unreadCount});
              app.timInfo.unreadCount=conversationList[0].unreadCount;
            }).catch(function(imError:any) {
              console.warn('getConversationList error:', imError); // 获取会话列表失败的相关信息
            });
          })
        }
        
      }
    })
  }
  onReady(){}
  onShow(){}
  onHide(){}
  onUnload(){}
  onPullDownRefresh(){}
  onReachBottom(){}
  onPageScroll(option: { scrollTop: number }){}
  onTabItemTap(item:any){}
  clearSomeStorage(){
    // 清除storange
    let unremoveStorange=["loginInfo","timMessages"];
    wx.getStorageInfo({
      success:(r:any)=>{
        console.log(r)
        r.keys.map((key:string)=>{
          if(!unremoveStorange.includes(key)){
            wx.removeStorage({key});
          }
        })
      }
    })
  }
}
/**
 * 更新score信息会收到通知的页面
 * onload 务必使用onInit方法代替
 */
export
class GlobalUserInfoPage extends BasePage {
  public data:any;
  constructor(){
    super();
    const app:any=getApp();
    this.data={
      unreadCount:app.timInfo.unreadCount||0,
      globalUserInfo:null,
    };
  }
  getGlobalUserInfo(callback?:Function){
    getData("/user_service/v1/auth/user/info",{
      success:(r:any)=>{
        app.globalData.user_info={...app.globalData.user_info||{},...r.data};
        this.set({globalUserInfo:app.globalData.user_info});
        callback&&callback();
      }
    }) ;
  }
  initUserInfo(){
    const app:any=getApp();
    if(app.globalData.user_info){
      this.set({globalUserInfo:app.globalData.user_info});
    }else{
      let userInfo=wx.getStorageSync("userInfo");
      if(userInfo){
        this.set({globalUserInfo:userInfo});
      }else{
        this.getGlobalUserInfo();
      }
    }
    event.on(this,["updateScore","updateUserState"],()=>{
      this.set({globalUserInfo:app.globalData.user_info})
    })
  }
  onLoad(options: object):void{
    this.initUserInfo();
    this.onInit(options);
    wx.getStorage({
      key:"token",
      success:(r:any)=>{
        if(timOpen){
          !tim&&initTim().then((r:any)=>{
            let promise = tim.getConversationList();
            promise.then((imResponse:any) =>{
              const conversationList = imResponse.data.conversationList; // 会话列表，用该列表覆盖原有的会话列表
              this.set({unreadCount:conversationList[0].unreadCount});
              app.timInfo.unreadCount=conversationList[0].unreadCount;
            }).catch(function(imError:any) {
              console.warn('getConversationList error:', imError); // 获取会话列表失败的相关信息
            });
          })
        }
      }
    })
    event.on(this,"messageReceived",(data:any)=>{
      var pages = getCurrentPages() //获取加载的页面
      var currentPage = pages[pages.length-1] //获取当前页面的对象
      var url = currentPage.route;
      //@ts-ignore
      if(this.route!="pages/user/messageCenter/messageCenter"&&this.route==url){
        // 拉取会话列表
        let promise = tim.getConversationList();
        promise.then((imResponse:any) =>{
          const conversationList = imResponse.data.conversationList; // 会话列表，用该列表覆盖原有的会话列表
          this.set({unreadCount:conversationList[0].unreadCount});
          app.timInfo.unreadCount=conversationList[0].unreadCount;
        }).catch(function(imError:any) {
          console.warn('getConversationList error:', imError); // 获取会话列表失败的相关信息
        });
        this.toast("您收到一条心消息，请到消息中心查看！");
      }
    })
  }
}

type PureInfoPageApi={
  url:string,
  method:"GET"|"PUT"|"OPTIONS"|"POST"|"DELETE",
  options:any
}
// 拓展GlobalUserInfoPage页面 会自动请求API
export 
class PureInfoPage extends GlobalUserInfoPage{
  constructor(private api:PureInfoPageApi){
    super();
    this.api=api;
    this.data={
      info:null,
    }
  }
  pageInit(){
    super.initUserInfo();
    getData(this.api.url,{
      method:this.api.method,
      success:(r:any)=>{
        //@ts-ignore
        this.setData({info:r.data});
      }
    })
  }
  onLoad(e:any){
    this.pageInit();
  }
}
/**
 * 消息分发
 */
interface notices {
  /** 监听名称 */
  name: string;
  /** 页面ID */
  pageId: string;
  /** 页面对象 */
  page: object;
  /** 回调函数 */
  callback: Function;
  /** 是否只触发一次 */
  once: boolean;
}
export class event {

  constructor() { }

   static notices: Array<notices> = [];

  /**
   * 发送通知
   * 
   * @param name 通知名称
   * @param info 通知内容
   */
  static push(eventName: string|string[], callbackData?: any) {
    let eventNames:string[]=typeof eventName=="string"?eventName.split(","):eventName;
    eventNames.map((name:string)=>{
      (this.notices).forEach((item: notices) => {
        if (item.name == name) {
          item.callback(callbackData);
          if (item.once) {
              this.remove(item.page, item.name);
          }
        }
      })
    });
  }

  /**
   * 删除通知对象
   * 
   * @param name 名称
   * @param page 页面对象
   */
  static remove(page: any, eventName: string) {
      const pageId = page.__wxExparserNodeId__;
      this.deleteEvent(pageId, eventName);
  }

  /**
   * 删除监听对象
   * @param pageID 页面ID
   */
  private static deleteEvent(pageId: string, eventName?: string) {
      (this.notices).forEach((item: notices, key) => {
          if (pageId == item.pageId || eventName == item.name) {
              this.notices.splice(key, 1);
          }
      });
  }

  /**
   * 注册通知对象方法，可以多个注册
   * 
   * @param page Page页面对象
   * @param name 对象名称，多个用逗号分隔
   * @param callback 回调方法
   */
  static on(page: any, eventNames: string | Array<string>, callback: Function, once: boolean = false) {
      let array: Array<string> = [];
      if (typeof eventNames == 'string') {
          array=eventNames.split(",");
      }
      if (typeof eventNames == 'object') {
          array = eventNames
      }
      const pageId = page.__wxExparserNodeId__;
      array.forEach(mName => {
          const pageObj = {
              name: mName,
              callback: callback,
              page: page,
              pageId: pageId,
              once: once
          };
          this.notices.push(pageObj);
      });
      // 如果页面关闭
      // page.onUnload = () => {
      //     this.deleteEvent(pageId);
      // }
  }
}
/**
 * tim聊天组件
 */ 
export interface TimOptions{
  message_received?:(ecent:any)=>any
}
export let tim:any;
export function initTim(){
  let app:any=getApp();
  return new Promise((resolve:any)=>{
    getData(`/data_service/v1/auth/tim/sig`,{
      success:(r:any)=>{
        app.timInfo={...app.timInfo,...r.data};
        console.log(app.timInfo)
        let options = {
          SDKAppID: app.timInfo.SDKAppID,
        };
        tim = TIM.create(options);
        tim.setLogLevel(0); 
        let loginPromise = tim.login({userID: r.data.tid,userSig:r.data.sig,});
        tim.registerPlugin({'tim-upload-plugin': TIMUploadPlugin});
        // mutipleAccount(同一设备，同一帐号，多页面登录被踢)
        tim.on(TIM.EVENT.KICKED_OUT, (event:any)=> {
          // 退出登录
          app.globalData.user_info.user_id=null;
          wx.navigateTo({url:"/pages/login/login/login"});
        });
        loginPromise.then((e:any)=>{
           resolve();
        })
        // tim.setMessageRead(options);
        // 接收到消息
        tim.on(TIM.EVENT.MESSAGE_RECEIVED, (e:any)=>{
          e.data.map((message:any)=>{
            if(message.type=="TIMCustomElem"&&message.payload.data){
              // 用户自定义消息
              try {
                message.payload.data=JSON.parse(message.payload.data);
                // 图文消息(可能带有表情)格式化城rich-text适用格式
                message.payload.data.msg_list.map((m:any)=>{
                  if(m.type=='txt'){
                    m.text=parseEmojiText(m.txt);
                  }
                })
              } catch (error) {
                console.error(error)
              }
            }else if(message.type=="TIMTextElem"){
              message.payload.node=parseEmojiText(message.payload.text);
            }
          })
          event.push("messageReceived",e.data);
        });
      }
    })
  })
}