App({
  conf: {
    // requestHost: "https://s2.api.ymzy.cn",
    requestHost: "https://test.api.ymzy.cn",
    requestHeader: {
      token: "",
      source:5,
      imestamp:"",
      Authorization:"",
    },
  },
  vipTransform:{},
  timInfo:{
    SDKAppID:1400476465,
    SECRETKEY:'ea4fee39e49738263c7a9c0a9cdeed9f3079c3a2fadc6b2a8db83b49dd325dfd',
  },
  wechatLoginInfo:null,
  systemInfo:{},
  globalData: {
    user_info: null,
  },
  onLaunch(options) {
    this.conf.requestHeader.token=wx.getStorageSync('token')||"";
  },
  onShow(options) {
    const res:wx.SystemInfo= wx.getSystemInfoSync();
    this.systemInfo=res;
    // Do something when show.
  },
  onHide() {
    // Do something when hide.
  },
  onError(msg) {
  },
});
