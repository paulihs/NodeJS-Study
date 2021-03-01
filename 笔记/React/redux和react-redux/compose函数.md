

### compose

```JavaScript
function compose() {
    // 把参数放入一个数组
  for (var _len = arguments.length, funcs = new Array(_len), _key = 0; _key < _len; _key++) {
    funcs[_key] = arguments[_key];
  }

  if (funcs.length === 0) {
    // infer the argument type so it is usable in inference down the line
    return function (arg) {
      return arg;
    };
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce(function (a, b) {
    return function () {
      return a(b.apply(void 0, arguments));
    };
  });
}
```

compose是用来处理函数的。
- compose是一个函数
- compose的参数都是函数
- compose的返回值是一个函数

##### compose的作用是什么呢？

假设现在有三个函数 a b c

那么compose(a, b, c)

```javascript
function a (sth){
    console.log(3*sth)
}
function b (sth){
    console.log(2*sth)
}
function c (sth){
    console.log(sth)
}
let lele = compose(a, b, c);
```

lele就相当于 function（sth）{

​	return a( b( c(sth) ) );

}



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
        dispatch: function dispatch(action) {
          for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
            args[_key2 - 1] = arguments[_key2];
          }

          return _dispatch.apply(void 0, [action].concat(args));
        }
      };
      // chain是一个数组，是一个将middlewareAPI 传给中间件之后的返回值的数组。
      var chain = middlewares.map(function (middleware) {
        return middleware(middlewareAPI);
      });
      _dispatch = compose.apply(void 0, chain)(store.dispatch);

      // _objectSpread ： 对象展开符，合并对象，相当于Object.assign。

      //  所以结果enhancer处理的createStore和没有enhancer的区别就是返回的store中的dispatch不一样
      // 有enhancer处理过得store的dispatch方法，会在执行完基本的dispatch之后在额外执行 applyMiddleware传入的中间件函数
      return _objectSpread(_objectSpread({}, store), {}, {dispatch: _dispatch});
    };
  };
}

```

