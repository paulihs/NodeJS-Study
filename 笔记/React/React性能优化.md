### 如何打造高性能的React 应用？

React应用也是前端应用，那些前端项目普适的性能优化手段对于React来说也是同样有效的。

比如： 资源加载过程中的优化、减少重绘和回流、服务端渲染、启用CDN等等。



不过对于React项目来说，他有一个区别于传统前端项目的重要特点，就是React项目中，**是以React组件为最小单元来组织逻辑的**。

组件允许我们将UI拆分成独立可复用的代码片段，并对每个片段进行独立的构思。

因此，除了前面提到的普适的性能优化手段之外，React还有一些充满自身特色的性能优化手段。

不过这些“手段”基本都围绕**组件性能优化**展开。下面介绍一下三个关键思路：

1. 使用 shouldComponentUpdate 规避冗余的更新逻辑。
2. PureComponent + Immutable.js。
3. React.memo 与 useMemo。

> 注：这 3 个思路同时也是 React 面试中“性能优化”这一环的核心所在。大家在回答类似题目的时候，不管其他的细枝末节的优化策略能不能想起来，以上三点一定要尽量答全。



#### 朴素思路：善用shouldComponentUpdate

shouldComponentUpdate是React类组件的一个生命周期。其调用形式如下：

```JavaScript
shouldComponentUpdate(nextProps, nextState){
    
}

```

render 方法由于伴随着对虚拟 DOM 的构建和对比，过程可以说相当耗时。而在 React 当中，很多时候我们会不经意间就频繁地调用了 render。为了避免不必要的 render 操作带来的性能开销，React 提供了 shouldComponentUpdate 这个口子。**React 组件会根据 shouldComponentUpdate 的返回值，来决定是否执行该方法之后的生命周期，进而决定是否对组件进行 re-render（重渲染）**。

shouldComponentUpdate 的默认值为 true，也就是说 **“无条件 re-render”**。在实际的开发中，我们往往通过手动往 shouldComponentUpdate 中填充判定逻辑，来实现“有条件的 re-render”。

接下来我们通过一个 Demo，来感受一下 shouldComponentUpdate 到底是如何解决问题的。在这个 Demo 中会涉及 3 个组件：子组件 ChildA、ChildB 及父组件 App 组件。



#### Component 和PureComponent的区别？

如果不实现shouldComponentUpdate函数，那么有两种情况会触发重新渲染流程

1. 当state发生改变时。
2. 当父组件发生重新渲染时，无论传入的Props是否发生变化，都会引发子组件的重新渲染。





PureComponent的核心原理就是默认实现了shouldComponentUpdate函数，在这个函数中对props和state进行浅比较，用于判断是否触发更新。

但是这种浅比较还是不可靠的。

那么怎么办呢？需要Immutable.js来帮忙！

```JavaScript
shouldComponentUpdate(nextProps, nextState) {

  // 浅比较仅比较对象第一层的值与引用，并不会对 Object 进行深层对比，所以基于浅比较判断逻辑是不可靠的，主要有两个风险
    // ①若数据内容没变，但是引用变了，那么浅比较仍然会认为“数据发生了变化”，进而触发一次不必要的更新，导致过度渲染；
// ② 若数据内容变了，但是引用没变，那么浅比较则会认为“数据没有发生变化”，进而阻断一次更新，导致不渲染
  if (!shadowEqual(nextProps, this.props) || !shadowEqual(nextState, this.state) ) {

    return false

  }

  return true

}

```

```JavaScript
// 引入 immutable 库里的 Map 对象，它用于创建对象

import { Map } from 'immutable'

// 初始化一个对象 baseMap

const baseMap = Map({

  name: '修言',

  career: '前端',

  age: 99

})

// 使用 immutable 暴露的 Api 来修改 baseMap 的内容

const changedMap = baseMap.set({

  age: 100

})

// 我们会发现修改 baseMap 后将会返回一个新的对象，这个对象的引用和 baseMap 是不同的

console.log('baseMap === changedMap', baseMap === changedMap)

```

而Component是需要手动编写shouldComponentUpdate中的逻辑的。











#### 函数组件的性能优化： React.memo 和useMemo

函数组件任何情况下都会重新渲染。函数组件没有生命周期，但官方提供了一种优化方式：React.memo。

##### React.memo相当于“函数版”的shouldComponentUpdate/PureComponent

React.memo是React导出的一个顶层函数，他的本质是一个高阶组件。负责对函数组件进行包装。

基本调用姿势如下：

```JavaScript
import React from "react";

// 定义一个函数组件

function FunctionDemo(props) {

  return xxx

}

// areEqual 函数是 memo 的第二个入参，我们之前放在 shouldComponentUpdate 里面的逻辑就可以转移至此处

function areEqual(prevProps, nextProps) {

  /*

  return true if passing nextProps to render would return

  the same result as passing prevProps to render,

  otherwise return false

  */
    意思是如果前后两个props render生成的结果一样（两个props一样）就返回true，否则返回false

}

// 使用 React.memo 来包装函数组件

export default React.memo(FunctionDemo, areEqual);

```

**React.memo 会帮我们“记住”函数组件的渲染结果，在组件前后两次 props 对比结果一致的情况下，它会直接复用最近一次渲染的结果**。如果我们的组件在相同的 props 下会渲染相同的结果，那么使用 React.memo 来包装它将是个不错的选择。

上面的areEqual这个函数不是必传参数，如果不传的话，**React.memo 也可以工作，此时它的作用就类似于 PureComponent——React.memo 会自动为你的组件执行 props 的浅比较逻辑**。

和 shouldComponentUpdate 不同的是，React.memo 只负责对比 props，而不会去感知组件内部状态（state）的变化。（意思是组件内有useState的话，state变化会被忽略），但是如果有useContext的话，如果context变化，组件还是会重新渲染的。



#### useMemo：更加“精细”的memo

通过上面的分析我们知道，React.memo 可以实现类似于 shouldComponentUpdate 或者 PureComponent 的效果，对组件级别的 re-render 进行管控。但是有时候，我们希望复用的并不是整个组件，而是**组件中的某一个或几个部分**。这种更加“精细化”的管控，就需要 useMemo 来帮忙了。

**简而言之，React.memo 控制是否需要重渲染一个组件，而 useMemo 控制的则是是否需要重复执行某一段逻辑**。

useMemo的使用方式：

```JavaScript
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);

```

我们可以把目标逻辑当做第一个参数传入，把逻辑的依赖项数组当做第二个参数传入。这样只有当依赖项数组中的某个依赖发生变化的时候，useMemo才会重新执行第一个入参中的函数（目标逻辑）。