//app.js
App({
  onLaunch:function()
  {
    wx.cloud.init() 
    //根据用户openid获取用户是否有money
    wx.cloud.callFunction({
      name:'initUserInfo',
      complete:res=>{
        console.log(res.result)
        wx.setStorageSync("mbrainIndex", res.result.mbrainIndex);
        wx.setStorageSync("choiceIndex", res.result.choiceIndex);
        wx.setStorageSync("money", res.result.money);
        if(res.result.isFirstTime)
        {
          wx.showModal({
            title: '首次登陆奖励',
            content: '恭喜你，获得200金币！',
            showCancel: false
          })
        }
      }
    })
    if(wx.getStorageSync("jokeCollection") === '')
    {
      console.log("true")
      wx.setStorageSync("jokeCollection", []);
    }
  }
})