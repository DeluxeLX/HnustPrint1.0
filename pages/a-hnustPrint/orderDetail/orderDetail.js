import { cwUrl } from "../../../utils/env"

// pages/a-hnustPrint/orderDetail/orderDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var orderId = options.orderId
    wx.request({
      url: cwUrl + '/order/getOrderDetail',
      method: "GET",
      header: {
        'content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        orderId: orderId
      },
      success: res1 => {
        console.log(res1)
        this.setData({
          printList: res1.data.data
        })
      },
      fail: res2 => {
        console.log(res2)
      }
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