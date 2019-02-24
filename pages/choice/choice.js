// pages/choice/choice.js
const db = wx.cloud.database({
  env: 'tinypro-test-9fdcb8'
})
const t_choiceQuestions = db.collection('choiceQuestions')
const t_user = db.collection('user')
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    questions: [],
    currentQuestion: '',
    currentOptions: [],
    currentChoose: '',
    constOpts: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
    currentLevel: "",
    // -1表示未选择，1表示正确，0表示错误。
    currentStatus: -1
  },

  onNext:function(event){
    if(this.data.currentStatus==-1)
    {
      wx.showModal({
        title: '这道题还没做完~',
        content: "发挥你的聪明才智吧~",
        showCancel: false,
      })
      return
    }

  },

  onSubmitAnswer: function(event) {
    var question = event.currentTarget.dataset.question
    var choice = event.currentTarget.dataset.choice
    //如果没有选择。提示需要先选择
    if(choice=='')
    {
      wx.showModal({
        title: '请选择答案~',
        content: "发挥你的聪明才智把~",
        showCancel: false,
      })
      return
    }
    question.isCorrect = (question.a == choice);
    this.setData({
      currentStatus: question.isCorrect ? 1 : 0
    })
    var bonus = question.level * 10
    question.choice = choice;
    var money = wx.getStorageSync("money")
    //判断是否答对 //答对 + 10*难度 答错扣10*难度。 
    //初始化的时候每个人都会获得200金币。如果金币不够就不能再玩了。

    money += (question.isCorrect?1:-1)*bonus
    wx.showModal({
      title: question.isCorrect ? '恭喜，答对了！' : '很遗憾，答错了！',
      content: question.isCorrect ? '获得' + bonus + '金币 当前金币' + (money) : '失去' + bonus + '金币 当前金币' + (money ),
      showCancel: false,
    })
    wx.setStorageSync('money', money )
  },

  onChooseOption: function(event) {
    //如果已经有结果了就不能再选了
    if(this.data.currentStatus!=-1)
    {
      return;
    }
    //将currentChoose设置为当前option。
    this.setData({
      currentChoose: event.currentTarget.dataset.option
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var _this = this;
    t_choiceQuestions.where({
      _id: _.gte(0).and(_.lt(20))
    }).get({
      success(res) {
        if (res.data.length > 0) {
          //拼接等级星级
          let currentLevel = "";
          for (let i = 0; i < res.data[0].level; i++) {
            currentLevel += "⭐️";
          }
          _this.setData({
            questions: res.data,
            currentQuestion: res.data[0],
            currentOptions: res.data[0].options.split("|"),
            currentLevel: currentLevel
          });
        }
        console.log(res)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})