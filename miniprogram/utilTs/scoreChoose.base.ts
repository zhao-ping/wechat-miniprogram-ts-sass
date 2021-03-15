// 搜学校搜专业基类
import { getData, event } from './util';
import { PopupInfoBase } from './popupInfo.base';

let basicListPage = { page: 0, page_count: 1 };
let rangeBtnInter: any;
const app: any = getApp();

/**
 * listApi 列表请求参数
 * type 类型 1 学校，2 专业
 */
export class ScoreChooseBase extends PopupInfoBase {
  constructor(protected listApi: string, public type: number) {
    super(listApi,type);
    this.data = {
      ...this.data,
      scrollTop: 0,
      showRange: true,
      selectScoreRange: {
        stepScoreWidth: 0,
        ballWidth: 0, //滑块宽度
        lineWidth: 0, //滑块范围宽度
        leftX: 0, //滑块范围左端
        rightX: 0, //滑块范围左端
        default_max_score: null, //批次范围最大
        default_min_score: null, //批次范围最小
        max_percent: null, //选中的最大百分比
        max_score: null, //选中的最大分数
        min_tag: null, //选中的最小标记
        max_tag: null, //选中的最大标记
        min_percent: null, //选中的最小百分比
        min_score: null, //选中的最小分数
        total_min_score: null, //筛选范围最大分数
        total_max_score: null, //筛选范围最小分数
      },
      rangeList: null, //筛选范围列表
      searchType: null,
      showFilter: true,
      filterList: null, //筛选数据列表
      filter: null, // 筛选结果
      searchStr: "", //检索关键字
      baseInfo: null, // 列表信息
      list: null, //列表列表
      listPage: {
        page: 0,
        page_count: 1,
      },
    };
  }
  /**
   * 添加或者取消备选专业
   * @param e
   */
  beixuan(e: any) {
    let dataset = this.getElDataSet(e);
    let {
      school_id,
      major_id,
      match_id,
      subject_group_id,
      is_alternative,
    } = dataset.item;
    let index = dataset.index;
    getData(`/data_service/v1/auth/alternative/major`, {
      method: is_alternative ? "DELETE" : "POST",
      data: {
        school_id,
        major_id,
        match_id,
        subject_group_id,
        admit_order_type: this.data.baseInfo.admit_order_type,
      },
      success: () => {
        this.data.list[index].is_alternative = !this.data.list[index]
          .is_alternative;
        this.set({ list: this.data.list });
        event.push("beixuanMajor")
      },
    });
  }
  /**
   * 设置检索关键词
   * @param e
   */
  setSearchStr(e: any) {
    let { str } = this.getElDataSet(e);
    this.set({ searchStr: str });
  }
  /**
   * 显示检索范围
   */
  toShowRange() {
    this.set({ showRange: true });
    let c: any = this.getComp("#range-filter");
    c.toShow();
  }
  /**
   * 显示筛选条件
   */
  toShowFilter() {
    let c: any = this.getComp("#school-filter");
    c.toShow();
  }
  /**
   * 设置检索范围并重新请求列表
   */
  setRange(e: any) {
    let { source } = this.getElDataSet(e);
    if (source == "button") {
      let c: any = this.getComp("#range-filter");
      c.toHide(false);
    }
    this.set({ showRange: false });
    this.set({ listPage: basicListPage });
    this.getList();
  }
  /**
   * 隐藏检索范围弹窗
   */
  // hideRange() {
  //   this.set({ showRange: false });
  // }
  /**
   * 切换搜索依据
   */
  changeSearchType(e: any) {
    let { item, index } = this.getElDataSet(e);
    this.data.rangeList[index].default_value = item;
    this.set({ rangeList: this.data.rangeList });
    this.computeRangeByScore();
  }
  /**
   * 切换批次
   */
  changeAdmit(e: any) {
    let { item, index } = this.getElDataSet(e);
    this.data.rangeList[index].default_value = item;
    this.resetSearchType();
    let c = this.getComp("#school-filter");
    c.setFilter("admit_order_type", item);
    this.initRange();
  }
  /**
   * 切换批次后，重置搜索依据
   */
  resetSearchType() {
    let child = this.data.rangeList.find((s: any) => s.key == "search_type");
    let admit = this.data.rangeList.find(
      (s: any) => s.key == "admit_order_type"
    ).default_value.v;
    child.values = this.data.searchType.values.filter(
      (v: any) => v.pv == admit
    );
    child.default_value = child.values[0];
    this.set({ rangeList: this.data.rangeList });
  }
  /**
   * 请求筛选范围数据
   */
  getFilter() {
    getData(`/data_service/v1/auth/requirement/search_data`, {
      data: {
        type: this.type,
        admit_order_type: this.data.rangeList.find(
          (item: any) => item.key == "admit_order_type"
        ).default_value.v,
      },
      success: (r: any) => {
        let i = r.data.search_list.findIndex(
          (item: any) => (item.key = "admit_order_type")
        );
        if (i != -1) {
          r.data.search_list[i].hide = true;
        }
        this.set({ filterList: r.data.search_list });
      },
    });
  }
  /**
   * 左侧滑块滑动
   * @param e Event
   */
  leftMove(e: any) {
    let {
      leftX,
      lineWidth,
      max_percent,
      total_min_score,
      total_max_score,
    } = this.data.selectScoreRange;
    let x = e.changedTouches[0].clientX;
    if (x >= leftX && x <= lineWidth * max_percent + leftX) {
      let percent = (x - leftX) / lineWidth;
      let score =
        Math.floor(percent * (total_max_score - total_min_score)) +
        total_min_score;
      if (score != this.data.selectScoreRange.min_score) {
        this.data.selectScoreRange.min_score = score;
        this.set({ selectScoreRange: this.data.selectScoreRange });
        this.computeRangeByScore();
      }
    }
  }
  /**
   * 右侧滑块滑动
   * @param e
   */
  rightMove(e: any) {
    let {
      leftX,
      rightX,
      lineWidth,
      min_percent,
      total_min_score,
      total_max_score,
    } = this.data.selectScoreRange;
    let x = e.changedTouches[0].clientX;
    if (x <= rightX && x >= lineWidth * min_percent + leftX) {
      let percent = (x - leftX) / lineWidth;
      let score =
        Math.floor(percent * (total_max_score - total_min_score)) +
        total_min_score;
      if (score != this.data.selectScoreRange.max_score) {
        this.data.selectScoreRange.max_score = score;
        this.set({ selectScoreRange: this.data.selectScoreRange });
        this.computeRangeByScore();
      }
    }
  }
  startRangeBtn(e: any) {
    rangeBtnInter = setInterval(() => {
      this.rangeBtn(e);
    }, 100);
  }
  endRangeBtn(e: any) {
    clearInterval(rangeBtnInter);
  }
  /**
   * 设置滑块范围
   */
  rangeBtn(e: any) {
    let { type } = this.getElDataSet(e);
    let admit: any = this.data.rangeList.find(
      (range: any) => range.key == "admit_order_type"
    );
    let scores = admit.default_value.data.score_list.map(
      (score: any) => score.min_score
    );
    let [min, max] = [Math.min(...scores), Math.max(...scores)];
    if (type == "add") {
      // 右侧按钮
      if (this.data.selectScoreRange.max_score >= max) {
        this.toast("已经是最大值了");
        return;
      } else {
        this.data.selectScoreRange.max_score++;
      }
    } else {
      // 左侧按钮
      if (this.data.selectScoreRange.min_score <= min) {
        this.toast("已经是最小值了");
        return;
      } else {
        this.data.selectScoreRange.min_score--;
      }
    }
    this.computeRangeByScore();
  }
  computeRangeByScore() {
    let admit: any = this.data.rangeList.find(
      (range: any) => range.key == "admit_order_type"
    );
    let [min, max] = [
      this.data.selectScoreRange.total_min_score,
      this.data.selectScoreRange.total_max_score,
    ];
    let scoreRange = max - min;
    let search_type = this.data.rangeList.find(
      (item: any) => item.key == "search_type"
    ).default_value.v;
    //1位次 2线差 3分数
    let min_tag = "",
      max_tag = "";
    let { min_score, max_score } = this.data.selectScoreRange;
    switch (search_type) {
      case 1:
        min_tag = `${
          admit.default_value.data.score_list.find(
            (item: any) => item.min_score == min_score
          ).rank
        }位`;
        max_tag = `${
          admit.default_value.data.score_list.find(
            (item: any) => item.min_score == max_score
          ).rank
        }位`;
        break;
      case 2:
        min_tag = `线差${
          admit.default_value.data.score_list.find(
            (item: any) => item.min_score == min_score
          ).score_def
        }分`;
        max_tag = `线差${
          admit.default_value.data.score_list.find(
            (item: any) => item.min_score == max_score
          ).score_def
        }分`;
        break;
      case 3:
        min_tag = `${min_score}分`;
        max_tag = `${max_score}分`;
        break;
    }
    this.data.selectScoreRange = {
      ...this.data.selectScoreRange,
      min_percent: (min_score - min) / scoreRange,
      min_tag,
      max_percent: (max_score - min) / scoreRange,
      max_tag,
    };
    this.set({ selectScoreRange: this.data.selectScoreRange });
  }
  /**
   * 初始化或者切换批次重新渲染range
   */
  initRange() {
    let admit: any = this.data.rangeList.find(
      (range: any) => range.key == "admit_order_type"
    );
    let scores = admit.default_value.data.score_list.map(
      (score: any) => score.min_score
    );
    let [min, max] = [Math.min(...scores), Math.max(...scores)];
    this.data.selectScoreRange = {
      ...this.data.selectScoreRange,
      stepScoreWidth: this.data.selectScoreRange.lineWidth / (max - min),
      default_min_score: admit.default_value.data.default_min_score,
      default_max_score: admit.default_value.data.default_max_score,
      total_min_score: min,
      total_max_score: max,
      min_score: admit.default_value.data.default_min_score,
      max_score: admit.default_value.data.default_max_score,
    };
    this.computeRangeByScore();
  }
  /**
   * 请求筛选条件列表
   */
  getSearch() {
    getData(`/data_service/v1/auth/requirement/search?type=${this.type}`, {
      success: (r: any) => {
        this.set({ rangeList: r.data.search_list });
        this.set({
          searchType: JSON.parse(
            JSON.stringify(
              r.data.search_list.find((item: any) => item.key == "search_type")
            )
          ),
        });
        let queryBall = wx.createSelectorQuery();
        setTimeout(() => {
          queryBall
            .select("#rangeBall")
            .boundingClientRect((b: any) => {
              this.data.selectScoreRange.ballWidth = b.width;
              let queryRangeLine = wx.createSelectorQuery();
              queryRangeLine
                .select("#rangeLine")
                .boundingClientRect((l: any) => {
                  this.data.selectScoreRange.lineWidth = l.width;
                  this.data.selectScoreRange.leftX =
                    (app.systemInfo.windowWidth - l.width) / 2;
                  this.data.selectScoreRange.rightX =
                    this.data.selectScoreRange.leftX + l.width;
                  this.initRange();
                })
                .exec();
            })
            .exec();
        }, 0);
        this.resetSearchType();
        this.set({ userInfo: r.data.user_info });
        this.getFilter();
      },
    });
  }
  /**
   * 筛选条件改变，重新获取数据
   * @param filter school-filter组件返回的筛选条件
   */
  setFilter(filter: any) {
    this.set({ filter: filter.detail });
    this.set({ listPage: basicListPage });
    this.getList();
  }
  /**
   * 请求列表数据
   */
  getList() {
    if (this.data.listPage.page >= this.data.listPage.page_count) return;
    if (this.data.listPage.page == 0) {
      this.data.list = [];
    }
    let data: object = {
      page: this.data.listPage.page + 1,
      limit: 20,
      search_tag:this.type,
    };
    //按分数选学校&按分数选专业有检索范围
    if (this.data.rangeList) {
       let range:any = {
        search_type: this.data.rangeList.find(
          (item: any) => item.key == "search_type"
        ).default_value.v,
        admit_order_type: this.data.rangeList.find(
          (item: any) => item.key == "admit_order_type"
        ).default_value.v,
        min_range_value: this.data.selectScoreRange.min_tag.match(/\d+/)[0],
        min_score: this.data.selectScoreRange.min_score,
        max_range_value: this.data.selectScoreRange.max_tag.match(/\d+/)[0],
        max_score: this.data.selectScoreRange.max_score,
        school_name: this.data.searchStr,
        major_name: this.data.searchStr,
      };
      data={...data,...range}
    }
    //有filter组件筛选条件的
    if (this.data.filter) {
      data = { ...data, ...this.data.filter.filters };
    }
    //填志愿 添加学校或专业需要穿参uca_id与sort_type
    if(this.data.uca_id){
      data={...data,uca_id:this.data.uca_id};
      // 有排序条件的
      if(this.data.sorts){
        data={...data,sort_type:this.data.sorts[this.data.tabIndex]?this.data.sorts[this.data.tabIndex].default_value.v:null};
      }
      //有学校名称的
      if(this.data.school_name!=undefined){
        if(!this.data.school_name){
          this.toast("请填写搜索关键字！")
          return;
        }
        data={...data,school_name:this.data.school_name,}
      }
    }
    getData(this.listApi, {
      data,
      success: (r: any) => {
        this.set({
          list: [
            ...(r.pager.page == 1 ? [] : this.data.list),
            ...(r.data.major_list ? r.data.major_list : r.data.school_list),
          ],
        });
        this.set({ baseInfo: r.data.base_info });
        //从我的备选中添加学校 备选没有数据跳转到VIP精选
        if(this.data.beixuanFirst&&this.data.list.length==0){
          let c:any=this.getComp("#tabs");
          c.setIndex(1);
          this.set({tabIndex:1});
          this.data.beixuanFirst=false;
          //@ts-ignore
          this.changeTab();
          return;
        }
        this.set({ listPage: r.pager });
        if (r.pager.page == 1) {
          this.set({ scrollTop: 0 });
        }
      },
    });
  }
  httpBeixuanSchool(e:any){
    let {
      school_id,
      subject_group_id,
      is_alternative,
    } = this.getElDataSet(e).item;
    let index = this.getElDataSet(e).index;
    getData(`/data_service/v1/auth/alternative/school`, {
      method: is_alternative ? "DELETE" : "POST",
      data: {
        school_id,
        subject_group_id,
        admit_order_type: this.data.baseInfo.admit_order_type,
      },
      success: (r: any) => {
        this.data.list[index].is_alternative = !is_alternative;
        if (is_alternative) {
          //常规省 学上海 取消备选学校或者专业组时 同时取消被选学校下的专业
          this.data.list[index].alternative_major_count=0;
        }
        this.set({ list: this.data.list });
        event.push("beixuanSchool");
      },
    });
  }
  /**
   * 常规省/上海 备选或取消备选 学校/专业组
   * @param e 常规省
   */
  beixuanSchool(e: any) {
    let {
      alternative_major_count,
      is_alternative,
    } = this.getElDataSet(e).item;
    // 上海备选专业组 常规省备选学校
    if(is_alternative&&alternative_major_count>0){
      let bxStr = this.data.baseInfo.page_model == 1 ? "学校" : "专业组";
      wx.showModal({
        title: "提示",
        content: `取消备选${bxStr}的同时也将取消${bxStr}下的备选专业，是否取消备选？`,
        success: (res) => {
          if (res.confirm) {
            this.httpBeixuanSchool(e);
          }
        },
      });
    }else{
      this.httpBeixuanSchool(e);
    }
  }
  /**
   * 订阅批量备选专业 默认是学校相关批量备选专业的订阅
   */
  batchMajor() {
    // 订阅批量备选专业
    event.on(this, "batchMajor", (options: any) => {
      options.data.map((item: any) => {
        if (item.add_or_del == 1) {
          this.data.list[options.index].alternative_major_count += 1;
        } else {
          this.data.list[options.index].alternative_major_count -= 1;
        }
      });
      if (this.data.list[options.index].alternative_major_count > 0) {
        this.data.list[options.index].is_alternative = true;
      }
      this.set({ list: this.data.list });
    });
  }
  onInit(e?:any) {
    this.batchMajor();
    this.getSearch();
  }
}
