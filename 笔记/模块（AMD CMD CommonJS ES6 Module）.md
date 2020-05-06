##### 模块（CommonJS && ES6 Module）
CommonJS 是一种javascript模块化规范，核心思想是通过require方法同步加载其他模块，，并将其存储于内存中，通过module.exports导出需要暴露的接口。nodejs就是采用了CommonJS规范的一种实现。

```javascript
const a = require('./b.js');
module.exports = a;
```
CommonJS 的优点在于：

代码可复用于 Node.js 环境下并运行，例如做同构应用；
通过 NPM 发布的很多第三方模块都采用了 CommonJS 规范。
CommonJS 的缺点在于这样的代码无法直接运行在浏览器环境下，必须通过工具转换成标准的 ES5。
> CommonJS 还可以细分为 CommonJS1 和 CommonJS2，
>区别在于 CommonJS1 只能通过 exports.XX = XX 的方式导出，
>CommonJS2 在 CommonJS1 的基础上加入了 module.exports = XX 的导出方式。 CommonJS 通常指 CommonJS2。

require没有提升的效果，而import是会提升到页面的顶部的。
