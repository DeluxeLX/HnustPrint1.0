// pages/a-hnustPrint/orders/orders.js
const { cwUrl } = require('../../../utils/env')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    orderList: [
      // {
      //   addressId: null,
      //   amount: 12,
      //   createTime: "2022-09-26T23:13:59",
      //   documentNum: 3,
      //   id: "202209260001",
      //   status: 1,
      //   userId: 12,
      // },
      // {
      //   addressId: null,
      //   amount: 11.6,
      //   createTime: "2022-09-27T00:39:45",
      //   documentNum: 2,
      //   id: "202209270001",
      //   status: 1,
      //   userId: 12,
      // }
    ]
  },

  viewDetails(e) {
    console.log(e)
    var index = e.currentTarget.dataset.index
    var orderList = this.data.orderList
    var orderId = orderList[index].id
    wx.navigateTo({
      url: '/pages/a-hnustPrint/orderDetail/orderDetail?orderId=' + orderId,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.request({
      url: cwUrl + '/order',
      method: "GET",
      header: {
        'content-Type': 'application/x-www-form-urlencoded',
        'Authorization': wx.getStorageSync('token')
      },
      success: res1 => {
        console.log(res1.data.data)
        this.setData({
          orderList: res1.data.data
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