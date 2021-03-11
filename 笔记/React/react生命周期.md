# react生命周期



| React15生命周期      |                                                    |                           |                                                              |
| -------------------- | -------------------------------------------------- | ------------------------- | ------------------------------------------------------------ |
| 初始化               | 描述                                               | 更新阶段                  | 描述                                                         |
| constructor          | 初始化实例                                         | componentWillReceiveProps | 由父组件触发的组件更新                                       |
| componentWillMount   | 在render之前执行，不建议在此进行初始化操作         | shouldComponentUpdate     | 由组件自身触发的组件更新                                     |
|                      |                                                    | componentWillUpdate       | 在render之前调用                                             |
| render               | 生成虚拟DOM                                        | render                    | 生成虚拟DOM                                                  |
| componentDidMount    | 与虚拟DOM对应的真实DOM已经生成之后，回去执行该方法 | componentDidUpdate        | 更新后的虚拟DOM和之前的进行diff，对发生改变的真实DOM做定向的更新 |
| componentWillUnmount | 组件卸载前执行                                     | componentWillUnmount      | 同左边                                                       |





### react15版本的生命周期：

#### 组件的初始化（挂载）：

![](E:\NodeJS-Study\笔记\React\初始化.png)

挂载过程在组件的一生中只会发生一次，在这个过程中组件被初始化，然后渲染到真实的DOM中。

在挂载阶段组件要经历这样几个方法：

1. constructor()： 仅在组件初始化时被调用一次，可以在这个里面进行state的初始化。
2. componentWillMount(): 同样只会在初始化的时候被调用一次，componentWillMount会在render方法之前被调用，不建议在这个方法内做初始化操作。
3. render：render方法执行时不回去操作真实的DOM，他的工作是将需要渲染的内容用JavaScript描述出来（生成虚拟DOM节点），然后返回。真实的DOM渲染工作是由ReactDOM.render完成的。
4. componentDidMount：是在渲染执行之后触发的，就是真实的DOM已经加载在页面上之后，再去执行这个方法。所以我们可以在这个方法里面执行操作真实DOM的相关操作。同时像异步请求，数据初始化等工作也都可以放在这里来做。



#### 更新阶段：组件的更新

组件的更新分为两种：

1. 由父组件更新触发的更新。
2. 另一种是组件调用自己的setState触发的更新。

![](E:\NodeJS-Study\笔记\React\组件的更新.png)

#### componentWillReceiveProps由什么触发？

在上图中，我们发现组件由父组件更新触发自身的更新和组件自身触发相比，**多了一个生命周期**：

```javascript
componentWillReceiveProps(nextProps)
```

nextProps表示接受到的新的props内容，而现有的props，我们在方法内可以通过this.porps得到，由此可以感知props的变化。

componentWillReceiveProps会在由父组件的更新而触发的组件更新中触发，无论由父组件传入的props是否变化。就是说**只要是父组件更新（rerender）**导致组件更新了，那么就必然会执行componentWillReceiveProps。



#### 由组件自身触发的rerender的生命周期：

1. shouldComponentUpdate  

   react组件会根据该方法的返回值来决定是否执行该方法之后的生命周期，进而决定是否对组件进行重新渲染。该方法的默认值是true，就是说默认情况下是无条件重渲染的。但是在实际的开发中，有时为了避免不必要的rerender带来的性能开销，我们往往会手动懂去添加判定逻辑，或者引入PureComponent等最佳实践来实现有条件的rerender。

2. componentWillUpdate   该方法会在render方法之前触发，和componentWillMount类似，可以在里面做一些不涉及真实DOM操作的工作。

3. render

4. componentDidUpdate 该方法和componentDidMount类似，此时内容已经渲染到真实的DOM中了，可以基于DOM来做一些操作了。



#### 组件的卸载：

componentWillUnmount：

这个生命周期本身不难理解，这里主要讲怎么触发它。

1. 组件在父组件中**被移除**
2. 组件中设置了key属性，而父组件在render的过程中，发现**key值和上一次的不一致**，那么这个组件就会被销毁，从而触发该组件的unmount。



### react 16版本的生命周期：

<img src="E:\NodeJS-Study\笔记\React\react16.3生命周期.png" alt="16.3生命周期"  />

#### 挂载阶段：组件的初始化

react 15和react 16.3 的挂载阶段生命周期对比：

![](E:\NodeJS-Study\笔记\React\挂载阶段对比.png)



