// pages/choice/choice.js
const db = wx.cloud.database({
  env: 'tinypro-test-9fdcb8'
})
const t_choiceQuestions = db.collection('choiceQuestions')
const t_choiceRecords = db.collection('choiceRecords')
const t_user = db.collection('user')
const _ = db.command
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentQuestion: '',
    currentOptions: [],
    currentChoose: '',
    constOpts: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
    currentLevel: "",
    // -1表示未选择，1表示正确，0表示错误。
    currentStatus: -1,
    money:''
  },

  onPrevious: function (event) {
    var choicePosition = wx.getStorageSync('choicePosition') - 1
    if (choicePosition < 1 ) {
      choicePosition =  1
    }
    wx.setStorageSync('choicePosition', choicePosition)
    this.loadQuestion()
    app.refreshUserInfo()
  },

  onNext:function(event){
    if(this.data.currentStatus==-1)
    {
      wx.showModal({
        title: '这道题还没做完~',
        content: "发挥你的聪明才智吧~",
        showCancel: false
      })
      return
    }
    var choicePosition = wx.getStorageSync('choicePosition')+1
    var choiceIndex = wx.getStorageSync('choiceIndex')
    if(choicePosition-choiceIndex>1)
    {
       choicePosition=choiceIndex+1
    }
    wx.setStorageSync('choicePosition', choicePosition)
    this.loadQuestion()
    app.refreshUserInfo()
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
    //选择后生成历史记录
    let choiceRecord=JSON.parse(JSON.stringify(question))
    choiceRecord._id=question._id+'_'+wx.getStorageSync('openId')
    choiceRecord.isCorrect = (question.a == choice);
    choiceRecord.createAt= new Date
    choiceRecord.choice=choice
    var bonus = question.level * 10
    question.choice = choice;
    var money = wx.getStorageSync("money")
    //判断是否答对 //答对 + 10*难度 答错扣10*难度。 
    //初始化的时候每个人都会获得200金币。如果金币不够就不能再玩了。

    money += (choiceRecord.isCorrect?1:-1)*bonus
    this.setData({
      currentStatus: choiceRecord.isCorrect ? 1 : 0,
      money: money
    })
    wx.setStorageSync('money', money)
    wx.setStorageSync('choiceIndex', question._id)
    wx.showModal({
      title: choiceRecord.isCorrect ? '恭喜，答对了！' : '很遗憾，答错了！',
      content: choiceRecord.isCorrect ? '获得' + bonus + '金币 当前金币' + (money) : '失去' + bonus + '金币 当前金币' + (money ),
      showCancel: false,
      complete:function(res){
        if (money >= 0){return}
        wx.showModal({
          title: '您破产了！',
          content: '还是要谨慎答题哟！',
          showCancel: false
        })
      }
    })
    t_choiceRecords.add({
      data: choiceRecord
    }).catch(ex=>{
     let updateRecord=JSON.parse(JSON.stringify(choiceRecord))
      updateRecord._id=undefined
      console.log("chocier"+choiceRecord._id)
      console.log( updateRecord)
      t_choiceRecords.doc(choiceRecord._id).update({
        data: updateRecord
      })
    })
    app.refreshUserInfo()
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

  onShowWhy:function(){
    if(this.data.currentStatus==-1)
    {
      wx.showModal({
        title: '您还没有答题哟~',
        content: '自己答完之后才能查看答案~',
        showCancel:false
      })
    }
    let currentQuestion=this.data.currentQuestion
    let cost= 3 * currentQuestion.level
    let _this=this
    if( !currentQuestion.showTips)
    {
      if(this.data.money<cost)
      {
        wx.showModal({
          title: '您的金币不足哦~',
          content: '“查看解析”需要耗费' + cost + '金币~',
          showCancel: false
        })
      }else{
        wx.showModal({
          title: '提示',
          content: '“查看解析”需要耗费' + cost + '金币~',
          success: res => {
            wx.showModal({
              title: "答案是："+currentQuestion.a,
              content: currentQuestion.tips,
            })
            this.data.currentQuestion.showTips=true;
            //更新choiceRecord
            let id = this.data.currentQuestion._id
            if (this.data.currentQuestion.createAt==undefined)
            {
              id = id+"_"+wx.getStorageSync('openId')
            }
            t_choiceRecords.doc(id).update({
              data:{
                showTips:true,
                updateAt:new Date
              }
            })
            let newMoney = _this.data.money - cost
            wx.setStorageSync('money', newMoney)
            _this.setData({ money: newMoney})
            app.refreshUserInfo()
          }
        })
      }
    }
    else{
      wx.showModal({
        title: "答案是：" + currentQuestion.a,
        content: currentQuestion.tips,
        showCancel: false
      })
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // if(wx.getStorageSync('openId')=='')
    // {
      console.log("第一种情况")
      app.initUserInfo().then(res => this.loadQuestion(res))
    // }else
    // {
      // console.log("第二种情况")
      // this.loadQuestion()
    // }
    
  },

  loadQuestion: function (res){
    //获取当前choicePosition
    var choicePosition=wx.getStorageSync('choicePosition')
    var choiceIndex = wx.getStorageSync('choiceIndex')
    if(choicePosition==='')
    {
      choicePosition=res.choicePosition
    }
    if(choiceIndex==='')
    {
      console.log(wx.getStorageSync('choiceIndex'))
      choiceIndex = res.choiceIndex
    }
    var _this = this;
  
    var t_table = (choicePosition <=choiceIndex)?t_choiceRecords:t_choiceQuestions
    var t_id = (choicePosition <= choiceIndex) ?choicePosition+'_'+wx.getStorageSync('openId'):choicePosition
    
    t_table.doc(t_id).get().then(res=> {
          //拼接等级星级
          let currentLevel = "";
          for (let i = 0; i < res.data.level; i++) {
            currentLevel += "⭐️";
          }
          _this.setData({
            currentQuestion: res.data,
            currentOptions: res.data.options.split("|"),
            currentLevel: currentLevel,
            currentChoose: res.data.choice==undefined?'':res.data.choice,
            // -1表示未选择，1表示正确，0表示错误。
            currentStatus: res.data.isCorrect==null?-1:(res.data.isCorrect?1:0),
            money: wx.getStorageSync('money')
          });
        console.log(res)
      }
    ).catch(ex=>{wx.showModal({
      title: '不要用眼过度哦！',
      content: '休息一下再来吧~',
      showCancel:false
    })
      wx.setStorageSync('choicePosition', choicePosition-1)
      _this.loadQuestion()
    })
  },

  onCallHelp:function(){
    wx.showModal({
      title: '收到来自作者的鼓励',
      content: '加油加油你最棒！',
      showCancel:false
    })
  },

  onCollect: function () {
    wx.showModal({
      title: '需要2500金币才能够收藏',
      content: '收藏后您就会成为这道题的拥有者哦~并能够获得这道题的所有收益~',
      showCancel: false
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