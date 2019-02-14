//app.js
App({
  onLaunch:function()
  {
    wx.cloud.init() 
    if(wx.getStorageSync("jokeCollection") === '')
    {
      console.log("true")
      wx.setStorageSync("jokeCollection", []);
    }
  }
})