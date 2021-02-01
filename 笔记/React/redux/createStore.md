### createStore 源码

```javascript
function createStore(reducer, preloadedState, enhancer) {
  var _store;

  if (typeof preloadedState === 'function' && typeof enhancer === 'function' || typeof enhancer === 'function' && typeof arguments[3] === 'function') {
    throw new Error('It looks like you are passing several store enhancers to ' + 'createStore(). This is not supported. Instead, compose them ' + 'together to a single function.');
  }
 // 如果第二个参数是函数，而且没有第三个参数，就把第二个参数当做enhancer， 把初始状态设置为undefined
  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState;
    preloadedState = undefined;
  }

  // 存在enhancer的话，就返回enhancer(createStore)(reducer, preloadedState)
  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error('Expected the enhancer to be a function.');
    }

    return enhancer(createStore)(reducer, preloadedState);
  }

  // reducer不是函数就报错
  if (typeof reducer !== 'function') {
    throw new Error('Expected the reducer to be a function.');
  }

  // 闭包变量

  // 当前的reducer
  var currentReducer = reducer;
  // 当前状态
  var currentState = preloadedState;
  // 当前订阅的回调
  var currentListeners = [];
  // 下一轮的订阅的回调
  var nextListeners = currentListeners;
  //  自由变量
  // 是否是dispatch状态
  var isDispatching = false;

  /**
   * shallow 浅的，肤浅的。
   * This makes a shallow copy of currentListeners so we can use
   * nextListeners as a temporary list while dispatching.
   *
   * This prevents any bugs around consumers calling
   * subscribe/unsubscribe in the middle of a dispatch.
   */

  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice();
    }
  }

  /**
   * Reads the state tree managed by the store.
   *
   * @returns The current state tree of your application.
   */

  /**
   *  返回那个 currentState，最新的那个状态
   * @returns {undefined}
   */
  function getState() {
    if (isDispatching) {
      throw new Error('You may not call store.getState() while the reducer is executing. ' + 'The reducer has already received the state as an argument. ' + 'Pass it down from the top reducer instead of reading it from the store.');
    }

    return currentState;
  }


  /**
   *   添加新的订阅， 订阅就是在reducer处理完action之后，执行的回调函数队列
   * @param listener
   * @returns {unsubscribe}
   */
  function subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error('Expected the listener to be a function.');
    }

    if (isDispatching) {
      throw new Error('You may not call store.subscribe() while the reducer is executing. ' + 'If you would like to be notified after the store has been updated, subscribe from a ' + 'component and invoke store.getState() in the callback to access the latest state. ' + 'See https://redux.js.org/api/store#subscribelistener for more details.');
    }

    var isSubscribed = true;
    // 切断nextListener和currentListener的联系
    ensureCanMutateNextListeners();
    // 把新的订阅添加到下一次的订阅队列中
    nextListeners.push(listener);
    return function unsubscribe() {
      if (!isSubscribed) {
        return;
      }

      if (isDispatching) {
        throw new Error('You may not unsubscribe from a store listener while the reducer is executing. ' + 'See https://redux.js.org/api/store#subscribelistener for more details.');
      }

      isSubscribed = false;
      ensureCanMutateNextListeners();
      var index = nextListeners.indexOf(listener);
      nextListeners.splice(index, 1);
      currentListeners = null;
    };
  }


  /**
   *    先用当前reducer（为什么要说是当前的reducer，因为reducer是可以替换的）处理action，获得新的state
   *    依次执行listeners
   *    把action抛出去
   * @param action
   * @returns {*}
   */
  function dispatch(action) {
    // action必须是简单对象
    if (!isPlainObject(action)) {
      throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
    }
    //  action必须有type属性
    if (typeof action.type === 'undefined') {
      throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
    }
    //
    if (isDispatching) {
      throw new Error('Reducers may not dispatch actions.');
    }

    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
    } finally {
      isDispatching = false;
    }
    // 将下一次的订阅队列赋值给当前订阅队列
    var listeners = currentListeners = nextListeners;

    // 遍历队列，依次执行回调
    for (var i = 0; i < listeners.length; i++) {
      var listener = listeners[i];
      listener();
    }
    // 将action抛出
    return action;
  }

  /**
   * Replaces the reducer currently used by the store to calculate the state.
   *
   * You might need this if your app implements code splitting and you want to
   * load some of the reducers dynamically. You might also need this if you
   * implement a hot reloading mechanism for Redux.
   *
   * @param nextReducer The reducer for the store to use instead.
   * @returns The same store instance with a new reducer in place.
   */

  // 替换reducer， 将currentReducer替换为传入的值，再调用dispatch，使用新的reducer处理状态，同时再执行一下订阅队列
  function replaceReducer(nextReducer) {
    if (typeof nextReducer !== 'function') {
      throw new Error('Expected the nextReducer to be a function.');
    }
    // TODO: do this more elegantly
    currentReducer = nextReducer;
    // This action has a similar effect to ActionTypes.INIT.
    // Any reducers that existed in both the new and old rootReducer
    // will receive the previous state. This effectively populates
    // the new state tree with any relevant data from the old one.

    dispatch({
      type: ActionTypes.REPLACE
    }); // change the type of the store by casting it to the new store

    return store;
  }

  /**
   * Interoperability point for observable/reactive libraries.
   * @returns A minimal observable of state changes.
   * For more information, see the observable proposal:
   * https://github.com/tc39/proposal-observable
   */


  function observable() {
    var _ref;

    var outerSubscribe = subscribe;
    return _ref = {
      /**
       * The minimal observable subscription method.
       * @param observer Any object that can be used as an observer.
       * The observer object should have a `next` method.
       * @returns An object with an `unsubscribe` method that can
       * be used to unsubscribe the observable from the store, and prevent further
       * emission of values from the observable.
       */
      subscribe: function subscribe(observer) {
        if (typeof observer !== 'object' || observer === null) {
          throw new TypeError('Expected the observer to be an object.');
        }

        function observeState() {
          var observerAsObserver = observer;

          if (observerAsObserver.next) {
            observerAsObserver.next(getState());
          }
        }

        observeState();
        var unsubscribe = outerSubscribe(observeState);
        return {
          unsubscribe: unsubscribe
        };
      }
    }, _ref[$$observable] = function () {
      return this;
    }, _ref;
  }

  // When a store is created, an "INIT" action is dispatched so that every
  // reducer returns their initial state. This effectively populates
  // the initial state tree.
  // 初始化state，在reducer中不可能存在这样的type，所以返回每个model的默认值，初始化state
  dispatch({
    type: ActionTypes.INIT
  });
  var store = (_store = {
    dispatch: dispatch,
    subscribe: subscribe,
    getState: getState,
    replaceReducer: replaceReducer
  }, _store[$$observable] = observable, _store);

  // 上面这个表达式要分为两个部分一个部分是括号中的
  // 括号中的这个部分是从左到右执行的，先赋值一个对象在给这个对象添加属性，然后这个括号中返回的结果是 _store
  // 然后 将 _store 赋值给store
  return store;
}

```



