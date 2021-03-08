import _objectSpread from '@babel/runtime/helpers/esm/objectSpread2';

var $$observable = /* #__PURE__ */function () {
  return typeof Symbol === 'function' && Symbol.observable || '@@observable';
}();

/**
 * These are private action types reserved by Redux.
 * For any unknown actions, you must return the current state.
 * If the current state is undefined, you must return the initial state.
 * Do not reference these action types directly in your code.
 */
var randomString = function randomString() {
  return Math.random().toString(36).substring(7).split('').join('.');
};

var ActionTypes = {
  INIT: "@@redux/INIT" + /* #__PURE__ */randomString(),
  REPLACE: "@@redux/REPLACE" + /* #__PURE__ */randomString(),
  PROBE_UNKNOWN_ACTION: function PROBE_UNKNOWN_ACTION() {
    return "@@redux/PROBE_UNKNOWN_ACTION" + randomString();
  }
};

/**
 * @param obj The object to inspect.
 * @returns True if the argument appears to be a plain object.
 */
function isPlainObject(obj) {
  if (typeof obj !== 'object' || obj === null) return false;
  var proto = obj;

  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }

  return Object.getPrototypeOf(obj) === proto;
}

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

/**
 * Prints a warning in the console if it exists.
 *
 * @param message The warning message.
 */
function warning(message) {
  /* eslint-disable no-console */
  if (typeof console !== 'undefined' && typeof console.error === 'function') {
    console.error(message);
  }
  /* eslint-enable no-console */


  try {
    // This error was thrown as a convenience so that if you enable
    // "break on all exceptions" in your console,
    // it would pause the execution at this line.
    throw new Error(message);
  } catch (e) {
  } // eslint-disable-line no-empty

}

function getUndefinedStateErrorMessage(key, action) {
  var actionType = action && action.type;
  var actionDescription = actionType && "action \"" + String(actionType) + "\"" || 'an action';
  return "Given " + actionDescription + ", reducer \"" + key + "\" returned undefined. " + "To ignore an action, you must explicitly return the previous state. " + "If you want this reducer to hold no value, you can return null instead of undefined.";
}

function getUnexpectedStateShapeWarningMessage(inputState, reducers, action, unexpectedKeyCache) {
  var reducerKeys = Object.keys(reducers);
  var argumentName = action && action.type === ActionTypes.INIT ? 'preloadedState argument passed to createStore' : 'previous state received by the reducer';

  if (reducerKeys.length === 0) {
    return 'Store does not have a valid reducer. Make sure the argument passed ' + 'to combineReducers is an object whose values are reducers.';
  }

  if (!isPlainObject(inputState)) {
    var match = Object.prototype.toString.call(inputState).match(/\s([a-z|A-Z]+)/);
    var matchType = match ? match[1] : '';
    return "The " + argumentName + " has unexpected type of \"" + matchType + "\". Expected argument to be an object with the following " + ("keys: \"" + reducerKeys.join('", "') + "\"");
  }

  var unexpectedKeys = Object.keys(inputState).filter(function (key) {
    return !reducers.hasOwnProperty(key) && !unexpectedKeyCache[key];
  });
  unexpectedKeys.forEach(function (key) {
    unexpectedKeyCache[key] = true;
  });
  if (action && action.type === ActionTypes.REPLACE) return;

  if (unexpectedKeys.length > 0) {
    return "Unexpected " + (unexpectedKeys.length > 1 ? 'keys' : 'key') + " " + ("\"" + unexpectedKeys.join('", "') + "\" found in " + argumentName + ". ") + "Expected to find one of the known reducer keys instead: " + ("\"" + reducerKeys.join('", "') + "\". Unexpected keys will be ignored.");
  }
}

// 校验 reducer的 defaultState是否合法，在初始化或者收到未知的actionType的时候都不能返回undefined
function assertReducerShape(reducers) {
  Object.keys(reducers).forEach(function (key) {
    var reducer = reducers[key];
    var initialState = reducer(undefined, {
      type: ActionTypes.INIT
    });

    if (typeof initialState === 'undefined') {
      throw new Error("Reducer \"" + key + "\" returned undefined during initialization. " + "If the state passed to the reducer is undefined, you must " + "explicitly return the initial state. The initial state may " + "not be undefined. If you don't want to set a value for this reducer, " + "you can use null instead of undefined.");
    }

    if (typeof reducer(undefined, {
      type: ActionTypes.PROBE_UNKNOWN_ACTION()
    }) === 'undefined') {
      throw new Error("Reducer \"" + key + "\" returned undefined when probed with a random type. " + ("Don't try to handle " + ActionTypes.INIT + " or other actions in \"redux/*\" ") + "namespace. They are considered private. Instead, you must return the " + "current state for any unknown actions, unless it is undefined, " + "in which case you must return the initial state, regardless of the " + "action type. The initial state may not be undefined, but can be null.");
    }
  });
}

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
    // 返回新的state，返回的state和原来的state是不同的两个对象
    return hasChanged ? nextState : state;
  };
}

function bindActionCreator(actionCreator, dispatch) {
  return function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return dispatch(actionCreator.apply(this, args));
  };
}

function bindActionCreators(actionCreators, dispatch) {
  if (typeof actionCreators === 'function') {
    return bindActionCreator(actionCreators, dispatch);
  }

  if (typeof actionCreators !== 'object' || actionCreators === null) {
    throw new Error("bindActionCreators expected an object or a function, instead received " + (actionCreators === null ? 'null' : typeof actionCreators) + ". " + "Did you write \"import ActionCreators from\" instead of \"import * as ActionCreators from\"?");
  }

  var boundActionCreators = {};

  for (var key in actionCreators) {
    var actionCreator = actionCreators[key];

    if (typeof actionCreator === 'function') {
      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
    }
  }

  return boundActionCreators;
}

function compose() {
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


// 这个函数的参数是执行完dispatch之后，额外执行的函数
// applyMiddleware的参数就是中间件
function applyMiddleware() {
  // 将参数放入middleware中
  for (var _len = arguments.length, middlewares = new Array(_len), _key = 0; _key < _len; _key++) {
    // 把参数放进这个数组中
    middlewares[_key] = arguments[_key];
  }

  // 返回的函数就是enhancer，所以接受createStore作为参数。与createStore内容相呼应
  return function (createStore) {
    //  下面这个函数相当于 enhancer( createStore ) 返回的那个函数,他接受reducer和preloadState
    // 相当于 增强版的createStore
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

// functions
/*
 * This is a dummy function to check if the function name has been altered by minification.
 * If the function has been minified and NODE_ENV !== 'production', warn the user.
 */

function isCrushed() {
}

if (process.env.NODE_ENV !== 'production' && typeof isCrushed.name === 'string' && isCrushed.name !== 'isCrushed') {
  warning('You are currently using minified code outside of NODE_ENV === "production". ' + 'This means that you are running a slower development build of Redux. ' + 'You can use loose-envify (https://github.com/zertosh/loose-envify) for browserify ' + 'or setting mode to production in webpack (https://webpack.js.org/concepts/mode/) ' + 'to ensure you have the correct code for your production build.');
}

export {
  ActionTypes as __DO_NOT_USE__ActionTypes,
  applyMiddleware,
  bindActionCreators,
  combineReducers,
  compose,
  createStore
};
