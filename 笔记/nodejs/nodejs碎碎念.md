#####emitter.listenerCount(eventName)
eventName: 正在监听的事件名称。（string | symbol）
返回：integer
返回正在监听名为eventName的事件的监听其数量。


如何获取命令行传来的参数
node app.js 172 70 
在NodeJS中可以通过process.argv获取命令行参数。但是比较意外的是，
node执行程序路径和主模块文件路径固定占据了argv[0]和argv[1]两个位置
```javascript
var arguments = process.argv.slice(2);
var height = Number(arguments[0]);
var weight = Number(arguments[1]);
```
