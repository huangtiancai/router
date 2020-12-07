console.log(window.location)  // Location 对象（包含location所有属性和方法）

// http://127.0.0.1:8088/index2.html#/home
// url => protocol + host + port + path + query + fragment
// url => 协议 + 主机名/域名/ip地址 + 端口 + 路径 + 参数 + 锚点
console.log('href: ' + location.href)           // http://127.0.0.1:8088/index2.html#/home
console.log('origin: ' + location.origin)       // http://127.0.0.1:8088
console.log('protocol: ' + location.protocol)   // http
console.log('hostname: ' + location.hostname)   // 127.0.0.1
console.log('host: ' + location.host)           // 127.0.0.1:8088
console.log('端口： ' + location.port)          // 8088
console.log('pathname: ' + location.pathname)  // /index2.html
console.log('hash: ' + location.hash)          // #/home
console.log('search:' + location.search)       // ''

// 修改浏览器位置方法
// location.href
// location.hash
// location.search


console.log(window.history)  // history 对象