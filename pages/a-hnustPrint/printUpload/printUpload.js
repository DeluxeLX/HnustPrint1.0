// pages/a-hnustPrint/printUpload/printUpload.js
const fs = wx.getFileSystemManager();
const { cwUrl } = require('../../../utils/env')
const { price } = require('../../../utils/env')
import Toast from 'tdesign-miniprogram/toast/index';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    bottom: false,
    showConfirm: false,
    operList: [
      {
        btns: [
          {
            type: 'bottom',
            text: '+'
          }
        ]
      }
    ],
    printList: [
      // {
      //   index: 1,
      //   filename: "测试1.docx",
      //   filePath: "wxfile://tmp_51687b78fb9a443dcb862ad7a4885a4aa1cf68c2ac4a09d8c195322baed16470.docx",
      //   typeImg: "../../../icon/index/docx.png",
      //   paperStyle: "A4",
      //   pages: "35",
      //   singleOrDouble: "单面",
      //   color: "黑白",
      //   number: 1,
      //   amount: 7.0
      // },
      // {
      //   index: 2,
      //   filename: "测试2.pdf",
      //   filePath: "wxfile://tmp_51687b78fb9a443dcb862ad7a4885a4aa1cf68c2ac4a09d8c195322baed16470.docx",
      //   typeImg: "../../../icon/index/PDF.png",
      //   paperStyle: "A4",
      //   pages: "23",
      //   singleOrDouble: "双面",
      //   color: "彩色",
      //   number: 1,
      //   amount: 4.6
      // }
    ],
    amountAll: "0.0"
  },

  /*
    点击弹窗事件
  */
  clickHandle({ detail: placement }) {
    this.setData({
        [`${placement}`]: true,
    });
  },
  onVisibleChange() {
    this.setData({
        bottom: false
    });
  },

  /*
    得到文件页数
  */
  getFile() {
    // 选择微信上的文件
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      success:res => {
        //console.log(res.tempFiles)
        this.onVisibleChange()    // 取消弹窗样式
        wx.showLoading({
          title: '正在加密上传',
        })
        let file = {
          path: res.tempFiles[0]["path"],
          filename: res.tempFiles[0]["name"],
          userId: wx.getStorageSync('userId')
        }
        var fileType = file.path.substring(file.path.length - 4, file.path.length)
        var pdfOrWord = false
        if (fileType == '.pdf') {
          pdfOrWord = true
        }
        //console.log(fileType)
        wx.uploadFile({
          filePath: file.path,
          name: "file",
          url: cwUrl + '/file/uploadFileToRedis',
          formData: file,
          success: res => {
            //console.log("上传成功", res.data)
            var printList = this.data.printList
            var length = printList.length
            //console.log(length === 0)
            let item = {
              index: length + 1,
              filename: file.filename,
              filePath: file.path,
              typeImg: pdfOrWord ? "../../../icon/index/PDF.png" : "../../../icon/index/docx.png",
              paperStype: "A4",
              pages: res.data,
              singleOrDouble: "单面",
              color: "黑白",
              number: 1,
              amount: Number((res.data * price).toFixed(1)),
              uploadStyle: 0
            }
            // console.log(item)
            printList.push(item)
            this.setData({
              printList: printList,
              amountAll: Number(this.data.amountAll) + Number((item.amount).toFixed(1))
            })
            wx.setStorageSync('printList', printList)
            wx.hideLoading()
          },
          fail: err => {
            this.onVisibleChange()    // 取消弹窗样式
            this.handleToast()
            console.log("上传错误", err)
          }
        })
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },

  /*
    预览上传文件
  */
  preViewFile(e) {
    console.log(e.currentTarget.dataset.index)
    let printList = this.data.printList
    let index = e.currentTarget.dataset.index   // 数组索引
    let filePath = printList[index].filePath
    let uploadStyle = printList[index].uploadStyle
    if (uploadStyle == 0) {
      // 微信上传的文件
      wx.openDocument({
        filePath: filePath,
        success(res) {
          console.log('预览文件成功', res)
        },
        fail(res) {
          console.log('预览文件失败', res)
        }
      })
    } else {
      // 本地上传的文件, 需从阿里云 OSS 中获取
      wx.downloadFile({
        url: filePath,
        success: function(res) {
          console.log(res, "下载文件成功")
          const localfilepath = res.tempFilePath
          wx.openDocument({
            filePath: localfilepath,
            success: function(res) {
              console.log('预览文件成功')
            },
            fail: function(res) {
              console.log('预览文件失败')
            }
          })
        },
        fail: function(err) {
          console.log(err, "下载文件失败")
        }
      })
    }
    
  },
  
  /*
    本地上传，采用 web-view组件
  */
  localUpload() {
    wx.showToast({
      title: '需升级为企业级\n小程序',
      icon: 'error'
    })
    // wx.navigateTo({
    //   url: '/pages/a-hnustPrint/uploadLocal/uploadLocal',
    // })
  },

  /*
    删除文件列表中的文件
  */
  deleteFile(e) {
    //console.log(e.currentTarget.dataset)
    var index = e.currentTarget.dataset.index
    var printList = this.data.printList
    var printFile = printList[index]
    var that = this
    wx.showModal({
      title: '提示',
      content: '确定删除该文件吗？',
      confirmColor: '#f33131',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: cwUrl + '/file/removeFileFromRedis',
            method: "GET",
            data: {
              userId: wx.getStorageSync('userId'),
              filename: printFile.filename,
              uploadStyle: printFile.uploadStyle
            },
            success(res) {
              console.log(res, "删除成功")
            }
          })
          printList.splice(index, 1)
          that.setData({
            printList: printList,
            amountAll: printList ? (Number(that.data.amountAll) - Number(printFile.amount * printFile.number)).toFixed(1) : "0.0"
          })
          wx.setStorageSync('printList', printList)
        } else if (res.cancel) {
          // 用户点击了取消
        }
      }
    })

  },

  /*
    进入打印参数设置
  */
  printSetting(e) {
    let index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: '/pages/a-hnustPrint/printSetting/printSetting?printIndex=' + index,
    })
  },

  /*
    轻提示弹窗，上传失败
  */
  toast(option) {
    Toast({
      context: this,
      selector: '#t-toast',
      ...option,
    })
  },
  handleToast() {
    this.toast({
      message: '上传失败',
      theme: 'fail',
      direction: 'column',
      duration: 3000
    })
  },

  /*
    跳转到确定支付页面
  */
  pay() {
    var amountAll = this.data.amountAll
    wx.navigateTo({
      url: '/pages/a-hnustPrint/pay/pay?amountAll=' + amountAll,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // var printList = this.data.printList
    // wx.setStorageSync('printList', printList)
    // console.log(options)
    console.log(options.url)

    if (options.url != undefined) {
      var printList = wx.getStorageSync('printList')
      if (printList == '' || printList == null || printList == undefined) {
        console.log('进入到这')
        printList = this.data.printList
      }
      var fileType = options.filename.substring(options.filename.length - 4, options.filename.length)
      var pdfOrWord = false
      if (fileType == '.pdf') {
        pdfOrWord = true
      }
      let item = {
        index: printList.length + 1,
        filename: options.filename,
        filePath: options.url,
        typeImg: pdfOrWord ? "../../../icon/index/PDF.png" : "../../../icon/index/docx.png",
        paperStype: "A4",
        pages: options.pages,
        singleOrDouble: "单面",
        color: "黑白",
        number: 1,
        amount: Number((options.pages * price).toFixed(1)),
        uploadStyle: 1
      }
      printList.push(item)
      wx.setStorageSync('printList', printList)
    }

    var printList = wx.getStorageSync('printList')
    if (printList != null && printList != '') {
      var amountDouble = 0.0
      for (let i=0; i<printList.length; i++) {
        amountDouble += printList[i].amount * printList[i].number
      }
      this.setData({
        printList: printList,
        amountAll: amountDouble.toFixed(1)
      })
    }
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
    //console.log(getCurrentPages())
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
    wx.navigateBack({
      delta: getCurrentPages().length,
    })
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