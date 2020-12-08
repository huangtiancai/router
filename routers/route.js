var util = {
  // 生成不同的 key
  genKey() {
    var t = 'xxxxxxxx'
    return t.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0
      var v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  },
  // 闭包返回函数
  closure(name) {
    function fun(currentHash) {
      window.name && window[name](currentHash)
    }
    return fun;
  },
  getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
  },
  getParamsUrl() {
    // location.hash(路由处理函数中设置)
    console.log(location.hash) // #/home

    var hashDeatail = location.hash.split("?"),
      hashName = hashDeatail[0].split("#")[1], //路由地址
      params = hashDeatail[1] ? hashDeatail[1].split("&") : [], //参数内容
      query = {};
    for (var i = 0; i < params.length; i++) {
      var item = params[i].split("=");
      query[item[0]] = item[1]
    }
    return {
      path: hashName,
      query: query,
      params: params
    }
  },
  hasClass: function (elem, cls) {
    cls = cls || '';
    if (cls.replace(/\s/g, '').length == 0) return false; //当cls没有参数时，返回false
    return new RegExp(' ' + cls + ' ').test(' ' + elem.className + ' ');
  },
  addClass: function (ele, cls) {
    if (!util.hasClass(ele, cls)) {
      ele.className = ele.className == '' ? cls : ele.className + ' ' + cls;
    }
  },
  removeClass(elem, cls) {
    if (util.hasClass(elem, cls)) {
      var newClass = ' ' + elem.className.replace(/[\t\r\n]/g, '') + ' ';
      while (newClass.indexOf(' ' + cls + ' ') >= 0) {
        newClass = newClass.replace(' ' + cls + ' ', ' ');
      }
      elem.className = newClass.replace(/^\s+|\s+$/g, '');
    }
  }
}

// 构造函数 Router
function Router() {
  this.routerMap = []                 // 路由遍历
  this.redirectRoute = null           // 路由重定向的 hash
  this.routes = {}                    // 保存注册的所有路由
  this.beforeFun = null               // 切换前
  this.afterFun = null                // 切换后
  this.routerViewId = "#routerView"   // 路由挂载点 
  this.stackPages = true              // 多级页面缓存
  this.historyFlag = ''               // 路由状态，前进，回退，刷新
  this.history = []                   // 路由历史
  this.animationName = "slide"        // 页面切换时的动画
}


// 初始化路由
// router.init(config)   // 调用原型上的方法，传入配置参数

