## 复习 BOM(browser Object Model - 浏览器对象模型)

BOM
  - window
  - navigator
  - screen
  - history
  - location
  - document
  - event

window对象的方法
  - alert()
  - prompt()
  - confirm()
  - open()
  - close()
  - onload
  - onunload

location  window.location => 可以获取或者设置浏览器地址栏的URL
  - href
  - origin
  - protocol
  - hostname
  - host
  - port
  - pathname
  - hash
  - search ？

  - replace() 重定向url
  - reload()  重新加载当前页面
  - assign()
  
history
  - back      回到历史记录的上一步 相当于 history.go(-1)
  - forward   回到历史记录的下一步 相当于 history.go(1)
  - go        回到历史记录的前n(n>0)步 history.go(-n);回到历史记录的后n(n>0)步 history.go(n)
  - pushState
  - replaceState


```js
window.location.href = './mobile/index.html';

getUrlParam(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]); return null;
}

window.location.href = "detail.html?" + "id=" + id + "&proid=" + (proid - 1)

// 关联修改url地址 动态修改 id
// 选择tab时动态的修改地址栏的内容  => 使用 history对象的方法  history.pushState 或者 history.replaceState
// window.history.pushState(null, null, "index.html?id=" + id)
window.history.replaceState(null, null, "index.html?id=" + id)
window.history.replaceState(null, null, "detail.html?id=" + id + "&proid=" + proid)
window.history.replaceState(null, null, "detail.html?type=" + this.type + "&id=" + this.id)



```