combineReducers接受一个对象作为参数，这个对象的key是model的名字，值是reducer（action处理函数）

```javascript
function combineReducers(reducers){
    //... 省略部分代码
    return combination(state, action) {
        
    }
}
```

### combinReducers的作用：

过滤reducers，reducer必须是function，

combineReducers返回一个函数combination

这个combination函数接受旧的state和action作为参数，返回新的state

```JavaScript
const newstate = combination(state, action);
```



```javascript
//  接受一个对象作为参数，这个对象的key是model的名字，值是reducer（action处理函数）
function combineReducers(reducers) {
  var reducerKeys = Object.keys(reducers);
  var finalReducers = {};

  // 过滤出合法的reducer, reducer必须是function
  for (var i = 0; i < reducerKeys.length; i++) {
    var key = reducerKeys[i];

    if (process.env.NODE_ENV !== 'production') {
      if (typeof reducers[key] === 'undefined') {
        warning("No reducer provided for key \"" + key + "\"");
      }
    }
    // 把值是函数的属性筛选出来
    if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key];
    }
  }


  // 最终合法的state名称（model） key 组成的数组
  var finalReducerKeys = Object.keys(finalReducers);
  // This is used to make sure we don't warn about the same
  // keys multiple times.

  var unexpectedKeyCache;

  if (process.env.NODE_ENV !== 'production') {
    unexpectedKeyCache = {};
  }

  var shapeAssertionError;

  try {
    assertReducerShape(finalReducers);
  } catch (e) {
    shapeAssertionError = e;
  }
  // 真正的reducer函数， 接受state和action 返回一个state
  // 在程序运行时，这个state实际上就是那个currentState
  //
  return function combination(state, action) {
    // 防止没有初始状态，设state为空对象。
    if (state === void 0) {
      state = {};
    }

    if (shapeAssertionError) {
      throw shapeAssertionError;
    }

    if (process.env.NODE_ENV !== 'production') {
      var warningMessage = getUnexpectedStateShapeWarningMessage(state, finalReducers, action, unexpectedKeyCache);

      if (warningMessage) {
        warning(warningMessage);
      }
    }
    // Flag标志位  用于判断state是否改变
    var hasChanged = false;
    var nextState = {};
    // 当发起一个action的时候， redux会遍历每一个reducer，意味着每个reducer都要执行一次，
    // 所以 reducer中 switch语句中的case值可以出现相同的情况。就是两个reducer可以有一样名字的case
    //  还有就是在编写reducer时，一定要给state设置默认值，不然会报错。
    for (var _i = 0; _i < finalReducerKeys.length; _i++) {
      // key值
      var _key = finalReducerKeys[_i];
      // key对应的reducer
      var reducer = finalReducers[_key];
      // 处理之前key对应的state'
      var previousStateForKey = state[_key];
      // 处理之后key对应的state
      var nextStateForKey = reducer(previousStateForKey, action);

      if (typeof nextStateForKey === 'undefined') {
        var errorMessage = getUndefinedStateErrorMessage(_key, action);
        throw new Error(errorMessage);
      }

      nextState[_key] = nextStateForKey;
      //  判断状态是否变化由Flag或者 前后两次的state是否相等判断
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }

    hasChanged = hasChanged || finalReducerKeys.length !== Object.keys(state).length;
    // 返回新的state，由返回的state和原来的state是不同的两个对象
    return hasChanged ? nextState : state;
  };
}
```

