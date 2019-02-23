// pages/choice/choice.js
const db = wx.cloud.database({ env: 'tinypro-test-9fdcb8' })
const t_choiceQuestions = db.collection('choiceQuestions')
const t_user = db.collection('user')
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    questions:[],
    currentQuestion:"",
    currentOptions:[],
    currentChoose:'',
    constOpts:['A','B','C','D','E','F','G'],
    currentLevel:""
  },

  onChooseOption:function(event){
    console.log(event)
    //将currentChoose设置为当前option。
    this.setData({
      currentChoose: event.currentTarget.dataset.option
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    t_choiceQuestions.where({
      _id: _.gte(0).and(_.lt(20))
    }).get({
      success(res) {
        if(res.data.length>0)
        {
          //拼接等级星级
          let currentLevel="";
          for(let i=0;i<res.data[0].level;i++)
          {
            currentLevel +="⭐️";
          }
          _this.setData(
            {
              questions: res.data,
              currentQuestion: res.data[0].q,
              currentOptions: res.data[0].options.split("|"),
              currentLevel: currentLevel
            }
          );
        }

      
        console.log(res)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})