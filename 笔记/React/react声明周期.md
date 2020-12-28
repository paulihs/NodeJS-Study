# react生命周期

react生命周期在16版本经历了一次大的修改，和一次小的微调。

#### react15版本的生命周期：

#### react 16版本的生命周期：

<img src="E:\NodeJS-Study\笔记\React\react16.3生命周期.png" alt="16.3生命周期"  />

##### getDerivedStateFromProps：

**getDerivedStateFromProps**作为组件的静态方法被添加到组件上。static getDerivedStateFromProps（）{}

他的执行时机是在初始化/更新时 调用。

他是在react 16版本被添加进react生命周期的。目的是为了替换掉**componentWillReceiveProps**。**他的用途有且只有一个**，就是**使用Props来派生/更新state**。这一点从他的名字上就可以看出来。

请注意：**getDerivedStateFromProps**在初始化和更新阶段都会执行，而**componentWillReceiveProps**只会在更新阶段执行。原因是这种从props中派生state的需求不仅仅在props更新时存在，在组件初始化的时候同样存在。

##### 使用**getDerivedStateFromProps**：



```javascript
static getDerivedStateFromProps(props, state){
    
}
```



































react生命周期图：

https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/

react源码阅读：

https://react.jokcy.me/