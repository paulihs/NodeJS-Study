### createStore

```javascript

function createStore(reducer, preloadedState, enhancer) {
  var _store;

  if (typeof preloadedState === 'function' && typeof enhancer === 'function' || typeof enhancer === 'function' && typeof arguments[3] === 'function') {
    throw new Error('It looks like you are passing several store enhancers to ' + 'createStore(). This is not supported. Instead, compose them ' + 'together to a single function.');
  }

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

  var currentReducer = reducer;
  var currentState = preloadedState;
  var currentListeners = [];
  var nextListeners = currentListeners;
  //  自由变量
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
   *  返回那个 currentState
   * @returns {undefined}
   */
  function getState() {
    if (isDispatching) {
      throw new Error('You may not call store.getState() while the reducer is executing. ' + 'The reducer has already received the state as an argument. ' + 'Pass it down from the top reducer instead of reading it from the store.');
    }

    return currentState;
  }



  /**
   *
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
    ensureCanMutateNextListeners();
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
    // 将
    var listeners = currentListeners = nextListeners;

    for (var i = 0; i < listeners.length; i++) {
      var listener = listeners[i];
      listener();
    }

    return action;
  }




  function replaceReducer(nextReducer) {
    if (typeof nextReducer !== 'function') {
      throw new Error('Expected the nextReducer to be a function.');
    } // TODO: do this more elegantly
    currentReducer = nextReducer; // This action has a similar effect to ActionTypes.INIT.
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
  } // When a store is created, an "INIT" action is dispatched so that every
  // reducer returns their initial state. This effectively populates
  // the initial state tree.


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

- createStore 从字面上就可以看出是来创建store的对象的
- createStore接受三个参数 reducer preloadState enhancer
- reducer不必说了，preloadState就是state初始值，enhancer字面上叫放大器实际上他就是一个函数，下面会重点讲他







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
