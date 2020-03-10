
## 事件循环是JavaScript异步编程的核心思想，它揭露了JavaScript处理异步事件的机制。
那么为什么要有事件循环这个机制呢？因为我们需要异步操作，试想下如果所有操作都是同步的，一旦出现一个操作的时间过长，那么程序就会阻塞，在浏览器上就表现为页面卡死。为了保证流畅的交互体验，我们的程序中充满着异步操作：异步请求，各种交互事件，定时器等等。
### 在介绍事件循环之前，先介绍一下一个浏览器进程有几个线程

一个浏览器进程通常由以下五个线程组成：
1. GUI渲染线程。
2. JavaScript引擎线程。
3. 事件触发线程。
4. 定时器线程。
5. 异步HTTP请求线程。

### GUI 渲染线程
GUI渲染线程负责渲染浏览器界面HTML元素,当界面需要重绘(`Repaint`)或由于某种操作引发回流(`reflow`)时,该线程就会执行。在JavaScript引擎运行脚本期间,GUI渲染线程都是处于挂起状态的,也就是说被”冻结”了。
### JavaScript引擎线程
JavaScript引擎，也可以称为JS内核，主要负责处理JavaScript脚本程序，例如V8引擎。JavaScript引擎线程负责解析JavaScript脚本，运行代码。
### 事件触发线程
当一个事件被触发时该线程会把事件添加到待处理事件队列的队尾，等待JS引擎的处理。这些事件可以是当前执行的代码块如定时任务、也可来自浏览器内核的其他线程如鼠标点击、AJAX异步请求等，但由于JS的单线程关系所有这些事件都得排队等待JS引擎处理。


### 定时器线程
浏览器定时计数器并不是由JavaScript引擎计数的, 因为JavaScript引擎是单线程的,如果处于阻塞线程状态就会影响记计时的准确, 因此通过单独线程来计时并触发定时是更为合理的方案。
### 异步HTTP请求线程
在`XMLHttpRequest`在连接后通过浏览器新开一个线程请求，在检测到状态变更时，会触发相应的事件，如果设置有回调函数，异步线程就产生状态变更事件，将事件处理程序放到 JavaScript引擎的处理队列中等待处理。

**那么什么是任务队列呢？先看下面这张图**