// 实现路由功能
Router.prototype = {
  init: function (config) {
    console.log('init')

    // console.log(config)  // 传入的配置参数
    var self = this

    this.routerMap = config ? config.routes : this.routerMap
    this.routerViewId = config ? config.routerViewId : this.routerViewId
    this.stackPages = config ? config.stackPages : this.stackPages

    // 获取视图上动画名
    var name = document.querySelector('#routerView').getAttribute('data-animationName') // fade
    if (name) {
      this.animationName = name
    }
    // 配置文件存在 animationName 则定义 animationName 为配置文件的animationName
    this.animationName = config ? config.animationName : this.animationName // fade

    if (!this.routerMap.length) {
      var selector = this.routerViewId + " .page"
      // console.log(selector) // routerView.page
      var pages = document.querySelectorAll(selector)
      // console.log(pages)
      for (var i = 0; i < pages.length; i++) {
        var page = pages[i]
        var hash = page.getAttribute('data-hash')
        var name = hash.substr(1)
        var item = {
          path: hash,
          name: name,
          callback: util.closure(name)  // closure ???
        }
        this.routerMap.push(item)
      }
      // console.log(JSON.stringify(this.routerMap)) // [{"path":"/home","name":"home"},{"path":"/list","name":"list"}]
    }

    // 注册路由
    this.map()

    // 初始化跳转方法
    window.linkTo = function (path) {
      console.log('linkTo')
      if (path.indexOf('?') !== -1) {
        window.location.hash = path + '&path' + util.genKey()
      } else {
        window.location.hash = path + '?path' + util.genKey()
      }
    }

    // 页面首次加载，匹配路由
    window.addEventListener('load', function (e) {
      console.log('加载', e)
      self.historyChange(e)
    }, false)

    // 路由切换
    window.addEventListener('hashchange', function (e) {
      // 注意分析 e
      console.log('The hash has changed!')
      console.log(Object.prototype.toString.call(e)) // [object HashChangeEvent]
      console.log(e)
      // e 对象两个参数
      // oldURL: "http://127.0.0.1:8088/routers/index.html",
      // newURL: "http://127.0.0.1:8088/routers/index.html#/home"

      self.historyChange(e)

    }, false)
  },
  // 路由历史纪录变化
  historyChange: function (e) {
    console.log('historyChange')
    // 获得当前需要跳转的hash
    var currentHash = util.getParamsUrl()
    console.log(currentHash)  // Object { path: undefined, query: {}, params: [] }

    // 核心代码
    var nameStr = "router-" + (this.routerViewId) + '-history'  // router-#routerView-history
    console.log(this.history) // []
    console.log(window.sessionStorage[nameStr])  // undefined

    this.history = window.sessionStorage[nameStr] ? JSON.parse(window.sessionStorage[nameStr]) : []
    console.log(this.history) // Array []

    var
      back = false,
      refresh = false,
      forward = false,
      index = 0,
      len = this.history.length


    for (var i = 0; i < len; i++) {
      var h = this.history[i]
      // url 存在于浏览记录中
      if (h.hash === currentHash.path && h.key === currentHash.query.key) {
        index = i
        if (i === len - 1) {
          // url 在浏览记录的末端即为刷新
          refresh = true
        } else {
          // url 存在于浏览记录中即为后退
          back = true
        }
        break
      } else {
        // url 不存在于浏览记录中即为前进
        forward = true
      }
    }
    // 路由数组操作
    if (back) {
      this.historyFlag = 'back'
      this.history.length = index + 1
    } else if (refresh) {
      this.historyFlag = 'refresh'
    } else {
      this.historyFlag = 'forward'
      var item = {
        key: currentHash.query.key,
        hash: currentHash.path,
        query: currentHash.query
      }
      this.history.push(item)
    }
    // ?
    if (!this.stackPages) {
      this.historyFlag = 'forward'
    }

    window.sessionStorage[nameStr] = JSON.stringify(this.history)
    console.log(window.sessionStorage[nameStr])  // [{"query":{}}]
    this.urlChange()
  },
  changeView: function (currentHash) {
    console.log('changeView')

    var pages = document.getElementsByClassName('page')
    var previousPage = document.getElementsByClassName('current')[0]
    var currentPage = null
    var currHash = null
    for (var i = 0; i < pages.length; i++) {
      var page = pages[i];
      var hash = page.getAttribute('data-hash')
      page.setAttribute('class', "page")
      if (hash === currentHash.path) {
        currHash = hash
        currentPage = page
      }
    }
    var enterName = 'enter-' + this.animationName
    var leaveName = 'leave-' + this.animationName
    if (this.historyFlag === 'back') {
      util.addClass(currentPage, 'current')
      if (previousPage) {
        util.addClass(previousPage, leaveName)
      }
      setTimeout(function () {
        if (previousPage) {
          util.removeClass(previousPage, leaveName)
        }
      }, 250);
    } else if (this.historyFlag === 'forward' || this.historyFlag === 'refresh') {
      if (previousPage) {
        util.addClass(previousPage, "current")
      }
      util.addClass(currentPage, enterName)
      setTimeout(function () {
        if (previousPage) {
          util.removeClass(previousPage, "current")
        }
        util.removeClass(currentPage, enterName)
        util.addClass(currentPage, 'current')
      }, 350);
      // 前进和刷新都执行回调 与 初始滚动位置为 0
      currentPage.scrollTop = 0
      this.routes[currHash].callback ? this.routes[currHash].callback(currentHash) : null
    }
    this.afterFun ? this.afterFun(currentHash) : null
  },
  // 路由处理
  urlChange: function () {
    console.log('urlChange')

    var currentHash = util.getParamsUrl();
    console.log(currentHash)

    if (this.routes[currentHash.path]) {
      console.log('1111111111111111111111')
      var self = this;
      if (this.beforeFun) {
        this.beforeFun({
          to: {
            path: currentHash.path,
            query: currentHash.query
          },
          next: function () {
            self.changeView(currentHash)
          }
        })
      } else {
        this.changeView(currentHash)
      }
    } else {
      // 首次进入会重定向到 #/home 即 http://127.0.0.1:8088/routers/index.html => http://127.0.0.1:8088/routers/index.html#/home
      console.log('重定向')
      // 不存在的地址,重定向到默认页面  this.redirectRoute 设置好的重定向路由hash
      console.log(location.hash)          // ''
      // 设置当前路由为重定向的路由
      location.hash = this.redirectRoute
      console.log(location.hash)          // #/home
    }
  },
  // 路由注册
  map: function () {
    console.log('map')
    console.log(this.routerMap)
    console.log(this.routes) // Object {  }

    for (var i = 0; i < this.routerMap.length; i++) {
      var route = this.routerMap[i]

      // 路由数组遍历
      if (route == 'redirect') {
        // 当前路由等于 'redirect'则路由重定向的 hash = 当前路径
        this.redirectRoute = route.path
      } else {
        // 否则等于路由数组第一项
        this.redirectRoute = this.routerMap[0].path
      }
      console.log(this.redirectRoute) // /home

      // console.log(JSON.stringify(route)) // {"path":"/home","name":"home"}
      var newPath = route.path
      var path = newPath.replace(/\s*/g, "")  // 过滤空格
      console.log(path)                // /home

      this.routes[path] = {
        callback: route.callback
      }
    }
    console.log(this.routes)    // Object { "/home": {…}, "/list": {…}, "/detail": {…}, "/detail2": {…} }
  },
  //切换之前的钩子
  beforeEach: function (callback) {
    console.log('beforeEach')

    if (Object.prototype.toString.call(callback) === '[object Function]') {
      this.beforeFun = callback;
    } else {
      console.trace('路由切换前钩子函数不正确')
    }
  },
  //切换成功之后的钩子
  afterEach: function (callback) {
    console.log('afterEach')

    if (Object.prototype.toString.call(callback) === '[object Function]') {
      this.afterFun = callback;
    } else {
      console.trace('路由切换后回调函数不正确')
    }
  }

}
// 注册到 Router 到 window 全局
window.router = new Router()