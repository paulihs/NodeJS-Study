https://zhuanlan.zhihu.com/p/24944905

![](E:\NodeJS-Study\笔记\浏览器渲染及执行机制\defer和async.jpg)

defer 的执行要等到浏览器解析到`</html>`之后才会执行。

而且在实际执行时，defer实现的推迟执行脚本不一定按照顺序执行。

需要注意：defer属性只对外部脚本文件有效。async也是只对外部脚本有效。