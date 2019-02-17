// pages/mbrain/mbrain.js
const db = wx.cloud.database({ env: 'tinypro-test-9fdcb8' })
const t_mbrains = db.collection('mbrains')
const t_user = db.collection('user')
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mbrain:[],
    index:0,
    showAnswer:false
  },
  showAnswer: function (event)
  {
    wx.setStorageSync("mbrainIndex", event.currentTarget.dataset.mbrain._id + 1)
    this.setData({showAnswer:true})
    //在数据库中记录当前openid看到了哪个index
    wx.cloud.callFunction({
      name: 'getUserInfo',
      complete: res => {
        t_user.doc(res.result.userInfo.openId).update({
          data: {
            mbrainIndex: event.currentTarget.dataset.mbrain._id + 1
          }
        })
      }
    })
    
  },
  next: function()
  {
    this.setData({disableNext:true})
    if(this.data.index>=this.data.mbrain.length-1)
    {
      this.getMbrain();
    }else{
      this.setData({
        index: this.data.index + 1,
        showAnswer: false,
        disableNext: false
      })
    }
  },

  getMbrain: function () {
    //查询当前索引
    let mbrainIndex=wx.getStorageSync("mbrainIndex")
    var _this=this;
    t_mbrains.where({
      _id:_.gte(mbrainIndex).and(_.lt(mbrainIndex+20))
    }).get({
      success(res){
        _this.setData(
          {
            mbrain: res.data,
            index: 0,
            showAnswer: false,
            disableNext: false
          }
          
        );
      }
    })
  // wx.request({
  //   url: 'https://www.arlixu.com/mbrain',
  //   method: 'get',
  //   success:function(res)
  //   {
  //     _this.setData(
  //       {mbrain:res.data,
  //       index:0,
  //       showAnswer:false
  //       }
  //     );
  //   }
  // })

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
    this.showAnswer()

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