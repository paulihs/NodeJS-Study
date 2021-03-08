### 从Redux中间件实现原理入手，理解“面向切面编程”

#### 认识Redux中间件

分析实现原理之前先来认识一下中间件的用法。

#### 引入中间件

在将createStore函数的时候，已经简单地提过中间件——**中间件相关的信息将作为 createStore 函数的一个 function 类型的入参被传入**。这里我们简单复习一下 createStore 的调用规则，示例代码如下：

```JavaScript
// 引入 redux

import { createStore, applyMiddleware } from 'redux'

......

// 创建 store

const store = createStore(

    reducer,

    initial_state,

    applyMiddleware(middleware1, middleware2, ...)

);

```

可以看到，Redux对外暴露了applyMiddleware这个方法，这个applyMiddleware接受任意个中间件作为入参，它的返回值是一个函数，作为参数传入createStore，而这个参数在createStore中的作用类似于装饰器，以上面代码为例：

```JavaScript
const store = createStore(

    reducer,

    initial_state,

    applyMiddleware(middleware1, middleware2, ...)

);
    // 等同于下面
const store = applyMiddleware(middleware1, middleware2, ...)(createStore)(reducer,initial_state)
```



#### 中间件的工作模式

中间件的引入，给Redux工作流带来了哪些不同呢？

这里以redux-thunk为例，从经典的异步Action 场景切入，来看看中间件是如何帮我们解决问题的。



##### redux-thunk——经典的异步Action解决方案

在阅读Redux源码的过程中，我们不难发现**Redux源码中只有同步操作**，就是说 当我们dispatch action时，state会被立即更新。

那么如果想要在Redux中引入异步数据流，该怎么办呢？Redux官方给出的建议是使用中间件来增强createStore。异步数据流的Redux中间件有很多，其中最适合用来快速上手的就是redux-thunk。

redux-thunk的引入和其他普通的中间件没有区别：

```JavaScript
// 引入 redux-thunk

import thunkMiddleware from 'redux-thunk'

import reducer from './reducers'

// 将中间件用 applyMiddleware 包装后传入

const store = createStore(reducer, applyMiddleware(thunkMiddleware))

```

这里要注意当createStore的第二个参数是函数且没有第三个参数的时候，就把第二个参数当做是enhancer，preloadedState=undefined。

这个enhancer是‘增强器’的意思，而经过applyMiddleware包装过得中间件就是增强器的一种。

redux-thunk带来的变化非常好理解，就是**它允许我们以函数的形式来派发一个action，换句话说，就是dispatch可以接受一个函数了**。在此之前，dispatch只能接受Object形式的action。



```JavaScript
function createThunkMiddleware(extraArgument) {
  return ({ dispatch, getState }) => next => action => {
    if (typeof action === 'function') {
      return action(dispatch, getState, extraArgument);
    }

    return next(action);
  };
}

const thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;

export default thunk;
```



thunk是个高阶函数，事实上，按照约定，所有的Redux中间件都必须是高阶函数。在高阶函数中，我们习惯于把原函数称为“外层函数”，把return出来的函数称为“内层函数”。



### applyMiddleware

这个applyMiddleware函数的作用是什么呢？

applyMiddleware 的参数会被放入一个叫做middlewares的数组中，而其函数体只是返回两层嵌套的函数。

其主要目的是修饰dispatch方法，在原本的dispatch方法后面再添加一些逻辑。

```JavaScript
// 这个函数的参数是执行完dispatch之后，额外执行的函数
function applyMiddleware() {
  // 将参数放入middleware中
  for (var _len = arguments.length, middlewares = new Array(_len), _key = 0; _key < _len; _key++) {

    middlewares[_key] = arguments[_key];
  }

  // 返回的函数就是enhancer，所以接受createStore作为参数。与createStore内容相呼应
  return function (createStore) {
    //  下面这个函数相当于 enhancer( createStore ) 返回的那个函数,他接受reducer和preloadState
    return function (reducer, preloadedState) {
      var store = createStore(reducer, preloadedState);

      var _dispatch = function dispatch() {
        throw new Error('Dispatching while constructing your middleware is not allowed. ' + 'Other middleware would not be applied to this dispatch.');
      };

      // 封装一下 getState和dispatch
      var middlewareAPI = {
        getState: store.getState,
        dispatch: (...args) => dispatch(...args)
      };
      // chain是一个数组，是一个将middlewareAPI 传给中间件之后的返回值的数组。
      var chain = middlewares.map(function (middleware) {
        return middleware(middlewareAPI);
      });
      _dispatch = compose(...chain)(store.dispatch);

      // _objectSpread ： 对象展开符，合并对象，相当于Object.assign。

      //  所以结果enhancer处理的createStore和没有enhancer的区别就是返回的store中的dispatch不一样
      // 有enhancer处理过得store的dispatch方法，会在执行完基本的dispatch之后在额外执行 applyMiddleware传入的中间件函数
      return _objectSpread(_objectSpread({}, store), {}, {dispatch: _dispatch});
    };
  };
}

```

当我们在使用mapDispatchToProps的时候，如果我们传入的是一个对象，那么



