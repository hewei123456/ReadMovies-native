// const baseUrl = 'https://hewei.picp.vip/api/';
// const baseUrl = 'https://lightmovies.top/api/';
// const baseUrl = 'http://x2290n7883.imwork.net/api/';

const baseUrl = 'http://127.0.0.1:3000/api/'; 

const loginApi = baseUrl + 'signin';
const wechatSigninApi = baseUrl + 'wechat/signin';
const userinfoApi = baseUrl + 'userinfo';
const articlesApi = baseUrl + 'articles';
const collectApi = baseUrl + 'collect';
const collectedApi = baseUrl + 'collected';
const searchApi = baseUrl + 'movies/search';
const filterApi = baseUrl + 'movies/filter';
const movieApi = baseUrl + 'movies/movie';

const http = (url, data, method) => {
  wx.showLoading({
    title: '加载中...'
  });
  return new Promise((resolve, reject) => {
    wx.request({
      url,
      data,
      header: {
        'Authorization': `Bearer ${wx.getStorageSync('token')}`
      },
      method,
      success(response) {
        switch (response.statusCode) {
          case 401:
            wx.showToast({
              title: response.data.message,
              icon: 'none',
              duration: 1000
            });
            wx.clearStorageSync();
            setTimeout(() => {
              wx.navigateTo({
                url: '/pages/index/index'
              });
            }, 1000);
            break;
          case 403:
            console.log('您没有该操作权限');
            break;
          case 500:
            console.log('服务器错误');
            break;
          default:
            resolve(response);
        }
      },
      fail(error) {
        wx.showToast({
          title: '网络故障...',
          icon: 'none',
          duration: 1000
        });
        reject(error);
      },
      complete() {
        wx.hideLoading();
      }
    });
  });
};

const login = (phone, passwd) => {
  return http(loginApi, {
    phone,
    passwd
  }, 'POST');
};

const wechatSignin = (code) => {
  return http(wechatSigninApi, {
    code
  }, 'POST');
};

const getUserinfo = () => {
  return http(userinfoApi, {}, 'GET');
};

const getArticles = () => {
  return http(articlesApi, {}, 'GET');
};

const getArticleDetail = (articleId) => {
  return http(articlesApi + '/' + articleId, {}, 'GET');
};

const checkCollected = (articleId) => {
  return http(collectedApi, {
    articleId
  }, 'GET');
};

const collectArticle = (articleId) => {
  return http(collectApi, {
    articleId
  }, 'POST');
};

const cancelCollection = (id) => {
  return http(collectApi + '/' + id, {}, 'DELETE');
};

const searchMovies = (keywords) => {
  return http(searchApi, {
    keywords
  }, 'GET');
};

const filterMovies = (start, count, type) => {
  type = type ? type : null;
  return http(filterApi, {
    start,
    count,
    type
  }, 'GET');
};

const getMovieDetail = (id) => {
  return http(movieApi, {
    id
  }, 'GET');
};

module.exports = {
  baseUrl,
  login,
  wechatSignin,
  getUserinfo,
  getArticles,
  getArticleDetail,
  checkCollected,
  collectArticle,
  cancelCollection,
  searchMovies,
  filterMovies,
  getMovieDetail
};