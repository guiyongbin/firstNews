//index.js
//获取应用实例
const app = getApp()
const cache = Object.create(null)//object.create(null)造出来的object是没有任何属性的，是空的
const { decodeHtml, parseNews } = app.utils



Page({
  _isLoading:false,
  _isRefresh:false,
  data: {
    swiperList: [],
    categoryTabs:[],
    currentTab:0,
    articles: [],
  },
  onShow(){
    if(app.globalData.categoryChanged){
      app.utils.getCategorys().then(res=>this.setData({
        categoryTabs:res
      }))
      app.globalData.categoryChanged=false
    }
  },

  onReady(){
    this.getNewsList()
  }
,
  onLoad: function () {
   
  },
  

  //下拉刷新
  onPullDownRefresh: function () {
    
    wx.showNavigationBarLoading() //在标题栏中显示加载
    // 模拟加载
    // setTimeout(function () {
    //   // complete
    //   wx.hideNavigationBarLoading() //完成停止加载
    //   wx.stopPullDownRefresh() //停止下拉刷新
    // }, 1500);

    this.getNewsList(0, 0)
   
  },
 
  
  hiddenNavigationBarLoading: function () {
  
  },


//到达底部，重新加载
onReachBottom(){
  this.getNewsList(this.data.currentTab,1)
},
//切换分类，头条，合肥，时政
changeCategory(event){
   var chid = event.target.dataset.id
   
   if (this.data.currentTab==chid){
     return false
   }
   this.setData({ currentTab:chid })
   this.getNewsList(chid, 0)
},









/****请求数据 */
  getNewsList(chid = 0,page = 0){
      if(!cache[chid]){
        //新内容  这个是清空缓存
        cache[chid] = { slides:[], news:[] , page:0 , time:Date.now() }
      }
      var infos = cache[chid]//缓存的子元素
      //获取下一页数据
      if(page){
        if (this._isLoading){
              return false;
        }
        infos.page += 1
      }else{
        //直接从缓存中取
        if(infos.news.length){
          this.setData({
            swiperList:infos.slides,
            articles:infos.news
          })
          return false
        }
      }
  
      this._isLoading =  true
      app.utils.post('v2/news/list.html',{chid:chid,page:infos.page}).then(res=>{
       
        this._isLoading =false


        var { code, newsList, newsBanner } = res
        if(code === 0){
            // 新闻管理
            // style 3下面三张图，1,下面一张大图，2.普通模式，0.无图模式
          if (newsList && newsList.length) {
            // infos.news = []
            var datas = parseNews(newsList)
            infos.news.push(...datas)
          }

        //轮播管理
        if(newsBanner && newsBanner.length){
          var banners = newsBanner.map(news=>{
            return {
              id: news.news_id,
              title: news.news_title,
              image: news.news_icon.pop(),
              style: news.news_style
            }
          })
          infos.slides.push(...banners)
        }
        this.setData({
          swiperList: infos.slides,
          articles: infos.news,
          _isRefresh : false,
       
         })
        }
     
      },
      
      
      ).catch(er => console.log(err))
     
  }
 


})
