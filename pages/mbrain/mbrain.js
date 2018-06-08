// pages/mbrain/mbrain.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mbrain:[],
    index:0,
    showAnswer:false
  },
  see: function()
  {
    this.setData({showAnswer:true})
  },
  next: function()
  {
    if(this.data.index>=this.data.mbrain.length-1)
    {
      this.getMbrain();
    }else{
      this.setData({
        index: this.data.index + 1,
        showAnswer: false
      })
    }
  },

  getMbrain: function () {
    var _this=this;
  wx.request({
    url: 'https://www.arlixu.com/mbrain',
    method: 'get',
    success:function(res)
    {
      _this.setData(
        {mbrain:res.data,
        index:0,
        showAnswer:false
        }
      );
    }
  })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  this.getMbrain();
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
    console.log("pull")
    if(this.data.showAnswer)
    this.next()
    else
    this.see()

    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.next();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})