createStore接受三个参数 reducer， preloadedState, enhancer,返回一个store对象，这个对象包含一些状态管理的重要方法。

```javascript
  var store = (_store = {
    dispatch: dispatch,
    subscribe: subscribe,
    getState: getState,
    replaceReducer: replaceReducer
  }, _store[$$observable] = observable, _store);
```

这三个参数分别说下：

reducer：用于处理action返回新state的函数；

preloadedState： 初始化的状态，在执行完`ActionTypes.INIT`这个action之后，state会被改为每个model的默认值；所以这个preloadedState是可以不填的，因为就算填了，在初始化完成之后，还是会被model的默认值替换掉。

enhancer：这个参数是个函数，从参数名的字面上翻译解释为‘放大器’，其用法类似于装饰器。

当传入了enhancer这个参数的时候，就直接返回`enhancer(createStore)(reducer, preloadedState)`

```JavaScript
  // 存在enhancer的话，就返回enhancer(createStore)(reducer, preloadedState)
  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error('Expected the enhancer to be a function.');
    }

    return enhancer(createStore)(reducer, preloadedState);
  }
```



说完了入参，再讲最重要的 “返回值” store对象。

首先看一下store对象是什么

```JavaScript
  var store = (_store = {
    dispatch: dispatch,
    subscribe: subscribe,
    getState: getState,
    replaceReducer: replaceReducer
  }, _store[$$observable] = observable, _store);
```

这段代码先是给_store赋值了一个对象，然后又给 _store 对象添加了一个‘$$observable’属性。最后将 _store赋值给store。所以最后得到的store应该是下面这个样子的。

```JavaScript
  var store = {
    dispatch: dispatch,
    subscribe: subscribe,
    getState: getState,
    replaceReducer: replaceReducer,
    [$$observable] : observable,
  };
```

这里我们主要研究store对象中的前四个属性。

还是会归到源码中来，在createStore函数的开头，申明了几个变量

