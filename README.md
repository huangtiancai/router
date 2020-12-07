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
  - hash      ***
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


## 路由实现：
### 实现原理
- History 路由
- Hash 路由

###  History 路由
```
history.length
history.length 只读属性
返回当前 session 中的 history 个数，包含当前页面在内。
举个例子，对于新开一个 tab 加载的页面当前属性返回值 1 

history.state
返回一个表示历史堆栈顶部的状态的值
这是一种可以不必等待 `popstate` 事件而查看状态而的方式。

popstate???
```

```javascript
history.back() = history.go(-1)
history.forward() = history.go(1)
```
```
1.当浏览器会话历史记录处于第一页时调用此方法没有效果，而且也不会报错
2.当浏览器历史栈处于最顶端时( 当前页面处于最后一页时 )调用此方法没有效果也不报错
3.调用没有参数的 go() 方法或者不是整数的参数时也没有效果
```

```javascript
history.pushState(state Object,title,url)
history.replaceState(state Object,title,url)
```
```
1.相同之处: 是两个 API 都会操作浏览器的历史记录，而不会引起页面的刷新。
2.不同之处在于: pushState 会增加一条新的历史记录，而 replaceState 则会替换当前的历史记录
```






```javascript
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