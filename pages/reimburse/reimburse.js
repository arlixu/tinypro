// pages/reimburse/reimburse.js
const getDateStr = function GetDateStr(AddDayCount) {
  var dd = new Date();
  dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期 
  var year = dd.getFullYear()
  var month = dd.getMonth() + 1
  var day = dd.getDate()
  return [year, month, day].map(formatNumber).join('-');
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasRecord_hr: false,
    hasRecord_fee: false,
    noRecordDate_hr: "",
    noRecordData_fee: "",
    noRecordId_hr: ""
  },

  bindViewTap: function () {
    wx.navigateTo({
      url: '../joke/joke'
    })
  },
  bindMbrain: function () {
    wx.navigateTo({
      url: '../mbrain/mbrain'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.checkFillInfo();
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

  },
  checkFillInfo: function () {
    this.checkHrFillInfo();
    this.checkFeeFillInfo();
  },
  checkFeeFillInfo: function () {
    var _this = this;
    var req = "callCount=1\r\nnextReverseAjaxIndex=0\r\nc0-scriptName=rembursementDwr\r\nc0-methodName=getListByuser\r\nc0-id=0\r\nc0-param0=string:3a959877-6102-4cd5-bbe5-c3baa64742a4\r\nc0-param1=string:${startAt}\r\nc0-param2=string:${endAt}\r\nc0-param3=string:1\r\nc0-param4=string:50\r\nbatchId=7\r\ninstanceId=0\r\npage=%2Fzd_ProjectManage%2FproManagement%2FreimburseCost%2FexpensesList.jsp\r\nscriptSessionId=7drHWQtsE7n9nGFZbdqwCSSU7nUw5zd8M5m/5QV8M5m-nCFNMFFue";
    //7days
    var startAt = getDateStr(-6);
    var endAt = getDateStr(0);
    req = req.replace("${startAt}", startAt);
    req = req.replace("${endAt}", endAt);
    //  console.log(req);
    wx.request({
      url: 'https://www.arlixu.com/zd_ProjectManage/dwr/call/plaincall/rembursementDwr.getListByuser.dwr',
      method: "post",
      data: req,
      header: {
        'content-type': 'text/plain' // 默认值
      },
      success: function (res) {
        //  console.log(res.data);
        var resData = res.data;
        var resultDates = "";
        var resultIds = "";
        //7 days
        for (var day = 0; day >= -6; day--) {
          if (resData.indexOf(getDateStr(day)) == -1) {
            resultDates += getDateStr(day) + ",";
          }
        }
        if (resultDates.length > 0) {
          resultDates = resultDates.substring(0, resultDates.length - 1);
          console.log("费用报销未填：" + resultDates);
          _this.setData({
            hasRecord_fee: true,
            noRecordDate_fee: resultDates
          });
        }
      }
    })
  },
  /**
   * 历史记录填写情况
   */
  checkHrFillInfo: function () {
    var _this = this;
    wx.request({
      url: 'https://www.arlixu.com/zd_ProjectManage/dwr/call/plaincall/userworkinfoDwr.getList.dwr',
      method: "post",
      data: "callCount=1\r\nnextReverseAjaxIndex=0\r\nc0-scriptName=userworkinfoDwr\r\nc0-methodName=getList\r\nc0-id=0\r\nc0-param0=string:3a959877-6102-4cd5-bbe5-c3baa64742a4\r\nc0-param1=string:2\r\nc0-param2=string:1\r\nc0-param3=string:7\r\nbatchId=4\r\ninstanceId=0\r\npage=%2Fzd_ProjectManage%2FproManagement%2Fprojectapproval%2FhistoryList.jsp\r\nscriptSessionId=TkvSQR4HsjUciEinQu~!7Yv6H5OMlGNxI5m/LGOxI5m-0UGigzcQj",
      //nc0-param3=string:2 显示2条
      header: {
        'content-type': 'text/plain' // 默认值
      },
      success: function (res) {
        //获取结果集中的表格list
        var resJson = res.data.substring(res.data.indexOf("jsonArray:[{") + 11, res.data.indexOf("//#DWR-END#") - 13);
        var resArray = resJson.split("},{");
        var resultDates = "";
        var resultIds = "";
        for (var i = 0; i < resArray.length; i++) {
          if (resArray[i].indexOf('mark:""') != -1) {
            var rData = resArray[i];
            resultDates += rData.substring(rData.indexOf(",date:") + 7, rData.indexOf(",date:") + 17) + ",";
            resultIds += rData.substring(rData.indexOf(",id:") + 4, rData.indexOf(",mark:")) + ",";
          }
        };
        if (resultDates.length > 0 && resultIds.length > 0) {
          resultDates = resultDates.substring(0, resultDates.length - 1);
          resultIds = resultIds.substring(0, resultIds.length - 1);
          console.log("历史记录未填：" + resultDates);
          console.log("历史记录未填ID：" + resultIds);
          _this.setData({
            hasRecord_hr: true,
            noRecordDate_hr: resultDates,
            noRecordId_hr: resultIds
          });
        }
      }
    });
  },


  /**
   * 点击一键填写历史记录
   */
  fillHistory_hr: function () {
    this.setData({
      hasRecord_hr: false
    });
    var ids = this.data.noRecordId_hr;
    if (ids.length > 0) {
      var idArray = ids.split(",");
      var reqTemplate = "callCount=1\r\nnextReverseAjaxIndex=0\r\nc0-scriptName=userworkinfoDwr\r\nc0-methodName=updatemark\r\nc0-id=0\r\nc0-param0=string:${id}\r\nc0-param1=string:%E5%AE%8C%E6%88%90%E9%87%8F%EF%BC%9A1%20%0A%E5%B7%A5%E4%BD%9C%E5%86%85%E5%AE%B9%EF%BC%9A1.%E5%88%B6%E4%BD%9C%E5%88%B0%E8%B4%A7%E8%AF%81%E6%98%8E%0A2.%E5%88%B6%E4%BD%9C%E6%89%BF%E8%AF%BA%E4%B9%A6%0A3.%E5%88%B0%E8%88%AA%E7%A9%BA%E6%B8%AF%E7%AD%BE%E5%AD%97%E3%80%81%E7%9B%96%E7%AB%A0\r\nbatchId=1\r\ninstanceId=0\r\npage=%2Fzd_ProjectManage%2FprojectManage%2Fprojectapproval%2FhistoryList.jsp\r\nscriptSessionId=WhvQkWiYeApIAjro~IjhBW~fL5OqkHbgH1m/Wa3rK1m-hIut6Dd1o";
      for (var i = 0; i < idArray.length; i++) {
        var req = reqTemplate.replace("${id}", idArray[i]);
        wx.request({
          url: 'https://www.arlixu.com/zd_ProjectManage/dwr/call/plaincall/userworkinfoDwr.updatemark.dwr',
          method: "post",
          data: req,
          header: {
            'content-type': 'text/plain' // 默认值
          },
          success: function (res) {
            console.log("历史记录成功填写。");
          }
        })
      }
    }
    this.setData({
      noRecordDate_hr: "",
      noRecordId_hr: ""
    });
  },
  /**
   * 点击一键填写费用报销
   */
  fillHistory_fee: function () {
    this.setData({
      hasRecord_fee: false
    });
    var dates = this.data.noRecordDate_fee;
    if (dates.length > 0) {
      var dateArray = dates.split(",");
      var reqTemplate = "callCount=1\r\nnextReverseAjaxIndex=0\r\nc0-scriptName=rembursementDwr\r\nc0-methodName=addReimbursement\r\nc0-id=0\r\nc0-param0=string:3a959877-6102-4cd5-bbe5-c3baa64742a4\r\nc0-param1=string:%E6%9D%8E%E7%8E%89\r\nc0-param2=string:${date}\r\nc0-param3=string:%E6%88%90%E9%83%BD\r\nc0-param4=string:%E5%8F%8C%E6%B5%81\r\nc0-param5=string:0\r\nc0-param6=string:\r\nc0-param7=string:\r\nc0-param8=string:30\r\nc0-param9=string:\r\nc0-param10=string:30.00\r\nc0-param11=string:\r\nc0-param12=string:1\r\nc0-param13=string:\r\nbatchId=3\r\ninstanceId=0\r\npage=%2Fzd_ProjectManage%2FprojectManage%2FreimburseCost%2FexpensesList.jsp\r\nscriptSessionId=nFrJ!srsBeRRFTI7Unr3ZQZbI~7pS4RkH1m/Y9ElH1m-imb1sehlw";
      for (var i = dateArray.length - 1; i >= 0; i--) {
        var req = reqTemplate.replace("${date}", dateArray[i]);
        wx.request({
          url: 'https://www.arlixu.com/zd_ProjectManage/dwr/call/plaincall/rembursementDwr.addReimbursement.dwr',
          method: "post",
          data: req,
          header: {
            'content-type': 'text/plain' // 默认值
          },
          success: function (res) {
            console.log("费用报销记录成功填写。");
          }
        })
      }
    }
    this.setData({
      noRecordDate_fee: ""
    });

  }

})