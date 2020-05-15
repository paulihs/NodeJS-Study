#####emitter.listenerCount(eventName)
eventName: 正在监听的事件名称。（string | symbol）
返回：integer
返回正在监听名为eventName的事件的监听其数量。


### 如何获取命令行传来的参数
node app.js 172 70 
在NodeJS中可以通过process.argv获取命令行参数。但是比较意外的是，
node执行程序路径和主模块文件路径固定占据了argv[0]和argv[1]两个位置
```javascript
var arguments = process.argv.slice(2);
var height = Number(arguments[0]);
var weight = Number(arguments[1]);
```

### process.env 是一个对象，成员为当前shell的环境变量。

cross-env: 它是跨平台设置和使用环境变量的脚本。
它的作用是啥？

当我们使用 NODE_ENV = production 来设置环境变量的时候，大多数windows命令会提示将会阻塞或者异常，或者，windows不支持NODE_ENV=development的这样的设置方式，会报错。因此 cross-env 出现了。我们就可以使用 cross-env命令，这样我们就不必担心平台设置或使用环境变量了。也就是说 cross-env 能够提供一个设置环境变量的scripts，这样我们就能够以unix方式设置环境变量，然而在windows上也能够兼容的。

要使用该命令的话，我们首先需要在我们的项目中进行安装该命令，安装方式如下：
```
npm install --save-dev cross-env
```
然后在package.json中的scripts命令如下如下：

```
"scripts": {
  "dev": "cross-env NODE_ENV=development webpack-dev-server --progress --colors --devtool cheap-module-eval-source-map --hot --inline",
  "build": "cross-env NODE_ENV=production webpack --progress --colors --devtool cheap-module-source-map",
  "build:dll": "webpack --config webpack.dll.config.js"
}
```
