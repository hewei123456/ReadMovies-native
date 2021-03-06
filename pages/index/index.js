//获取应用实例
const app = getApp();
const utils = require('../../utils/util.js');
const requests = require('../../utils/requests.js');
import regeneratorRuntime from '../../packages/regenerator-runtime/runtime.js'

Page({
  data: {
    motto: '在路上永远年轻 永远热泪盈眶',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    show: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      });
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = response => {
        this.setData({
          userInfo: response.userInfo,
          hasUserInfo: true
        });
      };
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      utils.getUserInfo(app).then(response => {
        this.setData({
          userInfo: response.userInfo,
          hasUserInfo: true
        });
      });
    }
    this.getToken();
  },
  /**
   * methods
   */

  // 获取微信用户信息  
  getUserInfo: function(response) {
    app.globalData.userInfo = response.detail.userInfo;
    this.setData({
      userInfo: response.detail.userInfo,
      hasUserInfo: true
    });
  }, 

  // 开启小程序之旅 
  open() {
    wx.login({
      success: async response => {
        console.log(response);
        if (response.code) {
          try {
            var res = await requests.wechatSignin(response.code)
            if (res.data.signed) {
              wx.setStorageSync('token', res.data.token);
              this.getUserinfo();
            } else
              wx.showToast({
                title: res.data.message,
                icon: 'none',
                duration: 1000
              });
          } catch (error) {
            console.log(error);
          }
        } else
          console.log("登录失败！" + res.errMsg);
      }
    });
  },

  // 手机登录 
  mobile() {
    wx.navigateTo({
      url: '/pages/login/login'
    });
  },

  getToken() {
    try {
      var token = wx.getStorageSync('token')
      if (token)
        this.getUserinfo();
    } catch (error) {
      console.log(error);
    }
  },

  // 从后台获取用户信息  
  async getUserinfo() {
    try {
      await requests.getUserinfo();
      wx.switchTab({
        url: '/pages/main/main'
      });
    } catch (error) {
      console.log(error);
    }
  }
});