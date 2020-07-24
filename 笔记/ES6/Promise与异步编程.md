### Promise

**promise**是异步编程解决方案，与传统的事件与回调函数相比，promise的写法更优雅更合理，功能也更强大。

```javascript
new Promise((resolve, reject)=>{
    // do something
})
```

```

```

> **Promise**是个构造函数，他的实例是一个**promise**对象。创建**Promise**实例时，会立即执行这个参数函数，并返回一个**promise**对象。这个**promise**对象有三种状态： 进行中`pending`， 已成功`fulfilled` ， 已失败`rejected`。

他的状态变化由构造函数的参数函数的参数触发改变。`resolve`将promise对象的状态变为`fulfilled` reject将状态变为`rejected`，从创建实例开始到被参数方法改变之前，promise对象的状态都是`pending ` 

#### promise对象有两个特点：

1. 状态不受外界影响
2. 状态一旦改变就不会在变了

#### 同时他也有两个缺点：

1. promise对象一旦创建就不可取消
2.  没法知道Promise对象的状态变化进展到哪一步了



### then catch finally

promise对象有三个方法，这三个方法都继承自Promise构造函数的原型对象：

`Promise.prototype.then`

`Promise.prototype.catch`

`Promise.prototype.finally`



promise对象的then方法为他绑定了一个状态变化之后的回调函数，then方法接受两个函数作为参数，当promise对象的状态变为已完成，则会调用then方法的第一个参数，如果状态变成了rejected，则会调用第二个参数。

```javascript
const promise = new Promise((resolve, reject)=>{
    setTimeout(()=>{
        resolve(12)
    }, 5000)
});
promise.then((val)=>{
    console.log(val); // 12
}, (err)=>{
    console.log(err);
});
```

如果状态是已完成，那么resolve的参数就会作为成功回调的参数，也就是val被使用。如果状态是rejected，那么reject()的参数就会被传入err。then方法的第二个参数是可选的。



catch方法是then(null, rejection)或then(undefined, rejection)的别名，用于指定发生错误时候的回调函数。



```JavaScript
const promise = new Promise((resolve, reject)=>{
    setTimeout(()=>{
        resolve(12)
    }, 5000)
});
promise.then((val)=>{
    console.log(val); // 12
});
```