![事件循环](https://user-gold-cdn.xitu.io/2019/12/3/16ec974b740d678d?w=949&h=631&f=png&s=179414)

### 任务队列
大家都知道JS是单线程的，假如在JS引擎执行代码的过程中触发了一些事件，那引擎会停下手中的事情来处理这些事件吗？当然不可能。那什么时候才能执行这些事件处理程序呢？在js引擎空闲的时候。实际上，无论是事件触发还是定时器还是HTTP请求，在各自的线程处理好对应的API之后，会把各自的事件处理程序放到一个叫做任务队列的数据结构中。在JS引擎空闲的时候会按顺序去执行每一个事件处理程序。按怎样的顺序？先进队列的先执行。这叫先进先出，和栈结构的后进先出正好相反。
### 事件循环
当JS引擎执行完代码之后，如果任务队列中有待处理的事件处理程序，那么JS引擎回去立即执行这些程序，那么假如现在任务队列是空的，但是过了一会有事件触发了，JS引擎是如何知道的呢？这就要讲到事件循环了。当JS引擎空闲的时候，他会不断的是轮询任务队列，如果有任务的话就去执行。
### 微任务
微任务包括`promise`的回调（`Promise.prototype.then`），`mutationObserver`的回调，以及nodeJS的`process.nextTick`的回调。
### 宏任务
`script`全部代码。`setTimeout`，`setInterval`，`setImmediate`，`I/O`，`UI Rendering`，异步请求的回调。
JS引擎初始执行代码如果遇到微任务，会将微任务放到微任务队列中，如果有宏任务，则将其放入宏任务队列。执行完代码后，会先去执行微任务队列中的事件，然后就是不断的轮询任务队列。
我们可以把初始代码当成一个宏任务，在执行完这个宏任务之后，JS引擎会去处理本轮宏任务结束时的微任务队列，然后再去处理宏任务队列。所以执行微任务的时机就是在宏任务与宏任务之间。
### 下面来做道题
```javascript
setTimeout(() => {
  console.log('A');
}, 0);
var obj = {
  func: function() {
    setTimeout(function() {
      console.log('B');
    }, 0);
    return new Promise(function(resolve) {
      console.log('C');
      resolve();
    });
  },
};
obj.func().then(function() {
  console.log('D');
});
console.log('E');
```
1. 首先在宏任务队列添加任务打印A。
2. 声明对象obj，然后执行对象方法func，在func中先往宏任务队列中添加任务打印B，然后创建`Promise`对象，同步执行打印C，将新创建的`Promise`对象的状态变为`resolved`。
3. 再为`Promise`实例对象添加回调，即创建微任务打印D。
4. 同步任务打印E。

### 如果我们用一个表格来记录上面代码的执行过程我们可以得到如下结果：
| 同步任务（主线程） | 微任务 | 宏任务 |
|--------------------|--------|--------|
| C                  | D      | A      |
| E                  |        | B      |
所以根据上面我们了解的事件循环的执行机制，我们很容易的到上面代码的执行结果为：C E D A B。



### 更新视图
浏览器更新视图的时机是由其自己决定的，并不是宏任务与宏任务之间一定有视图的更新。可以确定的是，在JS引擎执行代码时，是不会更新视图的，因为GUI 渲染线程与JavaScript引擎线程互斥！浏览器会在适当的时机（宏任务与宏任务之间）更新视图，然后再继续执行代码。
### GUI 渲染线程 与 JavaScript引擎线程互斥！
由于JavaScript是可操纵DOM的，如果在修改这些元素属性的同时渲染界面（即JavaScript线程和UI线程同时运行），那么渲染线程前后获得的元素数据就可能不一致了。因此为了防止渲染出现不可预期的结果，浏览器设置GUI渲染线程与JavaScript引擎为互斥的关系，当JavaScript引擎执行时GUI线程会被挂起，GUI更新会被保存在一个队列中等到引擎线程空闲时立即被执行。

```html
    <div id="lele" style='background: green;width: 200px; height: 200px'>color</div>
```
```javascript
    setTimeout(()=>{
        alert(`第一个宏任务`)
    }, 0);
    document.getElementById('lele').style.background = 'red';
    document.getElementById('lele').style.color = 'yellow';
    alert(`after set red`);
    setTimeout(()=>{
        alert(`第二个宏任务！`)
    }, 0);
    new Promise((resolve)=>{
        console.log(12);
        resolve(`david`);
    }).then((res)=>{
        alert(res);
        console.log(res);
    });
    console.log(`go menana`)
```


![1](https://user-gold-cdn.xitu.io/2019/12/3/16eca63fd098a1fb?w=1360&h=376&f=png&s=7841)

1.  添加第一个宏任务：`alert（`第一个宏任务`）`。
2. `DOM`操作，设置`div`背景为红色，字体颜色为黄色。
3.  同步任务：`alert(after set red)`

![2](https://user-gold-cdn.xitu.io/2019/12/3/16eca6905f985edf?w=1373&h=308&f=png&s=7536)

4.  添加第二个宏任务`alert(第二个宏任务)`。
5.  创建新的Promise对象，同步打印12，设置Promise对象的状态为resolved，添加微任务`alert(res);console.log(res)`
6.  执行同步任务`console.log('go menana')`。

![3](https://user-gold-cdn.xitu.io/2019/12/3/16eca6e129a39a6e?w=1407&h=428&f=png&s=10271)

7.  页面渲染（DOM操作结果），执行第一个宏任务。

![4](https://user-gold-cdn.xitu.io/2019/12/3/16eca6fda1ee7af0?w=1409&h=332&f=png&s=9240)
8.  执行第二个宏任务。


用这个例子说明UI rendering的执行时机：**在宏任务与宏任务之间！**

### 当事件循环遇到async/await

```javascript
async function foo() {
  // await 前面的代码
  await bar();
  // await 后面的代码
}

async function bar() {
  // do something...
}

foo();
```

await前面的代码是同步执行的，而`await bar()`以及后面的代码可以转化为
```javascript
Promise.resolve(bar()).then(()=>{ 
// await后面的代码
}); 
```
对于`Promise.resolve`不清楚的可以去[这里](https://es6.ruanyifeng.com/#docs/promise#Promise-resolve)看看。
### 再来看看下面这道题
```javascript
async function async1() {
  console.log('async1 start');
  await async2();
  console.log('async1 end');
}
async function async2() {
  console.log('async2');
}
console.log('script start');
setTimeout(function() {
  console.log('setTimeout');
}, 0);
async1();
new Promise(function(resolve) {
  console.log('promise1');
  resolve();
}).then(function() {
  console.log('promise2');
});
console.log('script end');
```
我们先来梳理一下这段代码的执行顺序：
```javascript
//同步执行 
console.log('script start');
// 添加宏任务
setTimeout(function() {
  console.log('setTimeout');
}, 0);
// 执行async函数  async1()
  console.log('async1 start');
// 同步执行async2(), 并添加微任务 
  Promise.resolve(async2()).then(()=>{ 
  console.log('async1 end');
})

//  创建Promise并添加回调（微任务）
  console.log('promise1');
// 同步执行
console.log('script end');

```
那么这段代码的执行结果就显而易见了：
1. script start
2. async1 start
3. async2
4. promise1
5. script end
6. async1 end
7. promise2
8. setTimeout


这里要注意的一个地方就是：
```javascript
  Promise.resolve(async2()).then(()=>{ 
  console.log('async1 end');
});
```
由于`async2()`里面只包含一行同步代码，那么他的返回值是一个状态为`resolved`的`Promise`对象,所以他后面的`then`方法能立即执行（添加到微任务队列）,
这就是我们需要注意的点：**`then`方法微任务添加的时机是前面`Promise`对象的状态已经变成`resolved`或者`rejected`**。


**补充：**
#### 调用栈（call stack）

>代码在运行过程中，会有一个叫做调用栈(call stack)的概念。调用栈是一种栈结构,它用来存储计算机程序执行时其活跃子程序的信息。（比如什么函数正在执行，什么函数正在被这个函数调用等等信息）。调用栈是JS引擎执行程序的一种机制。

程序每调用一层函数（方法），引擎就会生成它的栈帧，栈帧里面保存了函数的执行上下文，然后将它压入调用栈。栈是一个后进先出的结构，直到最里层的函数执行完，引擎才开始将最后加入的栈帧从栈中弹出。

函数调用会在内存形成一个“调用记录”，又称“调用帧”（call frame），保存调用位置和内部变量等信息。如果在函数A的内部调用函数B，那么在A的调用帧上方，还会形成一个B的调用帧。等到B运行结束，将结果返回到A，B的调用帧才会消失。如果函数B内部还调用函数C，那就还有一个C的调用帧，以此类推。所有的调用帧，就形成一个“调用栈”（call stack）

举个例子：
```javascript
const str = '开始';

console.log('1');

function a() {
    
    let c = b();
    console.log(c);
}

function b() {
    return 123;
}

a();

```
下面详细解释一下这段代码的执行：
1. 先调用`console.log("1")`;形成一个栈帧，然后弹出。
2. 再执行a();再形成一个栈帧，保存a的执行上下文，压入栈。
3. 之后调用b();生成一个b的栈帧，b执行完，弹出b的栈帧回到a的栈帧完成赋值操作，继续执行console.log(c);a执行结束，弹出a的栈帧。

要点
- 每调用一个函数都会生成它的栈帧（调用帧），栈帧里面保存了函数的执行上下文，然后引擎将这个栈帧压入栈。
- 栈是一个后进先出的结构，直到最里层的函数调用完，就会把这个函数生成的栈帧从栈中弹出。
- 同时也要注意，诸如`const str = 'biu'`的**变量声明**是不会入栈的。**调用栈也要占用内存**，所以如果调用栈过深，浏览器会报*Uncaught RangeError: Maximum call stack size exceeded*错误。
 

通过[尾调用优化](http://es6.ruanyifeng.com/#docs/function#%E5%B0%BE%E8%B0%83%E7%94%A8%E4%BC%98%E5%8C%96)可以节省内存

