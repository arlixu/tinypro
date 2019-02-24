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
    isFirstTime=true;
  }
  if (result.choiceIndex == null) {
    newData.choiceIndex = 0;
  }
  await t_user.doc(openId).update({
    data: newData
  })

  await t_user.doc(openId).get().then(res => { result = res.data })
  result.isFirstTime=isFirstTime
  return result;
}