React16以来的生命周期依然可以按照“挂载”、“更新”、”卸载“三个阶段来看，接下来我们依然是分阶段的拆解工作流程。但是，在这个过程中，我会把React16中新增的生命周期和流程上与React15不同的地方作对比，这将是我们学习的重点，对于和React15保持一致的部分，不再重复。

| React 15 初始化    | 描述            | React 16.3 初始化        | 描述                                |
| ------------------ | --------------- | ------------------------ | ----------------------------------- |
| constructor        | 初始化实例      | constructor              | 同左                                |
| componentWillMount |                 | getDerivedStateFromProps | 静态方法，由props或state中派生state |
| render             | 生成虚拟DOM     | render                   | 同左                                |
| componentDidMount  | 真实DOM已经生成 | componentDidMount        | 同左                                |
|                    |                 |                          |                                     |
|                    |                 |                          |                                     |
|                    |                 |                          |                                     |



##### getDerivedStateFromProps：

**getDerivedStateFromProps**作为组件的静态方法被添加到组件上。static getDerivedStateFromProps（）{}

他的执行时机是在初始化/更新时 调用。

他是在react 16版本被添加进react生命周期的。目的是为了替换掉**componentWillReceiveProps**。**他的用途有且只有一个**，就是**使用Props来派生/更新state**。这一点从他的名字上就可以看出来。

请注意：**getDerivedStateFromProps**在初始化和更新阶段都会执行，而**componentWillReceiveProps**只会在更新阶段执行。原因是这种从props中派生state的需求不仅仅在props更新时存在，在组件初始化的时候同样存在。

##### 使用**getDerivedStateFromProps**：

```javascript
static getDerivedStateFromProps(props, state){
    //因为该方法是静态方法，所以在方法内部不能访问this。
    // 该方法应该只被用于从props派生出state
    
    // 方法接受两个参数： props 和 state。 他们代表当前组件接受到来自父组件的props，和当前组件自身的state。
    // 该方法必须要一个返回值 当不存在使用props派生state时，可以返回null。
    // 返回的对象和state的合并规则和setState一样
}
```



#### 更新阶段：组件的更新

React15与React16.3的更新流程对比：

![](E:\NodeJS-Study\笔记\React\更新阶段的对比.png)

| React 15 组件更新         | 描述                | React 16.3 组件更新      | 描述                               |
| ------------------------- | ------------------- | ------------------------ | ---------------------------------- |
| componentWillReceiveProps | 父组件更新触发      | getDerivedStateFromProps | 父组件更新触发                     |
| shouldComponentUpdate     | 组件自身更新触发    | shouldComponentUpdate    | 同左                               |
| componentWillUpdate       | 在render之前触发    |                          |                                    |
| render                    | 生成虚拟DOM         | render                   | 生成虚拟DOM                        |
|                           |                     | getSnapshotBeforeUpdate  | 在虚拟DOM生成后，真实DOM更新前执行 |
| componentDidUpdate        | 新的真实DOM已经生成 | componentDidUpdate       | 同左                               |

react16.4对生命周期流程进行了微调，调整的地方就在getDerivedStateFromProps这个地方。在React16.4的生命周期中，由setState和forceUpdate导致的更新也会触发getDerivedStateFromProps；

![](E:\NodeJS-Study\笔记\React\react16.4的生命周期.png)

#### 消失的componentWillUpdate与新增的getSnapshotBeforeUpdate



componentWillUpdate的执行时机是在render之前，而getSnapshotBeforeUpdate的执行时机是render之后，DOM更新之前。

**getSnapshotBeforeUpdate**这个方法和 getDerivedStateFromProps 颇有几分神似，它们都强调了“我需要一个返回值”这回事。区别在于 **getSnapshotBeforeUpdate 的返回值会作为第三个参数给到 componentDidUpdate**。**它的执行时机是在 render 方法之后，真实 DOM 更新之前**。在这个阶段里，我们可以**同时获取到更新前的真实 DOM 和更新前后的 state&props 信息**。

```JavaScript
// 组件更新时调用
getSnapshotBeforeUpdate(prevProps, prevState) {
  console.log("getSnapshotBeforeUpdate方法执行");
  return "haha";
}

// 组件更新后调用
componentDidUpdate(prevProps, prevState, valueFromSnapshot) {
  console.log("componentDidUpdate方法执行");
  console.log("从 getSnapshotBeforeUpdate 获取到的值是", valueFromSnapshot);
}
```





### 组件的卸载

React 16组件的卸载和React15是一样的，此处不再重复。

react生命周期图：

https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/

react源码阅读：

https://react.jokcy.me/