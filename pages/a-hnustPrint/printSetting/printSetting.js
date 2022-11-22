// pages/a-hnustPrint/printSetting/printSetting.js
const { price } = require('../../../utils/env')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: 1,
    itemUrl: "",
    printIndex: '',
    printSetting: {},
    paperStyleBool: false,      // false A4, true A3
    singleOrDoubleBool: false,  // false 单面, true 双面
    colorBool: false,           // false 黑白, true 彩色
    amountAll: "0.0"
  },

  /*
    步进器
  */
  handleChange(e) {
    const { value } = e.detail;
    console.log(value);
    var printSetting = this.data.printSetting
    printSetting.number = value
    this.setData({
      value: value,
      printSetting: printSetting,
      amountAll: (value * (printSetting.amount)).toFixed(1)
    });
  },

  /*
    纸型切换
  */
  handlePaper1(e) {
    if (this.data.paperStyleBool) {
      var printSetting = this.data.printSetting
      printSetting.paperStype = "A4"
    }
    this.setData({
      paperStyleBool: false,
      printSetting
    })
  },
  handlePaper2(e) {
    if (!this.data.paperStyleBool) {
      var printSetting = this.data.printSetting
      printSetting.paperStype = "A3"
    }
    this.setData({
      paperStyleBool: true,
      printSetting
    })
  },

  /*
    单双切换
  */
  handleSingle1(e) {
    if (this.data.singleOrDoubleBool) {
      var printSetting = this.data.printSetting
      printSetting.singleOrDouble = "单面"
    }
    this.setData({
      singleOrDoubleBool: false,
      printSetting
    })
  },
  handleSingle2(e) {
    if (!this.data.singleOrDoubleBool) {
      var printSetting = this.data.printSetting
      printSetting.singleOrDouble = "双面"
    }
    this.setData({
      singleOrDoubleBool: true,
      printSetting
    })
  },

  /*
    颜色切换
  */
  handleColor1(e) {
    if (this.data.colorBool) {
      var printSetting = this.data.printSetting
      printSetting.color = "黑白"
    }
    this.setData({
      colorBool: false,
      printSetting
    })
  },
  handleColor2(e) {
    if (!this.data.colorBool) {
      var printSetting = this.data.printSetting
      printSetting.color = "彩色"
    }
    this.setData({
      colorBool: true,
      printSetting
    })
  },

  /*
    点击确定，修改
  */
  submitSetting(e) {
    var printSetting = this.data.printSetting
    console.log(printSetting)
    var printList = wx.getStorageSync('printList')
    printList[this.data.printIndex] = printSetting
    wx.setStorageSync('printList', printList)
    wx.navigateTo({
      url: '/pages/a-hnustPrint/printUpload/printUpload',
    })
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var printIndex = options.printIndex
    var printList = wx.getStorageSync('printList')
    this.setData({
      itemUrl: printList[printIndex].typeImg,
      printIndex: printIndex,
      printSetting: printList[printIndex],
      value: printList[printIndex].number,
      singleOrDoubleBool: printList[printIndex].singleOrDouble == "双面",
      colorBool: printList[printIndex].color == "彩色",
      amountAll: ((printList[printIndex].amount * printList[printIndex].number).toFixed(1)).toString()
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
    // 获得当前页面的页面栈
    // console.log(getCurrentPages())
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