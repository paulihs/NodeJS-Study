```javascript
const iframe = document.createElement('iframe');
iframe.src = String(window.location);
document.body.appendChild(iframe);

iframe.contentWindow.Symbol.for('foo') === Symbol.for('foo')
```

上述代码表明iframe中的contentWindow表示iframe中的window对象；

window.location是一个对象，他有一个toString方法，返回对象的href属性。