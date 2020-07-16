```javascript
const iframe = document.createElement('iframe');
iframe.src = String(window.location);
document.body.appendChild(iframe);

iframe.contentWindow.Symbol.for('foo') === Symbol.for('foo')
```

上述代码表明iframe中的contentWindow表示iframe中的window对象；

window.location是一个对象，他有一个toString方法，返回对象的href属性。
### postMessage
通过postMessage可以实现父页面和子iFrame之间的通讯。其本质是通过调用目标页面的window对象的postMessage方法并传递参数。然后在目标页面中监听“message”事件。所以本质上是调用window.postMessage方法；触发本window中绑定的message事件。

##### 父页面向子页面传递数据

``````javascript
// 父页面代码
const iframe = document.createElement('iframe');
iframe.src = String('子页面的地址');
document.body.appendChild(iframe);
iframe.contentWindow.postMessage('数据'，'*')
``````

iframe中的代码：

```javascript
window.addEventListener('message',function(e){
console.log(e.data); // '数据'
})
```

##### 子页面向父页面传递数据

````javascript
// 父页面代码
const iframe = document.createElement('iframe');
iframe.src = String('子页面的地址');
document.body.appendChild(iframe);
window.addEventListener('message',function(e){
console.log(e.data); // '数据'
})
````

iframe中的代码

````javascript
window.parent.postMessage('数据','*')
````



### 使用iframe实现web打印功能

通过iframe实现打印是通过设置iframe的src或者window.location.href。加载需要打印的页面。然后调用改iframe的window.print()方法实现打印。

```javascript
export const iframePrint  = {
    create(path){
        let iframe = document.getElementById('print-iframe');
        if(!iframe){
      		iframe = document.createElement('iframe');
            iframe.setAttribute('src', path);
            iframe.setAttribute('id', 'print-iframe');
            iframe.setAttribute('style', 'position: absolute;width:0;height:0;left: -500px; top:-100px, ');
            document.body.appendChild(iframe);
           } else {
             iframe.contentWindow.location.href = path;
           }
        
        
    },
    print(){
        const iframe = document.getElementById('print-iframe');
        if (iframe) {
          iframe.contentWindow.print();
        }
    },
    destroy(){
        const iframe = document.getElementById('print-iframe');
        if (iframe) {
          document.body.removeChild(iframe);
        }
    },
};
```

在具体的中，可以先调用iframePrint.create(path);加载目标页面，等页面加载好了，再调用iframe的print方法。