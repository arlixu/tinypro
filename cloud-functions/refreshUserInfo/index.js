// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database({ env: 'tinypro-test-9fdcb8' })
const t_user = db.collection('user')
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  //获取到openid
  var openId = wxContext.OPENID
   await t_user.doc(openId).update({
    data: {
      mbrainIndex: event.mbrainIndex,
      choiceIndex: event.choiceIndex,
      money: event.money,
      choicePosition: event.choicePosition,
      updateAt:new Date
    }
  }).then(res=>console.log(res))
}