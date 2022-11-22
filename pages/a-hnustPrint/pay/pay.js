// pages/a-hnustPrint/pay/pay.js
const { cwUrl } = require('../../../utils/env')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    amountAll: ""
  },

  /*
    假的支付模块
  */
  wechatPay() {
    var status = 1
    var amount = Number(this.data.amountAll)
    var printList = wx.getStorageSync('printList')

    wx.showToast({
      title: '支付成功（测试）',
      icon: 'success',
      duration: 1500
    })

    wx.request({
      url: cwUrl + '/order/generateOrder',
      method: "POST",
      header: {
        'content-type': 'application/json',
        'Authorization': wx.getStorageSync('token')
      },
      data: {
        status: status,
        amount: amount,
        documentNum: printList.length,
        fileList: printList
      },
      success(res1) {
        wx.removeStorageSync('printList')
        wx.navigateTo({
          url: '/pages/a-hnustPrint/printUpload/printUpload'
        })
      },
      fail(res2) {
        console.error(res2)
      }
    })

    // setTimeout(() => {
    //   wx.navigateTo({
    //     url: '/pages/a-hnustPrint/printUpload/printUpload',
    //   })
    // }, 2000)
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      amountAll: options.amountAll
    })
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

  }
})