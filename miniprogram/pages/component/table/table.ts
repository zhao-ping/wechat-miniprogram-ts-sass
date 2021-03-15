// pages/component/table/table.js
Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    table:null,
  },
  lifetimes:{
    ready(){
      // console.log(this.data.table)
    }
  },
  data: {},
  methods: {
    isBold(){
      return "000";
    }
  }
})
