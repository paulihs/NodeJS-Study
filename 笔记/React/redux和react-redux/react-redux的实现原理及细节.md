#### react-redux是将redux应用于react的一库

react-redux的主要工作是把redux中的状态树引入到react组件中。

##### react-redux的工作原理：

react-redux是react中的context来实现将处于顶层的状态树传到每一个依赖状态树中状态的组件中的。

关于context 的使用，可以参照React Context的使用

```JavaScript
 import { Provider } from 'react-redux'

const initialState = {}
const store = configureStore(initialState)
ReactDOM.render(
    <Provider store={store}>
      <App history={history} />
    </Provider>,
    document.getElementById('react-root')
  )
```

这个Provider就是一个Context.Provider的包装函数。

```JavaScript
// 三个参数就是在引用组件时传入的参数
function Provider({ store, context, children }) {

  // 创建一个对象，包含store和subscription
  const contextValue = useMemo(() => {
    const subscription = new Subscription(store);
    subscription.onStateChange = subscription.notifyNestedSubs;
    return {
      store,
      subscription
    }
  }, [store]);

  const previousState = useMemo(() => store.getState(), [store]);

  //
  useEffect(() => {
    const { subscription } = contextValue;
    // 订阅 handleChangeWrapper
    subscription.trySubscribe();

    if (previousState !== store.getState()) {
      subscription.notifyNestedSubs()
    }
    return () => {
      subscription.tryUnsubscribe()
      subscription.onStateChange = null
    }
  }, [contextValue, previousState]);

  const Context = context || ReactReduxContext

  return <Context.Provider value={contextValue}>{children}</Context.Provider>
}
```

有了Provider，那就需要consumer来获取Provider中的值了。



那么这个consumer就是connect方法！