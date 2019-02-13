//app.js
App({
  onLaunch:function()
  {
    if(wx.getStorageSync("jokeCollection") === '')
    {
      console.log("true")
      wx.setStorageSync("jokeCollection", []);
    }
  }
})