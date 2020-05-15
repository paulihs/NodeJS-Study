# Hook概览
Hook是React 16.8的新特性，他可以让你在不便携class的情况下使用**state**，以及其他React特性。

## 1. useState
1. useState为函数组件添加一些内部状态。
2. useState会返回一对值，当前状态和改变它的函数。
3. 你可以在组件中多次使用useState，不同的状态之间是完全独立，互不影响的。
4. useState的参数作为state的初始值，只在初次渲染的时候会用到。
5. 当使用更新状态的函数更新状态时，react会将组件的一次重新渲染添加到队列中。
6. 如果新的state需要通过先前的state计算得出，那么可以将函数传递给setState，该函数接受先前的state作为参数。`setState((prevState) => prevState - 1)`。

```JavaScript
function Example(){
    const [count, setCount] = useState(0);
    return (
        <div>
          <p>You clicked {count} times</p>
          <button onClick={() => setCount(count + 1)}>
            Click me
          </button>
        </div>
    );
}
``` 

上面这段代码调用`useState`创建一个叫`count`的state，以及一个改变`count`的方法`setCount`。`useState`接受0为参数，作为`count`的初始值。当点击按钮时，触发`setCount`，改变`count`的值，react会重新渲染組件`Example`。
**注意：setCount类似于class组件的`this.setState`,但是他不会将新的state和旧的state合并。**

## 2. useEffect

1. 我们之前在React组件中执行过数据的获取，订阅或者修改DOM等操作。我们把这些操作称为‘副作用’。
2. `useEffect`是一个Effect Hook，给函数组件增加了操作副作用的能力。他跟class组件中的`componentDidMount`、`componentDidUpdate`、`componentWillUnmount`具有相同的用途，但是不完全相同。他是这三个函数的组合。
3. 在React组件中有两种常见的副作用操作：需要清除的副作用和不需要清除的副作用。下面我们分别来看看他们有什么区别。

### 无需清除的的effect
有时候我们需要在react更新DOM之后运行一些代码，比如发送请求，变更DOM。这些都是常见的无需清除的操作。
下面来看一个例子：通过点击按钮变更页面的title。

```javascript
function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

1. 初次渲染，状态count的值为0，渲染完成之后副作用effect执行，更新页面title。
2. 点击按钮触发setCount设置count的新状态。react将重新渲染。
3. 重新渲染之后副作用effect执行。更新页面的title。

这时useEffect相当于`componentDidMount`和`componentDidUpdate`，副作用effect会在组件每一次渲染之后执行。**请注意：每一次渲染（函数组件的重新执行）传递给useEffect的函数都是新的，也就是说每次重新渲染都会生成新的effect替换掉之前的。所以可以说effect是每次渲染结果的一部分**

### 需要清除的effect
有无需清除的effect，必然也有需要清除的effect。比如订阅外部数据。
举个例子：有一个显示好友状态的组件，需要根据好友Id订阅其状态。


```javascript
import React, { useState, useEffect } from 'react';

function FriendStatus(props) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    // Specify how to clean up after this effect:
    return function cleanup() {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}
```

#### 为什么effect返回了一个cleanup函数？他的作用是什么？
effect返回一个函数是effect可选的清除机制，相当于class组件的`componentWillUnmount`,但是也有不同。（不同之处请看下面）
#### 那么react何时执行清除操作呢？
1. React会在组件卸载的时候执行清除操作。
2. 当组件因为更新状态或者属性而重新渲染时，在渲染之后执行当前effect之前会先对上一个effect进行清除。还记得上面的注意点吗？组件的每次渲染其effect都是新的，react会保存上一次渲染时返回的清除函数，在组件卸载或者下一次渲染之后执行。

## Hook规则
### 只在最顶层使用Hook
不要在循环，条件或者嵌套函数（子函数）中调用Hook。
### 只在React函数中调用Hook
1. 在React的函数组件中调用Hook。
2. 在自定义Hook中调用其他Hook。


## 自定义Hook
自定义Hook是一个函数，其名称已‘use’开头，函数内部可以调用其他的hook。

自定义Hook如何影响函数组件的更新？







### useContext
useContext 相当于MyContext.Consumer或者class组件中的static contextType = MyContext;
```javascript
const value = useContext(Mycontext);
```
接受一个context对象（React.createContext的返回值）并返回该context的当前值。当前的context值由上层组件中距离当前组件最近的MyContext.Provider的value属性决定。
当组件上层最近的MyContext.Provider更新时，该Hook会触发重新渲染。并使用最新传递给MyContext的Provider的value值。即使祖先使用了react.memo或者shouldComponentUpdate，也会在组件本身使用useContext时重新渲染