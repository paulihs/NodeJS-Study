##### CommonJS && ES6 Module的异同
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
> 区别在于 CommonJS1 只能通过 exports.XX = XX 的方式导出，
> CommonJS2 在 CommonJS1 的基础上加入了 module.exports = XX 的导出方式。 CommonJS 通常指 CommonJS2。
>
> 在CommonJS模块中，exports和module.exports的关系相当于
>
> ````javascript
> let exports = module.exports = {};
> ````
>
> 而当其他模块依赖该模块的时候，得到的是module.exports。所以不要在一个模块中同时使用这两个。

ES6 的Module特性让JS真正具备了模块的概念。而其实现和commonJS大有不同。先来看看

### 相同点：

1. 模块加载都是同步的。

   意思是在加载模块时，JS是阻塞的，必须等模块加载完成才能执行下面的内容。

2. 模块只执行一次。

   模块只会在首次加载的时候执行，当模块再次被导入时，会返回上次执行的结果。

### 不同点

##### 动态与静态

commonJS模块加载是动态的，而ES6模块的加载是静态的。什么意思？就是说commonJS导入一个模块，必须要等到执行的时候才能确定模块的导入路径。它的模块路径是动态的。`require()`可以接受表达式或者条件句（被条件句包裹）。其导出模块也是模块代码执行阶段确定的。
ES6模块的导入时静态的。在代码编译阶段就能确定导入那些内容。ES6模块导入导出是声明式的。import不支持表达式，也不支持条件句。ES6的导入导出必须是在模块的最顶层。且import语句具有提升效果，可以在import语句的前面使用import的变量，但是最好不要这么干，把import语句放在文件的顶部。require没有提升的效果，而import是会提升到页面的顶部的。

##### 值的拷贝和值的引用

commonJS模块导出的是模块输出的值的一个拷贝。就是说一旦输出一个值，模块内部再变化也不会影响到这个值。注意：如果之后再去导入这个模块，其实是直接引入存在内存中的值。而不会再去执行这个模块。如果去修改、增加导入模块的某个属性，其实是修改的内存中的那个值，修改之后的值在其他地方也可以获取到。

```javascript
// lib.js
var counter = 3;
function incCounter() {
  counter++;
}
module.exports = {
  counter: counter,
  incCounter: incCounter,
};

// main.js
var mod = require('./lib');

console.log(mod.counter);  // 3
mod.incCounter();
console.log(mod.counter); // 3

说明输出的是值的拷贝
```



ES6模块输出的是值的引用。当JS引擎对脚本静态分析遇到import命令时，会生成一个只读引用。等到脚本执行的时候，在根据这个只读的引用到被加载的模块中取值。如果模块中引用对应的值变了，那么import加载的值也会跟着变。所以要理解`export let a = 12`  输出的是引用的含义。

体会两种写法的区别：

````javascript
let a = 12;
export a; // error 报错 因为这种写法输出的是一个值，而不是一个引用

// 体会和下面这种写法的区别
export let b = 12
````

注意：ES6模块输出的引用是只读的，不可以对这些引用重新赋值。但是可以为本来是属性的值添加属性。



