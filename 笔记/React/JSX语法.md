在使用react的时候，我们经常会使用的JSX语法。

```javascript
import React from 'react';
const ele = <h1> hello world </h1>;
```

这种标签语法既不是字符串也不是HTML，它是一种javascript的语法扩展，称为JSX。JSX可以很直观的描述UI应该有的交互形式。但是这种写法显然不符合传统的javascript语言标准，那么它又是如何畅快的运行于JS之中的呢？

原来**Babel**会将JSX转译成一个名为`React.createElement()`的函数调用。

所以当你看到这行代码时：

```javascript
const ele = (
<h1 className="greeting" > 
    hello, world!
</h1>
);

```

实际上它在运行的时候是这样的：

```javascript
const ele = React.createElement(
'h1',
 {
     className: 'greeting'
 },
 'hello, world!'   
);
```

正亦如此，我们在写JSX的时候，必须要引入react。

React.createElement接受三个参数，标签名，属性对象，子节点。

得到的结果ele是这样的

```javascript
{
    $$typeof: Symbol(react.element),
    key: null,
    props:{
        children: "Hello, world!",
        className: "greeting",
    },
    __proto__: Object,
    ref: null,
    type: "h1",
    _owner: null,
    __proto__: Object,
}
```

ele 是一个对象，这里面包含了一个react 元素的所有信息，主要的有：

1. type： 这是个什么元素对应哪个HTML标签；
2. ref： 元素的Dom引用或者组件实例的引用；
3. props： 元素的相关属性，包括属性名和子节点的信息；
4. key： 用于react-dom的优化；

所以当我们看到

```javascript
import React from 'react';
import ReactDom from 'react-dom';
const ele = <h1> hello world! </h1>;
ReactDom.render(ele, document.getElementById('app'));
```

我们要知道其实传递给render函数的就是这个ele对象，然后通过这个render方法在id为app的根节点里面生成基于ele对象的DOM树。

