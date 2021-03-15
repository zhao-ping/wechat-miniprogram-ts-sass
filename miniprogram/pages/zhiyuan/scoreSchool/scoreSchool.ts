import { ScoreChooseBase } from "../../../utilTs/scoreChoose.base";
class _scoreSchool extends ScoreChooseBase {
  constructor(protected listApi: string, public type: number) {
    super(listApi, type);
    this.data = {
      ...this.data,
      schoolIndex:null,
      popupSchool:null,
    };
  }
}
Page(new _scoreSchool(`/data_service/v1/auth/requirement/school/list`, 1));
