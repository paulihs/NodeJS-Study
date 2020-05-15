react-dom主要作用是通过render方法，将传递过来的对象转变为dom树，塞入根节点。但他不仅仅提供了render方法。

react-dom提供了如下几个方法：

1. render()
2. hydrate()
3. unmountComponentAtNode()
4. findDOMNode()
5. createPortal()

### render()

```javascript
ReactDOM.render(element, container[, callback])
```

render 方法 在container中渲染react元素element，通常情况下这个element元素就是通过JSX语法描绘的DOM。比如：

```javascript
import React from 'react';
import ReactDom from 'react-dom';
const element = <div className='hello'> 你好 </div>;

ReactDom.render(element, container, callback);
```

实际上babel会将JSX语法转译为React.createElement(),所以上面这段代码和下面这个是等价的

```javascript
import React from 'react';
import ReactDom from 'react-dom';
const element = React.createElement('div',{
    className: 'hello',
}, '你好')
```

此时element是一个对象，然后再由render方法将element所描绘的dom在container中生成。callback是一个可选参数，将会在element被渲染或更新之后被执行。

注意：render方法首次调用时，container中所以的子节点都会被替换。后续的调用则会使用react的DOM diff算法 针对前后两次传入的react元素差异，进行高效的更新。