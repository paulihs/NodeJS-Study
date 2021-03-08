> React-Router是React生态中的前端路由解决方案

在此，我们从React-router的实现机制入手，提取和探讨通用的前端路由解决方案。

先看一个例子：

```javascript
import React from "react";

// 引入 React-Router 中的相关组件
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

// 导出目标组件
const BasicExample = () => (
  // 组件最外层用 Router 包裹
  <Router>
    <div>
      <ul>
        <li>
          // 具体的标签用 Link 包裹
          <Link to="/">Home</Link>
        </li>
        <li>
          // 具体的标签用 Link 包裹
          <Link to="/about">About</Link>
        </li>
        <li>
          // 具体的标签用 Link 包裹
          <Link to="/dashboard">Dashboard</Link>
        </li>
      </ul>
      <hr />
      // Route 是用于声明路由映射到应用程序的组件层
      <Route exact path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/dashboard" component={Dashboard} />
    </div>
  </Router>
);

// Home 组件的定义

const Home = () => (
  <div>
    <h2>Home</h2>
  </div>
);

// About 组件的定义
const About = () => (
  <div>
    <h2>About</h2>
  </div>
);

// Dashboard 的定义

const Dashboard = () => (
  <div>
    <h2>Dashboard</h2>
  </div>
);

export default BasicExample;

```

例子的渲染效果图如下：

![](E:\NodeJS-Study\笔记\前端路由\demo1.png)



当我点击不同的链接时，ul 元素内部就会展示不同的组件内容。比如当我点击“About”链接时，就会展示 About 组件的内容，效果如下图所示：

![](E:\NodeJS-Study\笔记\前端路由\demo2.png)

注意，点击 About 后，界面中发生变化的地方有两处（见下图标红处），除了 ul 元素的内容改变了之外，路由信息也改变了。

![](E:\NodeJS-Study\笔记\前端路由\demo3.png)



在 React-Router 中，各种细碎的功能点有不少，但作为 React 框架的前端路由解决方案，它最基本也是最核心的能力，其实正是你刚刚所见到的这一幕——**路由的跳转**。这也是我们接下来讨论的重点。

接下来我们就结合 React-Router 的源码，一起来看看“跳转”这个动作是如何实现的。



##### React-Router如何实现路由跳转的？

首先需要回顾下 Demo 中的第一行代码：

```JavaScript
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

```

这行代码告诉我们，为了实现一个简单的路由跳转效果，一共从 React-Router 中引入了以下 3 个组件：

- BrowserRouter
- Route
- Link

#### 这 3 个组件也就代表了 React-Router 中的 3 个核心角色（路由三要素）：

- **路由器**，比如 BrowserRouter 和 HashRouter
- **路由**，比如 Route 和 Switch
- **导航**，比如 Link、NavLink、Redirect

##### 路由（以 Route 为代表）负责定义路径与组件之间的映射关系；

##### 导航（以 Link 为代表）负责触发路径的改变；

##### 路由器（包括 BrowserRouter 和 HashRouter）则会根据 Route 定义出来的映射关系，为新的路径匹配它对应的逻辑；



以上便是 3 个角色“打配合”的过程。这其中，最需要你注意的是**路由器**这个角色，React Router 曾在说明文档中官宣它是“React Router 应用程序的核心”。因此学习 React Router，最要紧的是搞明白路由器的工作机制。





### hash路由和history API

当页面hash值改变会触发hashchange事件，而页面不会刷新

```javascript
window.addEventListener('hashchange', function() {
  console.log('The hash has changed!')
}, false);
```

改变hash的方式有两种：

1. 通过设置<a>标签的href属性

```html
<a href="#home">go home</a>
```

2. 设置location对象的hash属性

```javascript
location.hash = '#home'
```

hash有几个特性：

1. URL中的hash值是客户端的一种状态，当客户端向服务端发送请求时，hash部分不会被发送
2. hash值改变会在浏览器的访问历史中增加一个记录，我们可以通过前进后退控制hash的切换
3. 可以通过hashchange监听hash值的变化

**注意**： [Firefox中使用location.hash会自动decodeURI Bug](https://www.cnblogs.com/snandy/archive/2013/06/04/3116664.html)

### history API
###### history.pushState(state,title, url)        history.replaceState(state, title, url)
```javascript
history.pushState({}, null,'/home')
```
history.pushState方法会创建一个新的历史记录，并将一个state和这个历史记录关联起来。
history.replaceState方法和pushState方法类似，但是他会替换当前的历史记录。
关于传入方法的三个参数：state title url

- state：与对应历史记录关联的数据，可以是字符串、数组、数字、对象等。
- title：这个属性有些浏览器不支持，所以一般出入null
- url：新的历史记录的url地址，必须与原来的url是同源的。

### popstate事件

popstate事件在页面的url变化时触发，比如改变页面的hash值，或者调用history的`go`方法、`back`方法、`forward`方法，又或者点击浏览器的前进后退按钮。但是注意：调用pushState和replaceState方法不会触发popstate事件。

路由的实现：

![路由原理](E:\NodeJS-Study\笔记\前端路由\路由原理.png)







react-router通过forceUpdate的方式重新执行组件的render方法，如果当前url能和window.location.pathname匹配上，就返回对应的component，否则就返回null。



> 关于forceUpdate：
>
> forceUpdate是组件实例的方法，在组件内部可以通过this.forceUpdate调用，调用forceUpdate方法致使组件调用render方法，此操作会跳过该组件的shouldComponentUpdate，单其子组件正常触发生命周期。



















[参考资料](https://www.jianshu.com/p/d2aa8fb951e4)