// pages/joke/joke.js
const db = wx.cloud.database({ env: 'tinypro-test-9fdcb8' })
const t_jokes = db.collection('jokes')
const t_jokeCollection = db.collection('jokeCollection')
const t_jokeCopy = db.collection('jokeCopy')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    joke: []
  },
  refreshCollection: function () {
    let jokes = this.data.joke
    let jokeCollection = wx.getStorageSync("jokeCollection")
    for (var i = 0; i < jokes.length; i++) {
      let flag = false
      for (var j = 0; j < jokeCollection.length; j++) {
        if (jokes[i].hashId === jokeCollection[j].hashId) {
          flag = true
          break
        }
      }
      let data = "joke[" + i + "].isCollected"
      this.setData({
        [data]: flag
      })
    }
  },

   //收藏
  onCollectionTap: function (event) {
    let joke = event.currentTarget.dataset.joke;
    let index = event.currentTarget.dataset.index;
    let data = 'joke[' + index + '].isCollected';
    let isCollected = joke.isCollected ? false : true
    joke.isCollected = isCollected;
    this.setData({
      [data]: isCollected
    })
    if (isCollected) {
      //存到缓存
     var tmpJC= wx.getStorageSync('jokeCollection')
      tmpJC.unshift(joke)
      wx.setStorageSync('jokeCollection', tmpJC)
      //存到数据库
      joke.collectAt=new Date
      t_jokeCollection.add({
        data:joke
      }).catch(res=>console.log(res))
    } else {
      //移除缓存
      let jokeCollection = wx.getStorageSync('jokeCollection')
      for (var i = 0; i < jokeCollection.length; i++) {
        if (jokeCollection[i].hashId === joke.hashId) {
          jokeCollection.splice(i, 1);
        }
      }
      wx.setStorageSync('jokeCollection', jokeCollection)
      console.log(wx.getStorageSync('jokeCollection'))
    }
  },

  copyJoke: function (event) {
    wx.setClipboardData({
      data: event.currentTarget.dataset.joke.content,
    })
    //存到数据库
    let joke = event.currentTarget.dataset.joke
    joke.copyAt = new Date
    t_jokeCopy.add({
      data: joke
    }).catch(res => console.log(res))
  },
  addJoke: function () {
    var _this = this;
    wx.request({
      url: "https://v.juhe.cn/joke/randJoke.php?type=&key=bbf19fa0c8c027edb879041dc369cb18",
      method: "get",
      success: function (res) {
        var jokes = [];
        for (var i = 0; i < res.data.result.length; i++) {
          jokes[i] = res.data.result[i];
          //将joke加入到数据库中。


          var jokeEntity=JSON.parse(JSON.stringify(jokes[i]))
          jokeEntity._id=jokes[i].hashId
            t_jokes.add(
              {
                data: jokeEntity
              }
            ).catch(res=>console.log("已经存在了"+res.data)
            )
          //渲染收藏星星，如果是在收藏列表中的，就把isCollected设置为true。
          let jokeCollection = wx.getStorageSync("jokeCollection")
          for (var j = 0; j < jokeCollection.length; j++) {
            if (jokes[i].hashId === jokeCollection[j].hashId) {
              jokes[i].isCollected = true
            }
          }
        }
        _this.setData({ joke: _this.data.joke.concat(jokes) });
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     this.addJoke();
    this.refreshCollection();
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
    this.refreshCollection();
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
    this.addJoke();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

})