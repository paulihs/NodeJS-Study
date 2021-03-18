### 是什么？

react-hook为函数式组件带来了状态这个概念。

在此之前，函数组件又被称为无状态组件。

函数组件就是以函数形式存在的React组件。在早期没有react-hook的时候，函数组件内部无法定义和维护state，因此他还有一个别名：“无状态组件”。

```JavaScript
function DemoFunction(props) {
  const { text } = props
  return (
    <div className="demoFunction">
      <p>{`function 组件所接收到的来自外界的文本内容是：[${text}]`}</p>
    </div>
  );
}
```



| 函数组件和类组件的不同         |                            |
| ------------------------------ | -------------------------- |
| 类组件                         | 函数组件                   |
| 需要继承class                  | 不需要                     |
| 可以访问生命周期               | 不能                       |
| 可以获取实例化的this           | 不可以                     |
| 可以维护state                  | 不可以                     |
| 特点                           |                            |
| 提供的能力大而全，学习成本高   | 轻量、灵活、易组织、可复用 |
| 组件内部逻辑难以实现拆分和复用 |                            |
| 面向对象编程                   | 函数式编程                 |



[函数组件和类组件有何不同 By Dan](https://overreacted.io/zh-hans/how-are-function-components-different-from-classes/)



#### 函数组件会捕获render内部的状态，这是两类组件最大的不同

如何理解这句话？

看一个例子：

```JavaScript
class ProfilePage extends React.Component {
  showMessage = () => {
    alert('Followed ' + this.props.user);
  };

  handleClick = () => {
    setTimeout(this.showMessage, 3000);
  };

  render() {
    return <button onClick={this.handleClick}>Follow</button>;
  }
}
```

这个组件返回的是一个按钮，交互内容也很简单：点击按钮后，过 3s，界面上会弹出“Followed xxx”的文案。类似于我们在微博上点击“关注某人”之后弹出的“已关注”这样的提醒。

看起来好像没啥毛病，但是如果你在这个[在线 Demo](https://codesandbox.io/s/pjqnl16lm7)中尝试点击基于类组件形式编写的 ProfilePage 按钮后 3s 内把用户切换为 Sophie，你就会看到如下图所示的效果：

![3.png](https://s0.lgstatic.com/i/image/M00/65/3D/Ciqc1F-aaNGAQ0imAAETlLd2DpM458.png)

图源：https://overreacted.io/how-are-function-components-different-from-classes/

明明我们是在 Dan 的主页点击的关注，结果却提示了“Followed Sophie”！

这个现象必然让许多人感到困惑：user 的内容是通过 props 下发的，props 作为不可变值，为什么会从 Dan 变成 Sophie 呢？

因为**虽然 props 本身是不可变的，但 this 却是可变的，this 上的数据是可以被修改的**，this.props 的调用每次都会获取最新的 props，而这正是 React 确保数据实时性的一个重要手段。

多数情况下，在 React 生命周期对执行顺序的调控下，this.props 和 this.state 的变化都能够和预期中的渲染动作保持一致。但在这个案例中，**我们通过 setTimeout 将预期中的渲染推迟了 3s，打破了 this.props 和渲染动作之间的这种时机上的关联**，进而导致渲染时捕获到的是一个错误的、修改后的 this.props。这就是问题的所在。

但如果我们把 ProfilePage 改造为一个像这样的函数组件：

```JavaScript
function ProfilePage(props) {

  const showMessage = () => {
    alert('Followed ' + props.user);
  };

  const handleClick = () => {
    setTimeout(showMessage, 3000);
  };

  return (
    <button onClick={handleClick}>Follow</button>
  );
}
```

事情就会大不一样。

props 会在 ProfilePage 函数执行的一瞬间就被捕获，而 props 本身又是一个不可变值，因此**我们可以充分确保从现在开始，在任何时机下读取到的 props，都是最初捕获到的那个 props**。

​		**函数组件每一次渲染就是一个闭包，所以在一次渲染（执行一次函数）之后，返回的DOM中包含对函数中变量的引用。那么这个引用相当于是对当时函数执行上下文的一个快照。所以那一次生成的DOM中包含的引用一定是当时函数执行上下文中的值。**

当父组件传入新的 props 来尝试重新渲染 ProfilePage 时，本质上是基于新的 props 入参发起了一次全新的函数调用，并不会影响上一次调用对上一个 props 的捕获。这样一来，我们便确保了渲染结果确实能够符合预期。

如果你认真阅读了我前面说过的那些话，相信你现在一定也**不仅仅能够充分理解 Dan 所想要表达的“函数组件会捕获 render 内部的状态”**这个结论，而是能够更进一步地意识到这样一件事情：**函数组件真正地把数据和渲染绑定到了一起**。（通过闭包的方式）

经过岁月的洗礼，React 团队显然也认识到了，**函数组件是一个更加匹配其设计理念、也更有利于逻辑拆分与重用的组件表达形式**，接下来便开始“用脚投票”，用实际行动支持开发者编写函数式组件。于是，React-Hooks 便应运而生。





### 深入React-Hooks工作机制

##### 原则背后是原理

##### React-Hooks的使用原则：

1. 只在React函数组件中使用Hook；
2. 不在循环、条件、或者嵌套函数中使用Hook；

第一条原则不用多说，react-hooks就是用于增强react函数组件能力的，在普通函数中使用没有意义。

第二条原则就需要好好说道说道了，这个原则的目的其实就是**要保证Hooks在每次渲染时都保持同样的执行顺序**。

why？

#### 从源码调用流程看原理：Hooks的正常运作，在底层依赖于顺序链表

以useState为例，从react-hooks的调用链路说起

![](E:\NodeJS-Study\笔记\React\useState的调用链路.png)

```JavaScript
// 进入 mounState 逻辑
function mountState(initialState) {

  // 将新的 hook 对象追加进链表尾部
  var hook = mountWorkInProgressHook();

  // initialState 可以是一个回调，若是回调，则取回调执行后的值
  if (typeof initialState === 'function') {
    // $FlowFixMe: Flow doesn't like mixed types
    initialState = initialState();
  }

  // 创建当前 hook 对象的更新队列，这一步主要是为了能够依序保留 dispatch
  const queue = hook.queue = {
    last: null,
    dispatch: null,
    lastRenderedReducer: basicStateReducer,
    lastRenderedState: (initialState: any),
  };

  // 将 initialState 作为一个“记忆值”存下来
  hook.memoizedState = hook.baseState = initialState;

  // dispatch 是由上下文中一个叫 dispatchAction 的方法创建的，这里不必纠结这个方法具体做了什么
  var dispatch = queue.dispatch = dispatchAction.bind(null, currentlyRenderingFiber$1, queue);
  // 返回目标数组，dispatch 其实就是示例中常常见到的 setXXX 这个函数，想不到吧？哈哈
  return [hook.memoizedState, dispatch];
}
```

mountState的主要工作是初始化Hooks，在mountState中，最需要关注的是mountWorkInProgressHook方法





```JavaScript
function mountWorkInProgressHook() {
  // 注意，单个 hook 是以对象的形式存在的
  var hook = {
    memoizedState: null,
    baseState: null,
    baseQueue: null,
    queue: null,
    next: null
  };
  if (workInProgressHook === null) {
    // 这行代码每个 React 版本不太一样，但做的都是同一件事：将 hook 作为链表的头节点处理
    firstWorkInProgressHook = workInProgressHook = hook;
  } else {
    // 若链表不为空，则将 hook 追加到链表尾部
    workInProgressHook = workInProgressHook.next = hook;
  }
  // 返回当前的 hook
  return workInProgressHook;
}
```

从上面的代码可以看出 **hook的信息都存放在一个hook对象中，而hook对象之间以单向链表的形式相互串联**。

接下来看更新的过程：

![useState更新过程](E:\NodeJS-Study\笔记\React\useState更新过程.png)

首次渲染和更新渲染的区别在于调用的是mountState还是updateState，updateState之后的链路涉及的代码很多，但其做的事情很容易理解，按顺序遍历之前构建好的链表，取出对应的数据进行渲染。

hooks的本质其实就是链表。



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

有时候，我们必须学会忘记旧的知识，才能更好地拥抱新的知识。

对于每一个学习 useEffect 的人来说，生命周期到 useEffect 之间的转换关系都不是最重要的，最重要的是在脑海中构建一个“组件有副作用 → 引入 useEffect”这样的条件反射——**当你真正抛却类组件带给你的刻板印象、拥抱函数式编程之后，想必你会更加认同“useEffect 是用于为函数组件引入副作用的钩子”这个定义**。



- 每次渲染后都执行的副作用：传入回调，不传依赖数组。调用形式如下：

```JavaScript
useEffect(callback)
```

- 仅在挂载阶段执行一次的副作用：传入回调函数，且这个函数的返回值不是一个函数，同时传入一个空数组。 调用形式如下：

```JavaScript
useEffect(()=>{

  // 这里是业务逻辑 

}, [])

```

- 仅在挂载和卸载阶段执行的副作用：传入回调函数，**且这个函数的返回值是一个函数**，同时传入一个空数组。假设回调函数本身记为A，返回的函数记为B，那么将在挂载阶段执行A，卸载阶段执行B。调用形式如下所示：

```JavaScript
useEffect(()=>{

  // 这里是 A 的业务逻辑

  // 返回一个函数记为 B
  return ()=>{

  }
}, [])
```

- 每次渲染都触发，且卸载阶段也会触发的副作用：传入回调函数，且这个函数的返回值是一个函数，同时不传第二个参数。

```JavaScript
useEffect(()=>{

  // 这里是 A 的业务逻辑

  // 返回一个函数记为 B
  return ()=>{

  }
})
```

上面这个代码使得react在每次渲染的时候都去触发A逻辑，并且在卸载的时候去触发B逻辑。

但是注意一点：函数组件每次渲染，都意味着函数重新执行了一遍。那么其实每次传给useEffect的函数都是不一样的，我们从0开始，把从第一次渲染时传入useEffect的函数称为A0，以此类推，第二次渲染时，传入的叫A1...，同样的，A0的返回值——我们称为函数B0。

那么我们来模拟一下代码在实际运行时，函数A和函数B的执行顺序。

在第一次渲染后，会执行函数A0，同时返回函数B0，

在第二次渲染之后，会先执行函数B0，然后在执行函数A1，同时返回函数B1。

如果组件继续这么重新渲染下去，依然会按照这个规律，依次执行下去。

如果此时函数卸载了，在卸载之前，会执行函数B1。

所以上面说的不完全正确，关于A的是对的，对于B的描述不够准确。



关于函数B正确的顺序是：返回的函数B会在下一次渲染完成后，副作用执行前执行，如果没有下次渲染了，直接卸载，那么就在卸载时执行。

| 第一次渲染之后 | 执行A0（返回B0）         |
| -------------- | ------------------------ |
| 第二次渲染之后 | 执行B0、执行A1（返回B1） |
| 第三次渲染之后 | 执行B1、执行A2（返回B2） |
| ...            | ...                      |
| 卸载           | 执行B（n-1）             |

- 根据一定的依赖条件来触发的副作用：传入回调函数，同时传入一个非空的数组。

```JavaScript
useEffect(()=>{

  // 这是回调函数的业务逻辑 

  // 若 xxx 是一个函数，则 xxx 会在组件卸载时被触发
  return xxx
}, [num1, num2, num3])

```

这些传入数组的参数，可以是props中的属性，也可以是组件组件的state。

有一点要注意，返回的xxx函数会在下一次组件重新渲染之后，副作用之前执行，但是前提是这次渲染，数组中的参数发生了变化，如果这次渲染数组中的参数一个都没有变，那么非但副作用函数不会执行，上一次副作用函数返回的xxx函数也不会执行。还有一点，在组件卸载的时候，返回的xxx函数一定会执行。

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









