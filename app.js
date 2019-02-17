//app.js
App({
  onLaunch:function()
  {
 
    wx.cloud.init() 
    const db = wx.cloud.database({ env: 'tinypro-test-9fdcb8' })
    const t_user = db.collection('user')
    if(wx.getStorageSync("jokeCollection") === '')
    {
      console.log("true")
      wx.setStorageSync("jokeCollection", []);
    }
    if (wx.getStorageSync("mbrainIndex") === '') {
      console.log("第一次访问脑筋急转弯")
      wx.setStorageSync("mbrainIndex", 0);
      wx.cloud.callFunction({
        name: 'getUserInfo',
        complete: res => {
          console.log('callFunction getUserInfo result: ', res)
          t_user.add({
            data:{
              _id:res.result.userInfo.openId,
              mbrainIndex:0
            }
          }).catch(res=>console.log(res))
        }
      })
    }
  }
})