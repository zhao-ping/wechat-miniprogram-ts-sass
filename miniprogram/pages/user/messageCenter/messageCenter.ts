import { GlobalUserInfoPage, event, getData, tim, translateUrl } from '../../../utilTs/util';
import * as TIM from "tim-wx-sdk";
import { parseEmojiText, emojiMap, emojiUrl, emojiName } from '../../../utilTs/emojiMap';
const app: any = getApp();
let storageTimMessages:any[];
class _messageCenter extends GlobalUserInfoPage {
  constructor() {
    super();
    this.data = {
      ...this.data,
      scrollBoxHeight: null,
      tabIndex: 0,
      cursor:0,//输入框光标位置
      emojiUrl,
      emojiMap,
      emojiName,
      isShowEmoji:false,
      kefu: null,
      editState:false,
      checkAll:false,
      list: null,//通知消息列表
      listPage: { page: 0, page_count: 1 },
      sixin: null,
      refreshering:false,
      sixinPage: { page: 0, page_count: 1 },
      message: "",
      hasStorangeTimMessage:false,
      messageList: [],
      nextReqMessageID: null,
      isCompleted: null,
      sixinScrollPosition:"bottom",
      sixinScrollPositionId:null,
      copyId:null,
    };
  }
  /**
   * 自动回复消息
   */
  getAutoMessage(){
    getData(`/static_service/v1/auth/tim/event`,{})
  }
  //监听客服消息滚动
  messageScroll(){
    if(this.data.copyId){
      let c:any=this.getComp(`#${this.data.copyId}`);
      c.hide();
    }
  }
  /**
   * 隐藏其他复制项
   */
  hideOther(e?:any){
    if(this.data.copyId){
      let c:any=this.getComp(`#${this.data.copyId}`);
      c.hide();
    }
    this.data.copyId=e.currentTarget.id;
  }
  /**
   * 删除消息
   */
  delete(){
    let data:any={};
    let checkedIndexs:number[]=[];
    if(this.data.checkAll){
      // 全部标为已读
      data.notification_id=-1;
    }else{
      // 将选中消息标为已读
      let notification_ids:number[]=[];
      this.data.list.filter((item:any,i:number)=>{
        if(item.checked){
          checkedIndexs.push(i);
          notification_ids.push(item.notification_id)
        }
      });
      data.notification_id=notification_ids.join(",");
    }
    getData(`/static_service/v1/auth/tim/sysinforms/del`,{
      data,
      success:(r:any)=>{
        this.set({list:null})
        this.set({listPage:{page:0,page_count:1}});
        this.getList();
      }
    })
  }
  /**
   * 标为已读消息
   */
  read(){
    let data:any={};
    let checkedIndexs:number[]=[];
    if(this.data.checkAll){
      // 全部标为已读
      data.notification_id=-1;
    }else{
      // 将选中消息标为已读
      let notification_ids:number[]=[];
      this.data.list.filter((item:any,i:number)=>{
        if(item.checked){
          checkedIndexs.push(i);
          notification_ids.push(item.notification_id)
        }
      });
      data.notification_id=notification_ids.join(",");
    }
    getData(`/static_service/v1/auth/tim/sysinforms/redpoint`,{
      data,
      success:(r:any)=>{
        if(this.data.checkAll){
          // 全部标为已读
          this.data.list.map((item:any)=>{
            item.red_point=false;
          })
        }else{
          // 将选中消息标为已读
          checkedIndexs.map((index:number)=>{
            this.data.list[index].red_point=false;
          })
        }
        this.set({list:this.data.list});
        this.set({editState:false});
        this.data.checkAll=true;
        this.toCheckAll();
      }
    })
  }
  // 全选或者取消
  toCheckAll(){
    this.set({checkAll:!this.data.checkAll});
    this.data.list.map((item:any)=>{
      item.checked=this.data.checkAll;
    })
    this.set({list:this.data.list});
  }
  /**
   * 编辑或取消编辑消息
   */
  setEditState(){
    this.set({editState:!this.data.editState});
  }
  /**
   * 选择通知
   * @param e 
   */
  checkTongzhi(e:any){
    let {item,index}=this.getElDataSet(e);
    console.log(item,index)
    if(this.data.editState){
      // 编辑状态中
      this.data.list[index].checked=!this.data.list[index].checked;
      this.set({list:this.data.list});
    }else{
      // 读取消息详情
      getData(`/static_service/v1/auth/tim/sysinforms/redpoint?notification_id=1`,{
        data:{notification_id:item.notification_id},
        success:(r:any)=>{
          this.data.list[index].red_point=false;
          this.set({list:this.data.list});
        }
      })
      if(item.is_link){
        wx.navigateTo({url:translateUrl[item.link]+'?notification_id='+item.notification_id});
      }
    }
  }
  /**
   * 切换选项卡
   */
  cahngeTab(e: any) {
    if (typeof e == "number") {
      this.set({ tabIndex: e });
    } else {
      this.set({ tabIndex: e.detail });
    }
    if (this.data.tabIndex == 0&&!this.data.nextReqMessageID) {
      // this.getSixin();
    } else if (this.data.tabIndex == 1) {
      this.getList();
    } else if (this.data.tabIndex == 2) {
      this.getKefu();
    }
  }
  /*
   *联系我们
   */
  contact(e: any) {
    let { type, value } = e.currentTarget.dataset;
    switch (type) {
      case 1:
        //复制微信
        wx.setClipboardData({
          data: value,
          success: (res) => {
            this.toast("您已成功复制微信号");
          },
        });
        break;
      case 2:
        // 拨打电话
        wx.makePhoneCall({
          phoneNumber: value,
        });
        break;
      default:
        this.contactMe();
    }
  }
  /**
   * 请客服联系我
   */
  contactMe() {
    if (this.data.globalUserInfo.user_state == 1) {
      // 还没绑定手机号
      wx.showModal({
        title: "",
        content: `请先绑定手机号`,
        success: (e: any) => {
          if (e.confirm) {
            wx.navigateTo({ url: "/pages/user/bindMobile/bindMobile" });
          }
        },
      });
    } else {
      // 请客服联系我"申请成功后，客服会尽快联系您，请耐心等待！
      wx.showModal({
        title: "",
        content: `请客服联系我"申请成功后，客服会尽快联系您，请耐心等待！`,
        success: () => {
          getData(`/static_service/v1/auth/service/connect_me`, {
            success: (r) => {
              this.toast("申请成功，客服会尽快联系您，请耐心等待！");
            },
          });
        },
      });
    }
  }
  /**
   * 获取客服联系方式
   */
  getKefu() {
    if (this.data.kefu) return;
    getData(`/static_service/v1/allow/service/customer_service`, {
      success: (r: any) => {
        this.set({ kefu: r.data });
      },
    });
  }
  /**
   * 获取通知消息列表
   */
  getList(){
    if(this.data.listPage.page>=this.data.listPage.page_count)return;
    getData(`/static_service/v1/auth/tim/sysinforms`,{
      data:{
        limit:20,
        page:this.data.listPage.page+1,
      },
      success:(r:any)=>{
        if(r.pager.page==1){
          this.set({list:r.data});
        }else{
          this.set({list:[...this.data.list||[],...r.data]});
        }
        this.set({listPage:r.pager});
        if(r.pager.page==1){
          this.set({scrollTop:0});
        }
      }
    })
  }
  /**
   * 显示隐藏emoji
   */
  showEmoji(e:any){
    if(e&&this.getElDataSet(e).type=="hide"){
      this.set({isShowEmoji:false});
    }else{
      this.set({isShowEmoji:!this.data.isShowEmoji});
    }
  }
  previewImg(event:any){
    let {img}=this.getElDataSet(event);
    console.log(img)
    wx.previewImage({
      current: img.split("?")[0],
      urls: [img],
    })
  }
  /**
   * 监听input光标位置
   * @param e event事件
   */
  inputEvent(e:any){
    this.set({cursor:e.detail.cursor});
  }
  /**
   * 插入表情
   * @param e event事件
   */
  insertEmoji(e:any){
    let emoji=this.getElDataSet(e).emoji;
    this.set({message:this.data.message.substr(0,this.data.cursor)+emoji+this.data.message.substr(this.data.cursor)});
    this.set({cursor:this.data.message.length});
  }
  /**
   * 下拉获取更多私信
   */
  getSixin() {
    if(this.data.isCompleted||(!this.data.nextReqMessageID&&!this.data.messageList)) return;
    if(this.data.isCompleted||!tim) return;
    let listOptions:any={
      conversationID: `C2C${app.timInfo.admin_id}`,
      count: 15,
    }
    if(this.data.nextReqMessageID){
      listOptions.nextReqMessageID=this.data.nextReqMessageID;
    }
    let promise = tim.getMessageList(listOptions);
    promise.then((imResponse: any) => {
      imResponse.data.messageList.map((message:any)=>{
        if(message.type=="TIMCustomElem"&&message.payload.data){
          // 用户自定义消息
          try {
            message.payload.data=JSON.parse(message.payload.data);
            // 图文消息表情
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
      if(this.data.messageList){
        this.data.messageList=[...imResponse.data.messageList,...this.data.messageList];
      }else{
        this.data.messageList=imResponse.data.messageList
      }
      this.set({
        messageList:this.data.messageList,
      });
      if(!this.data.nextReqMessageID){
        this.set({sixinScrollPosition:"bottom"});
      }else{
        this.set({sixinScrollPosition:this.data.nextReqMessageID});
      }
      this.set({ nextReqMessageID: imResponse.data.nextReqMessageID });
      this.set({ isCompleted: imResponse.data.isCompleted });
      this.set({refreshering:false});
      if(imResponse.isCompleted){
        this.data.timMessageCount=this.data.messageList.length;
      }
    });
  }
  /**
   * 发送图片消息
   */
  sendImage(){
    // 1. 选择图片
    wx.chooseImage({
      sourceType: ['album','camera'], // 从相册选择
      count: 1, // 只选一张，目前 SDK 不支持一次发送多张图片
      success:  (res:any)=> {
        // 2. 创建消息实例，接口返回的实例可以上屏
        wx.showLoading({title:"正在发送,请稍后···"})
        let message = tim.createImageMessage({
          to: `${app.timInfo.admin_id||this.data.globalUserInfo.user_id}`,
          conversationType: TIM.TYPES.CONV_C2C,
          payload: { file: res },
          onProgress: (event:any)=> { console.log('file uploading:', event) }
        });
        // 3. 发送图片
        let promise = tim.sendMessage(message);
        promise.then((r:any)=> {
          // 发送成功
          this.set({ message: "" });
          this.data.messageList.push(r.data.message);
          this.set({messageList:this.data.messageList});
          this.set({sixinScrollPosition:"bottom"});
          wx.hideLoading();
        }).catch((imError:any)=> {
          // 发送失败
          wx.hideLoading();
          this.toast("发送失败，请重试！")
        });
      }
    })
  }
  /**
   * 发送文字消息
   */
  sendMessage() {
    // this.set({isShowEmoji:false});
    if (!this.data.message) return;
    let message = tim.createTextMessage({
      to: `${app.timInfo.admin_id||this.data.globalUserInfo.user_id}`,
      conversationType: TIM.TYPES.CONV_C2C,
      payload: {
        text: this.data.message,
      },
    });
    // 2. 发送消息
    let promise = tim.sendMessage(message);
    promise
      .then((r: any) => {
        // 发送成功
        this.set({ message: "" });
        r.data.message.payload.node=parseEmojiText(r.data.message.payload.text);
        this.data.messageList.push(r.data.message);
        this.set({messageList:this.data.messageList});
        this.set({sixinScrollPosition:"bottom"});
        this.getAutoMessage();
      })
      .catch((imError: any) => {
        // 发送失败
        console.log("sendMessage error:", imError);
        this.toast("消息发送失败，请重试！---");
      });
  }
  onInit() {
    this.cahngeTab(this.data.tabIndex);
    event.on(this, "updateUserState", () => {
      this.getKefu();
    });
    //测试用，正常会在用户登录后连接到会话,正常使用时直接调用获取会话列表
    // !tim&&initTim();
    this.getSixin();
    event.on(this,"messageReceived",(r:any)=>{
      this.data.messageList=[...this.data.messageList,...r]
      this.set({messageList:this.data.messageList});
      setTimeout(() => {
        this.set({sixinScrollPosition:"bottom"});
      }, 50);
    })
  }
  showStorageTim(){
    let id=this.data.messageList[0].ID;
    let index=0;
    for(let i=0;i<storageTimMessages.length;i++){
      if(storageTimMessages[i].ID==id){
        index=i-1;
        break;
      }
    }
    this.set({messageList:[...storageTimMessages.slice(0,index),...this.data.messageList]})
  }
  onUnload(){
    if(storageTimMessages&&storageTimMessages.length>0){
      let storageLastTime=storageTimMessages.slice(-1)[0].time;
      let index=0;
      for(let i=0;i<this.data.messageList.length;i++){
        let message=this.data.messageList[i];
        if(message.time>storageLastTime){
          index=i;
          break;
        }
      }
      let newStorangeMessage=[...storageTimMessages,...this.data.messageList.slice(index)];
      let newIndex=0;
      //@ts-ignore
      let timeStamp7DayBefore=Date.parse(new Date())/1000-7*24*60*60;
      for(let i=0;i<newStorangeMessage.length;i++){
        let message=newStorangeMessage[i];
        if(message.time>timeStamp7DayBefore){
          newIndex=i;
          break;
        }
      }
      wx.setStorage({
        key:"timMessages",
        data:newStorangeMessage.slice(newIndex),
      })
    }else{
      wx.setStorage({
        key:"timMessages",
        data:this.data.messageList
      })
    }
  }
  onShow() {
    let topContainer = wx.createSelectorQuery();
    topContainer
      .select("#topContainer")
      .boundingClientRect((r: any) => {
        this.set({
          scrollBoxHeight: app.systemInfo.windowHeight - r.height,
        });
      })
      .exec();
    // 将某会话下所有未读消息已读上报
    let promise = tim.setMessageRead({conversationID: `C2C${app.timInfo.admin_id}`});
    promise.then((imResponse:any)=> {
      // 已读上报成功，指定 ID 的会话的 unreadCount 属性值被置为0
      app.timInfo.unreadCount=0;
    }).catch(function(imError:any) {
      // 已读上报失败
      console.warn('setMessageRead error:', imError);
    });
    storageTimMessages=wx.getStorageSync("timMessages");
    //@ts-ignore
    if(storageTimMessages&&storageTimMessages[0].time<Date.parse(new Date())/1000-7*24*60*60){
      this.set({hasStorangeTimMessage:true})
    }
  }
}
Page(new _messageCenter());
