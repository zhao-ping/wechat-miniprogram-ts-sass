import { getData, toast, event, GlobalUserInfoPage } from '../../../utilTs/util';
const app: any = getApp();
class _setScore extends GlobalUserInfoPage{
  constructor(){
    super();
    this.data={
      ...this.data,
      userInfo: null,
      score: null,
      rank: null,
      info: null,
      subjects: null,
      subject_id_list:null,
      tips:[],
      showComfirm:false,
      confirmNode:"",
    }
  }
  getUserInfo(){
    getData("/user_service/v1/auth/user/info",{
      success:(r:any)=>{
        app.globalData.user_info={...app.globalData.user_info||{},...r.data};
      }
    }) ;
  }
  tapDialogButton(e:any){
    if(e.detail.index==0){
      // 取消
      this.set({showComfirm:false});
    }else{
      // 修改
      this.putSetUserInfo(this.data.subject_id_list)
    }
  }
  showRank() {
    wx.showModal({
      title: "温馨提示",
      content: this.data.info.show_info.show_what_string,
    });
  }
  checkSub(e: any) {
    let [index, i] = e.currentTarget.dataset.index;
    //切换选科
    if (this.data.subjects[index].choose_number == 1) {
      // 单选
      for (let j = 0; j < this.data.subjects[index].values.length; j++) {
        this.data.subjects[index].values[j].checked = j == i ? true : false;
      }
    } else {
      // 多选
      let needcheckedNum = this.data.subjects[index].choose_number,
        checkedNum = 0;
      this.data.subjects[index].values.map((item:any) => {
        if (item.checked) {
          checkedNum++;
        }
      });
      if (this.data.subjects[index].values[i].checked) {
        //取消选中
        this.data.subjects[index].values[i].checked = false;
      } else {
        // 想要选中
        if (needcheckedNum > checkedNum) {
          this.data.subjects[index].values[i].checked = true;
        } else {
          toast(`最多只能选择${needcheckedNum}项，请取消其他科目再选择`);
        }
      }
    }
    this.set({ subjects: this.data.subjects });
  }
  getRank() {
    if (this.data.score < 100) {
      return;
    }
    if (this.data.isrank == 0) {
      // 模拟考
      this.set({rank:null})
    } else {
      // 出排位后
      let data: any = { score: this.data.score };
      if (this.data.info.user_info.prov_model == 1) {
        // 常规省
        var sub = this.data.subjects[0].values.find((item:any) => item.checked);
        data.sub_id = sub.v;
      }
      getData(`/user_service/v1/auth/user/score_rank`, {
        data,
        success: (r: any) => {
          this.set({ rank: r.data });
        },
      });
    }
  }
  setUserInfo() {
    if (!this.data.score) {
      toast("您没有输入成绩");
      return;
    }
    // 计算选中的科目id
    let subject_id_list:any[] = [];
    this.data.subjects.map((subs:any) => {
      subs.values.map((item:any) => {
        if (item.checked) {
          subject_id_list.push(item.v);
        }
      });
    });
    
    for (let i = 0; i < this.data.subjects.length; i++) {
      let checkedSubs = this.data.subjects[i].values.filter(
        (item:any) => item.checked
      );
      if (checkedSubs.length < this.data.subjects[i].choose_number) {
        toast("您的选科不全！");
        return;
      }
    }
    if (
      subject_id_list.sort().join("") == this.data.info.user_info.subject_id &&
      this.data.info.user_info.score == this.data.score &&
      this.data.info.user_info.rank == this.data.rank
    ) {
      toast("您没有做任何修改！");
      return;
    }
    if (this.data.info.is_modify.state == 0) {
      toast(this.data.info.warm_reminder);
      return;
    }
    
    let msg = "";
    if (
      this.data.subjects
        .filter((item:any) => item.checked)
        .map((item:any) => item.v)
        .join("") == this.data.info.user_info.subject_id
    ) {
      // 没有修改选科
      msg = this.data.tips[1];
    } else {
      // 修改了选科
      msg = this.data.tips[0];
    }
    if (msg != "") {
      if (this.data.info.show_info.show_state == 201) {
        if (this.data.info.user_info.rank) {
          msg = `<p class="color-2f text-left">你的分数：<b>${this.data.score} 分</b><br/>你的位次：<b>${this.data.rank} 位</b><br/>${msg}</p>`;
        } else {
          msg = `<p class="color-2f text-left">你的分数：<b>${this.data.score} 分</b><br/>${msg}</p>`;
        }
      }
      this.set({confirmNode:msg});
      if (subject_id_list.join("") == this.data.info.user_info.subject_id) {
        // 没有修改选科
        this.putSetUserInfo(subject_id_list);
        return;
      }
      this.data.subject_id_list=subject_id_list;
      this.set({showComfirm:true});
    } else {
      // 出分前没有修改选科，直接调用接口修改
      this.putSetUserInfo(subject_id_list);
    }
  }
  putSetUserInfo(subject_id_list:any) {
    let formData = {
      // prov_id: this.data.info.user_info.prov_id,
      subject_id_list,
      score: Number(this.data.score),
      rank: Number(this.data.rank) || null,
    };
    getData(`/user_service/v1/auth/user/update_score_info`, {
      method: "PUT",
      data:formData,
      success:(r:any)=>{
        toast("修改成功");
        this.getGlobalUserInfo(()=>{
          event.push("updateScore,updateUserInfo");
        })
        // clearSomeLocalstorage();
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      }
    })
  }
  getInfo() {
    getData(`/user_service/v1/auth/user/update_score_info`, {
      success: (r: any) => {
        this.set({ score: r.data.user_info.score });
        this.set({ rank: r.data.user_info.rank });
        let userSub = r.data.user_info.subject_id
          .toString()
          .split("")
          .map((item:any) => Number(item));
        let subjects = r.data.sub_list.map((subs:any) => {
          let values = subs.values.map((item:any) => {
            let sub = { ...item, checked: false };
            if (userSub.includes(item.v)) {
              sub.checked = true;
            }
            return sub;
          });
          return { ...subs, values };
        });
        this.set({ subjects: subjects });
        this.set({ info: r.data });
        this.data.tips.push(r.data.tip_sub);//修改了科目类型的
        this.data.tips.push(r.data.tip_modify);//没有修改科目类型的
      },
    });
  }
  onLoad() {
    this.set({ userInfo: app.globalData.user_info });
    this.getInfo();
  }
}
Page(new _setScore())