### web workers

web workers用于处理页面中的复杂运算。长时间运行JavaScript进程会导致用户界面的冻结。

web workers让JavaScript在后台运行解决了这个问题。

### 使用worker

实例化Worker对象并传入要执行的JavaScript文件名就可以创建一个新的Web Worker。

```JavaScript
let worker = new Worker('stufftodo.js');
```

这行代码会导致浏览器下载stufftodo.js，但是只有当worker接收到消息才会执行文件中的代码。要给Worker传递消息，可以使用postMessage方法。

postMessage方法接受字符串或者对象作为参数。

```JavaScript
worker.postMessage('start');
// 或者 
worker.postMessage({
    type: 'commond',
    message: 'start',
});
```

传入postMessage的值是被复制到worker中的，而不是直接传过去的。可以理解为是被stringify处理过，然后到worker中会被parse。

worker通过message和error事件与页面通信。

```JavaScript
worker.onmessage = function(event){
    let data = event.data;
}
worker.onerror = function(event){
    console.log('error '+event.message);
}
```

##### terminate方法可以停止worker的工作。而且worker中的代码会立即停止执行，后续的所有过程都不会再发生（包括error和message事件也不会触发）