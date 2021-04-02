#### loader

webpack想要实现整个前端项目的模块化，那么项目中的各种资源都应该属于被管理的模块。换句话说webpack不能仅仅是JavaScript模块打包器，更应该是整个前端项目（前端工程）的模块打包工具。就是说我们可以通过webpack去管理前端项目中任意类型的资源文件。

但是webpack 本身只能理解JavaScript和JSON文件，通过loader，webpack有了处理其他类型文件的能力，比如`.css`文件



常见的loader有哪些，你用过哪些？

TODO



#### 说一说Loader和Plugin的区别？

Loader本质是个函数，从webpack解析入口文件开始，找到其导入的依赖模块，递归遍历分析，形成依赖关系图。

Loader是用来处理非JavaScript或JSON文件的，这个非JS文件，用过loader的处理最终会转化为JavaScript文件（代码）。

在这个过程中，Loader充当的是翻译官的作用。

plugin就是插件，插件可以拓展Webpack的功能，在webpack运行的生命周期中会广播出许多事件，Plugin可以监听这些事件，在适合的时机通过webpack提供的API改变输出结果。

loader在module.rules中配置，作为模块的解析规则。

plugin在plugins中单独配置，类型为数组，每一项是一个Plugin的实例。



##### 如何开发一个loader？

loader本质上是导出为函数的JavaScript模块。loader runner会调用这个函数，然后将上一个loader产生的结果或者资源文件传入进去。函数中的this作为上下文被webpack填充。并且loader runner中包含一些实用的方法。

起始loader只有一个入参：资源文件的内容。compiler预期得到最后一个loader产生的处理结果。这个结果应该是String或者Buffer（能够被转换为string）类型，代表了模块的JavaScript源码（所以这个字符串里面的代码必须是合法的JavaScript语句）。



#### 同步Loaders

无论是return还是this.callback都可以同步的返回转换后的content值：

**sync-loader.js**

```JavaScript
module.exports = function (content, map, meta) {
  return someSyncOperation(content);
};
```

this.callback方法则更加灵活，因为它允许传递多个参数，而不仅仅是content。

**sync-loader-with-multiple-result.js**

```JavaScript
module.exports = function (content, map, meta) {
  this.callback(null, someSyncOperation(content), map, meta);
  return; // 当调用 callback() 函数时，总是返回 undefined
};
```



#### 异步Loaders

对于异步loader，使用**this.async**来获取callback函数：

async-loader.js

```JavaScript
module.exports = function (content, map, meta) {
  var callback = this.async();
  someAsyncOperation(content, function (err, result) {
    if (err) return callback(err);
    callback(null, result, map, meta);
  });
};
```

**async-loader-with-multiple.results.js**

```JavaScript
module.exports = function (content, map, meta) {
  var callback = this.async();
  someAsyncOperation(content, function (err, result, sourceMaps, meta) {
    if (err) return callback(err);
    callback(null, result, sourceMaps, meta);
  });
};
```



#### Loader Context

loader context表示在loader内使用this可以访问的一些方法或者属性。

**this.version**

表示loader API的版本号，目前是2。这对于向后兼容性有一些用处。通过这个版本号，你可以自定义逻辑或者降级处理。



**this.context**

