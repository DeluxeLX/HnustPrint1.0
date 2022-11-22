// pages/a-hnustPrint/home/home.js
const { cwUrl } = require('../../../utils/env')

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  toPrintUpload() {
    if (this.hasToken()) {
      wx.navigateTo({
        url: '/pages/a-hnustPrint/printUpload/printUpload',
      })
    } else {
      wx.showToast({
        title: '请您先登录~',
        icon: 'error'
      })
    }
    
    // wx.navigateTo({
    //   url: '/pages/a-hnustPrint/printUpload/printUpload',
    // })
  },

  /*
    检测是否有 token
  */
  hasToken() {
    let token = wx.getStorageSync('token')
    //console.log(token)
    if (token == null || token == '' || token == undefined) {
      return false
    } else {
      return true
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  // test() {
  //   wx.request({
  //     url: cwUrl + '/courseware/testStr',
  //     method: "POST",
  //     success(res) {
  //       console.log(res)
  //     }
  //   })
  // }
})