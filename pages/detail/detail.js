const app = getApp()

const { post } = app.utils

const WxParse = require('../utils/wxParse/wxParse.js');
// pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      wxParseData:[],
      article:{},
      style:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.tag.toLowerCase() === 'h5'){
      return wx.showModal({
        title: '无法打开h5',
        content: '小程序无法调整外连接，此H5页面无法打开！',
        confirmText:'我晓得了',
        confirmColor:'#d81e06',
        showCancle:false,
        success(){
          wx.navigateBack()
        }
      })
    }

    this.setData({style:options.style})
    this.getArticleDetail(options)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }

,

  getArticleDetail(opt) {
    post('v2/news/detail.html', { news_id: opt.id, chid: opt.chid }).then(res => {

      var data = res.newsDetail
      var { news_title: title, news_date: date, news_praise_count: praise, news_comment_count: comment, news_source: tag } = data
      // 专题页面
      if (data.news_blocks && data.news_blocks.length) {
        this.setData({
          article: { title, date, praise, comment, tag }
        })
        return wx.showToast({ title: '目前不支持解析专题页面' })
      }

      // var article = data = strDiscode(data.news_content);
      // var json = HtmlToJson(article)
      // this.setData({wxParseData:json})
      WxParse.wxParse('html', data.news_content, this)
      this.setData({
        article: { title, date, praise, comment, tag }
      })

    }).catch(err => console.log(err))
  }
})