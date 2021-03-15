import { BasePage, getData, event } from '../../../utilTs/util';
class _zhiyuanTest extends BasePage {
  data = {
    info: null,
  };
  downLoad() {
    wx.showLoading({ title: `加载中，请稍后···` });
    //@ts-ignore
    getData(`/data_service/v1/auth/application/${this.data.info.application.uca_id}/risk_assessment/report`,
      {
        success: (r: any) => {
          //@ts-ignore
          wx.downloadFile({
            // 示例 url，并非真实存在
            url: r.data.report_url,
            success: function (res) {
              const filePath = res.tempFilePath;
              wx.openDocument({
                filePath: filePath,
                success: function (res) {
                  wx.hideLoading();
                },
              });
            },
          });
        },
      }
    );
  }
  getInfo(id: number) {
    getData(`/data_service/v1/auth/application/${id}/risk_assessment`, {
      success: (r: any) => {
        event.push("zhiyuanTest")
        r.data.application.optimal_desc = r.data.application.optimal_desc.replace(
          /\d+/g,
          `<span class="bg-white display-ib p-lr-8 m-lr-8 br-16 color-orange line-h-28">${r.data.application.optimal_number}</span>`
        );
        this.set({ info: r.data });
        wx.setNavigationBarTitle({
          title: r.data.application.application_name,
        });
      },
    });
  }
  onInit(e: any) {
    this.getInfo(e.uca_id);
  }
}
Page(new _zhiyuanTest());
