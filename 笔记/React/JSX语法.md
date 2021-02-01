# JSX是如何变成DOM的？

在使用react的时候，我们经常会使用的JSX语法。

```javascript
import React from 'react';
const ele = <h1> hello world </h1>;
```

这种标签语法既不是字符串也不是HTML，它是一种**javascript的语法扩展**，称为**JSX**。**JSX**可以很直观的描述UI应该有的交互形式。但是这种写法显然不符合传统的javascript语言标准，那么它又是如何畅快的运行于JS之中的呢？

#### Babel

JSX会被编译为React.createElement()，React.createElement()会返回被称为‘React Element’的JS对象，JSX就是通过这种方式在JS中生效的。

Babel 是一个工具链，主要用于将 ECMAScript 2015+ 版本的代码转换为向后兼容的 JavaScript 语法，以便能够运行在当前和旧版本的浏览器或其他环境中。

#### ES6：

```JavaScript
var name = "Guy Fieri";

var place = "Flavortown";

`Hello ${name}, ready for ${place}?`;

```

#### ES5：

```JavaScript
var name = "Guy Fieri";

var place = "Flavortown";

"Hello ".concat(name, ", ready for ").concat(place, "?");

```

类似的，**Babel 也具备将 JSX 语法转换为 JavaScript 代码的能力**。

当你看到这行代码时

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
// node type    
'h1',
// props    
 {
     className: 'greeting'
 },
    // children
 'hello, world!'   
);
```



React选用JSX语法去描述UI的原因：

要描绘相同的UI界面时，JSX语法相比于直接调用React.createElement()，具有代码层次分明，嵌套关系清晰等特点。而React.createElement()代码给人一种复杂冗长的感觉 ，代码不仅可读性差，写起来也很费劲。

**JSX 语法糖允许前端开发者使用我们最为熟悉的类 HTML 标签语法来创建虚拟 DOM，在降低学习成本的同时，也提升了研发效率与研发体验。**



### JSX是如何创建虚拟DOM: React.createElement()

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

正因如此，**我们在写JSX的时候，必须要引入react**。

像ele这样通过React.createElement()创建的对象，我们称之为 **React元素**

那么我们来看看React.createElement()做了哪些事情？

```JavaScript
/**

 React的创建元素方法

 */

/**
 type： 节点类型。可以是像‘h1’ ‘div’ 这样的HTML标签字符串，也可以是React组件类型或者React fragment类型
 config： props对象
 children： 子节点
*/

export function createElement(type, config, children) {

  // propName 变量用于储存后面需要用到的元素属性

  let propName; 

  // props 变量用于储存元素属性的键值对集合

  const props = {}; 

  // key、ref、self、source 均为 React 元素的属性，此处不必深究

  let key = null;

  let ref = null; 

  let self = null; 

  let source = null; 

  // config 对象中存储的是元素的属性

  if (config != null) { 

    // 进来之后做的第一件事，是依次对 ref、key、self 和 source 属性赋值

    if (hasValidRef(config)) {

      ref = config.ref;

    }

    // 此处将 key 值字符串化

    if (hasValidKey(config)) {

      key = '' + config.key; 

    }

    self = config.__self === undefined ? null : config.__self;

    source = config.__source === undefined ? null : config.__source;

    // 接着就是要把 config 里面的属性都一个一个挪到 props 这个之前声明好的对象里面

    for (propName in config) {

      if (

        // 筛选出可以提进 props 对象里的属性

        hasOwnProperty.call(config, propName) &&  

        !RESERVED_PROPS.hasOwnProperty(propName) 

      ) {
        props[propName] = config[propName]; 
      }

    }

  }

  // childrenLength 指的是当前元素的子元素的个数，减去的 2 是 type 和 config 两个参数占用的长度

  const childrenLength = arguments.length - 2; 

  // 如果抛去type和config，就只剩下一个参数，一般意味着文本节点出现了

  if (childrenLength === 1) { 

    // 直接把这个参数的值赋给props.children

    props.children = children; 

    // 处理嵌套多个子元素的情况

  } else if (childrenLength > 1) { 

    // 声明一个子元素数组

    const childArray = Array(childrenLength); 

    // 把子元素推进数组里

    for (let i = 0; i < childrenLength; i++) { 

      childArray[i] = arguments[i + 2];

    }

    // 最后把这个数组赋值给props.children

    props.children = childArray; 

  } 

  // 处理 defaultProps

  if (type && type.defaultProps) {

    const defaultProps = type.defaultProps;

    for (propName in defaultProps) { 

      if (props[propName] === undefined) {

        props[propName] = defaultProps[propName];

      }

    }

  }

  // 最后返回一个调用ReactElement执行方法，并传入刚才处理过的参数

  return ReactElement(

    type,

    key,

    ref,

    self,

    source,

    ReactCurrentOwner.current,

    props,

  );

}

```

React.createElement接受三个参数，标签名，属性对象，子节点。

如果有多个子元素，会将子元素依次加在第三个参数后面。

ReactElement做的工作就是处理jsx包含的信息，梳理完之后传给ReactElement 创建 react元素（对象）

createElement()执行到最后会return一个针对ReactElement的调用。

```javascript
const ReactElement = function(type, key, ref, self, source, owner, props) {

  const element = {

    // REACT_ELEMENT_TYPE是一个常量，用来标识该对象是一个ReactElement

    $$typeof: REACT_ELEMENT_TYPE,

    // 内置属性赋值

    type: type,

    key: key,

    ref: ref,

    props: props,

    // 记录创造该元素的组件
    _owner: owner,
  };
  // 
  if (__DEV__) {
    // 这里是一些针对 __DEV__ 环境下的处理，对于大家理解主要逻辑意义不大，此处我直接省略掉，以免混淆视听
  }
  return element;
};

```

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



ReactElement对象的本质 是 **以JavaScript对象形式存在的 对DOM的描述**，也就是我们常说的 “虚拟DOM”，或者说是虚拟DOM中的一个节点。

而虚拟DOM变成页面上的真实DOM的这个工作是由 **ReactDOM.render**来完成的。

