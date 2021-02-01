# react生命周期

react生命周期在16版本经历了一次大的修改，和一次小的微调。

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

在上图中，我们发现组件由父组件更新触发自身的更新和组件自身触发相比，多了一个生命周期：

```javascript
componentWillReceiveProps(nextProps)
```

nextProps表示接受到的新的props内容，而现有的props，我们在方法内可以通过this.porps得到，由此可以感知props的变化。

componentWillReceiveProps会在由父组件的更新而触发的组件更新中触发，无论由父组件传入的props是否变化。就是说只要是父组件更新（rerender）导致组件更新了，那么就必然会执行componentWillReceiveProps。



#### 由组件自身触发的rerender的生命周期：

1. shouldComponentUpdate  react组件会根据该方法的返回值来决定是否执行该方法之后的生命周期，进而决定是否对组件进行重新渲染。该方法的默认值是true，就是说默认情况下是无条件重渲染的。但是在实际的开发中，有时为了避免不必要的rerender带来的性能开销，我们往往会手动懂去添加判定逻辑，或者引入PureComponent等最佳实践来实现有条件的rerender。
2. componentWillUpdate   该方法会在render方法之前触发，和componentWillMount类似，可以在里面做一些不涉及真实DOM操作的工作。
3. render
4. componentDidUpdate 该方法和componentDidMount类似，此时内容已经渲染到真实的DOM中了，可以基于DOM来做一些操作了。



#### 组件的卸载：

componentWillUnmount：

这个生命周期本身不难理解，这里主要讲怎么触发它。

1. 组件在父组件中被移除
2. 组件中设置了key属性，而父组件在render的过程中，发现key值和上一次的不一致，那么这个组件就会被销毁，从而触发该组件的unmount。

#### react 16版本的生命周期：

<img src="E:\NodeJS-Study\笔记\React\react16.3生命周期.png" alt="16.3生命周期"  />

##### getDerivedStateFromProps：

**getDerivedStateFromProps**作为组件的静态方法被添加到组件上。static getDerivedStateFromProps（）{}

他的执行时机是在初始化/更新时 调用。

他是在react 16版本被添加进react生命周期的。目的是为了替换掉**componentWillReceiveProps**。**他的用途有且只有一个**，就是**使用Props来派生/更新state**。这一点从他的名字上就可以看出来。

请注意：**getDerivedStateFromProps**在初始化和更新阶段都会执行，而**componentWillReceiveProps**只会在更新阶段执行。原因是这种从props中派生state的需求不仅仅在props更新时存在，在组件初始化的时候同样存在。



#### 挂载阶段：组件的初始化

react 15和react 16.3 的挂载阶段生命周期对比：

![](E:\NodeJS-Study\笔记\React\挂载阶段对比.png)



##### 使用**getDerivedStateFromProps**：

```javascript
static getDerivedStateFromProps(props, state){
    //因为该方法是静态方法，所以在方法内部不能访问this。
    // 该方法应该只被用于从props派生出state
    
    // 方法接受两个参数： props 和 state。 他们代表当前组件接受到来自父组件的props，和当前组件自身的state。
    // 该方法必须要一个返回值 当不存在使用props派生state时，可以返回null。
}
```



#### 更新阶段：组件的更新

























react生命周期图：

https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/

react源码阅读：

https://react.jokcy.me/