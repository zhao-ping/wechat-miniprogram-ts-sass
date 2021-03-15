// miniprogram/pages/school/pdf/pdf.js
Page({
  data: {
    pdf:""
  },
  onLoad: function (options:any) {
    this.setData({pdf:options.pdf});
  },
})