```JavaScript
  // 当前的reducer
  var currentReducer = reducer;
  // 当前状态树
  var currentState = preloadedState;
  // 当前订阅的回调
  var currentListeners = [];
  // 下一轮的订阅的回调
  var nextListeners = currentListeners;
  //  自由变量
  // 是否是dispatch状态
  var isDispatching = false;
```

这几个变量是自由变量，在返回的store对象中的方法体里面包含着对这几个变量的引用。这其实就是闭包。

这几个变量从初始化开始就会一直存在于内存中。

而这些自由变量的作用就是充当缓存，用于存储对应的最新的值。

在store对象中被返回的方法也是在createStore中被申明的。

### getState方法

```JavaScript
  function getState() {
    if (isDispatching) {
      throw new Error('You may not call store.getState() while the reducer is executing. ' + 'The reducer has already received the state as an argument. ' + 'Pass it down from the top reducer instead of reading it from the store.');
    }

    return currentState;
  }
```

getState就是**返回当前的状态树**。可以发现，store对象并没有暴露直接修改currentState的方法，这保证了currentState是只读的，不会被随意的直接修改。这就是闭包的妙用！

### dispatch方法

```JavaScript
 function dispatch(action) {
    // action必须是简单对象
    if (!isPlainObject(action)) {
      throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
    }
    //  action必须有type属性
    if (typeof action.type === 'undefined') {
      throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
    }
    //
    if (isDispatching) {
      throw new Error('Reducers may not dispatch actions.');
    }

    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
    } finally {
      isDispatching = false;
    }
    // 将下一次的订阅队列赋值给当前订阅队列
    var listeners = currentListeners = nextListeners;

    // 遍历队列，依次执行回调
    for (var i = 0; i < listeners.length; i++) {
      var listener = listeners[i];
      listener();
    }
    // 将action抛出
    return action;
  }
```

dispatch方法是修改状态树的**唯一途径**，这保证了状态的修改是**可预测，可追踪的**！

dispatch方法接受一个action对象作为参数，这个action必须是简单对象，同时也要有type属性。

dispatch的主要工作就是`currentState = currentReducer(currentState, action);`使用当前的reducer处理当前的状态树，然后将最新的状态树保存在currentState这个自由变量中。然后呢在遍历监听器的队列，依次执行对应的回调函数。最后将action抛出。简单来说就是 **更新状态树，然后执行订阅的监听器**。

### subscribe方法

dispatch中出现了Listeners，这个Listeners是什么东西呢？这个可以从subscribe中找到答案。

```JavaScript
  function subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error('Expected the listener to be a function.');
    }

    if (isDispatching) {
      throw new Error('You may not call store.subscribe() while the reducer is executing. ' + 'If you would like to be notified after the store has been updated, subscribe from a ' + 'component and invoke store.getState() in the callback to access the latest state. ' + 'See https://redux.js.org/api/store#subscribelistener for more details.');
    }

    var isSubscribed = true;
    // 切断nextListener和currentListener的联系
    ensureCanMutateNextListeners();
    // 把新的订阅添加到下一次的订阅队列中
    nextListeners.push(listener);
    return function unsubscribe() {
      if (!isSubscribed) {
        return;
      }

      if (isDispatching) {
        throw new Error('You may not unsubscribe from a store listener while the reducer is executing. ' + 'See https://redux.js.org/api/store#subscribelistener for more details.');
      }

      isSubscribed = false;
      ensureCanMutateNextListeners();
      var index = nextListeners.indexOf(listener);
      nextListeners.splice(index, 1);
      currentListeners = null;
    };
  }

```

**所谓的Listeners就是每次更新完状态树（执行dispatch）之后要执行的回调函数**。我们把它称为监听器。

这个subscribe方法就是添加监听器的方法，从currentListeners这个变量的初始化可以看出他是一个队列，用数组来储存队列中的每一个监听器。subscribe方法的工作就是往nextListeners的末尾添加回调，

同时返回一个解绑函数，为什么有解绑函数？因为这些监听器会在每次执行dispatch时都执行，那么根据用户的需要在适当的时机把某些监听器从队列的删除也是有必要的。而删除的逻辑也很简单

```JavaScript
      ensureCanMutateNextListeners();
      var index = nextListeners.indexOf(listener);
      nextListeners.splice(index, 1);
```

### replaceReducer方法

replaceReducer方法就是替换一下当前的reducer currentReducer，然后执行一下

dispatch({ type: ActionTypes.REPLACE});

其实这个ActionTypes.REPLACE是个随机数，在reducer中不可能有这种type，所以这个action不会改变当前的状态树，只是会再执行一下监听器的队列。

