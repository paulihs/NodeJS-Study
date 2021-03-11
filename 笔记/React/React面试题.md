#### 类组件和函数组件有什么区别？

##### 描述区别就是 在确认共性的基础上寻找特性

###### 所以要从共同点和不同点两个方面来回答

相同点：

都是React可复用的最小代码片段，返回在页面中渲染的React元素。因为组件是React中最小的编码单元，所有无论是函数组件还是类组件，在使用方式和最终呈现的效果上是一致的。

不同点：

类组件和函数组件本质上代表了两种不同的设计思想和心智模式

- 类组件是面向对象编程的实现， 因此他有继承 有属性 有内部状态的管理， 有生命周期
- 函数式组件是函数式编程的实践。





#### setState是同步还是异步



#### React中组件如何通信

根据组件之间的关系划分：

父与子：

通过props



子与父：

通过Props传递方法



兄弟：

在父组件中设置state

通过props传递state和修改state的方法



无直接关系：

使用Context API



全局变量与事件：

使用发布订阅模式



状态管理框架

Redux Flux



#### Virtual DOM的工作原理是什么？

![](E:\NodeJS-Study\笔记\React\虚拟DOM的工作原理.png)



React的diff算法有何不同？

https://kaiwu.lagou.com/course/courseInfo.htm?courseId=566#/detail/pc?id=5800