// pages/a-hnustPrint/mine/mine.js
const { user, token } = require('../../../utils/auth')
const { cwUrl } = require('../../../utils/env')
// 七天
const EXPIRATION_TIME = 1000 * 60 * 60 * 24 * 7

Page({
  /**
   * 页面的初始数据
   */
  data: {
    user: {},
    encryptedData: "",
    iv: "",
    tmplIds: []
  },

  /**
   * 生命周期函数 -- 监听页面加载
   */
  onLoad(options) {
    if (this.isExpiration() == true) {
      // token 已过期，需重新登录
      console.log("未登录状态")
      this.getSessionId()
    } else {
      // token 未过期, 表示已登录状态。向后端发起请求更新 token，表示用户活跃
      //console.log("处于登录状态" + wx.getStorageSync('sessionId'))
      //console.log("token: " + wx.getStorageSync('token'))
      let user = {
        nickname: wx.getStorageSync('nickname'),
        portrait: wx.getStorageSync('portrait')
      }
      this.setData({
        user: user
      })
      // 向后端发起请求更新 token
      wx.request({
        url: cwUrl + '/user/userInfo',
        method: "GET",
        data: {
          refresh: true
        },
        header: {
          'content-Type': 'application/x-www-form-urlencoded',
          'Authorization': wx.getStorageSync('token')
        },
        success(res1) {
          //console.log("更新token成功")
          //console.log(res1)
          // 设置 token 缓存
          wx.setStorageSync('token', res1.data.data.token)
          // 当前时间
          var timestamp = Date.parse(new Date())
          // 加上过期时间
          var expiration = timestamp + EXPIRATION_TIME
          // 存入缓存
          wx.setStorageSync('data_expiration', expiration)
        },
        fail(res2) {
          console.log("更新token失败")
          console.log(res2)
        }
      })
    }
  },

  /**
   * 用户登录接口
   */
  login() {
    wx.getUserProfile({
      desc: '必须授权才能使用',
      success: res => {
        let user = res.userInfo
        if (user) {
          //console.log("授权成功，信息传入到 data 中")
          this.setData({
            user: user,
            encryptedData: res.encryptedData,
            iv: res.iv
          })
          //console.log("开始请求/user/authLogin")
          wx.request({
            url: cwUrl + '/user/authLogin',
            method: "POST",
            data :{
              encryptedData: res.encryptedData,
              iv: res.iv,
              sessionId: wx.getStorageSync('sessionId')
            },
            success: res1 => {
              //console.log("登录成功", res1)
              this.setData({
                user: res1.data.data
              })

              if (res1.data.code == 0 && res1.data.data.token) {
                //console.log("开始缓存", res1.data.data)
                // 设置 token 缓存
                wx.setStorageSync('token', res1.data.data.token)
                // 当前时间
                var timestamp = Date.parse(new Date())
                // 加上过期时间
                var expiration = timestamp + EXPIRATION_TIME
                // 存入缓存
                wx.setStorageSync('data_expiration', expiration)
                wx.setStorageSync('userId', res1.data.data.id)
                wx.setStorageSync('nickname', res1.data.data.nickname)
                wx.setStorageSync('portrait', res1.data.data.portrait)
              }
            },
            fail: res2 => {
              console.log("登录失败" + res2)
            }
          })
        }
      },
      fail: res => {
        console.log("/login失败")
        console.log(res)
      }
    })
  },

  /**
   * 得到用户 sessionId
   */
  getSessionId() {
    wx.login({
      success: (res1) => {
        wx.request({
          url: cwUrl + '/user/getSessionId',
          method: 'GET',
          header: {
            'content-type':'application/x-www-form-urlencoded'
          },
          data: {
            code: res1.code
          },
          success(res2) {
            console.log(res2)
            if (res2.data.data.sessionId) {
              wx.setStorageSync('sessionId', res2.data.data.sessionId)
            }
          }
        })
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
    let userInfo = this.data.user
    if (!user) {
      userInfo = '';
    }
    this.setData({
      userInfo: user ,
    })
  },

  // 缓存是否过期
  isExpiration() {
    // 当前时间
    var timestamp = Date.parse(new Date());
    // 缓存中的过期时间
    var data_expiration = wx.getStorageSync("data_expiration");
    // 如果缓存中没有data_expiration，说明也没有token，还未登录
    if (data_expiration) {
      // 如果超时了，清除缓存，重新登录
      if (timestamp > data_expiration) {
        wx.clearStorageSync();
        return true;
      }else{
        return false;
      }
    }
    return true;
  },

  // 进入订单页面
  myOrders() {
    if (this.hasToken()) {
      wx.navigateTo({
        url: '/pages/a-hnustPrint/orders/orders'
      })
    } else {
      wx.showToast({
        title: '请您先登录~',
        icon: 'error'
      })
    }
  },

  myAddress() {
    wx.showToast({
      title: '系统升级中',
      icon: 'error'
    })
  },

  priceList() {
    wx.showToast({
      title: '系统升级中',
      icon: 'error'
    })
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