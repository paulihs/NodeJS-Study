#### Component 和PureComponent的区别？

如果不实现shouldComponentUpdate函数，那么有两种情况会触发重新渲染流程

1. 当state发生改变时。
2. 当父组件发生重新渲染时，无论传入的Props是否发生变化，都会引发子组件的重新渲染。





PureComponent的核心原理就是默认实现了shouldComponentUpdate函数，在这个函数中对props和state进行浅比较，用于判断是否触发更新。

```JavaScript
shouldComponentUpdate(nextProps, nextState) {

  // 浅比较仅比较值与引用，并不会对 Object 中的每一项值进行比较

  if (shadowEqual(nextProps, this.props) || shadowEqual(nextState, this.state) ) {

    return true

  }

  return false

}

```

而Component是需要手动编写shouldComponentUpdate中的逻辑的。





函数组件

函数组件任何情况下都会重新渲染。函数组件没有生命周期，但官方提供了一种优化方式：React.memo