// pages/collection/collection.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
   jokeCollection:[]
  },
  onCollectionTap: function (event) {
    //取消收藏的逻辑
    let joke = event.currentTarget.dataset.joke;
    let index = event.currentTarget.dataset.index;
    let jokeCollectionData=this.data.jokeCollection;
    jokeCollectionData.splice(index,1)
    this.setData({
      jokeCollection: jokeCollectionData
    }) 
      //移除缓存
      let jokeCollection = wx.getStorageSync('jokeCollection')
      for (var i = 0; i < jokeCollection.length; i++) {
        if (jokeCollection[i].hashId === joke.hashId) {
          jokeCollection.splice(i, 1);
        }
      }
      wx.setStorageSync('jokeCollection', jokeCollection)
      console.log(wx.getStorageSync('jokeCollection'))
  },
  copyJoke: function (event) {
    wx.setClipboardData({
      data: event.currentTarget.dataset.joke,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.setData({
      jokeCollection: wx.getStorageSync("jokeCollection")
    })
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