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
  var result = ''
  var isFirstTime=false
  //先添加，添加如果报异常说明存在，再更新，
  //如果不存在就会报异常
  await t_user.add({
    data: {
      _id: openId,
      mbrainIndex: 0,
      choiceIndex: 0,
      choicePosition:1,
      money: 200,
      createAt: new Date
    }
  }).then(res => { isFirstTime=true}).catch(res => console.log(res))
  await t_user.doc(openId).get().then(
    res => { result = res.data }
  ).catch(res => { console.log( res) })
  //如果存在，但是money和choiceIndex为空，则将money和index重置为200和0.
  var newData = { updateAt: new Date }
  if (result.money == null) {
    newData.money = 200;
    result.money=200;
    isFirstTime=true;
  }
  if (result.choiceIndex == null) {
    newData.choiceIndex = 0;
    result.choiceIndex = 0;
  }
  if (result.choicePosition == null) {
    newData.choicePosition = 1;
    result.choicePosition =1;
  }
   t_user.doc(openId).update({
    data: newData
  })
  //首次登陆要弹出给与200金币的弹框。
  result.isFirstTime=isFirstTime
  return result;
}