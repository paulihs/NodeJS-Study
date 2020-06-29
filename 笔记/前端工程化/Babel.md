### 什么是Babel?
Babel是前端开发的重要工具，他是用来将ES2015+的语法编译为目标浏览器支持的语法。Babel本质上是个JavaScript编译器。
下面是babel可以做的事：
 1.  转化句法（syntax）
 2. 将目标浏览器中缺失的新特性添加进去（通过@babel/polyfill）
 
 ### ES2015+：
 Babel对最新版的JavaScript都有支持，不过要通过句法转换去完成。这里要介绍第一个名词：plugins（插件）。
 plugins就是让你不需要等待浏览器支持就可以使用ES2015+的新语法（其实是句法，下面会讲语法和句法的区别），
 那么这是如何做到的呢？就是通过安装对应句法插件。
 
 举个例子：箭头函数
 ```javascript
//  编译前 
[1, 2, 3].map((n) => n + 1);

 // 编译后
[1, 2, 3].map(function(n) {
  return n + 1;
});

```
那么我们是怎么做到的呢？

首先
```
npm init -y
npm i  @babel/cli @babel/core  @babel/plugin-transform-arrow-functions -D
```
创建一个src文件夹，里面新建一个index.js，如下：
```javascript
// ./src/index.js
[1, 2, 3].map((n) => n + 1);
```
 ###### @babel/cli
 @babel/cli 是babel命令行工具，安装了他之后就可以在terminal中使用babel，当然这种使用方式有两种
 1. 使用node_modules中的命令，在terminal中输入 *./node_modules/.bin/babel src --out-dir lib *
 这句话的意思是把src下的文件编译，放到lib文件夹下。
 或者使用npx命令：* npx babel src --out-dir lib*
 2. 在package.json中配置一段脚本命令：
 ```javascript
{
//...
"scripts": {
    "babel-build": "babel src -d lib"
}
}
```
然后运行 *npm run babel-build* 效果是一样的。注意： *--out-dir*可以缩写为 *-d*
但是你执行完命令之后发现lib文件夹下的index.js内容和src下的完全一样，是不是编译没起作用呢？
原来我们只是写了基础命令，没有告诉babel怎么去转换js的语法，那么箭头函数转换需要用到@babel/plugin-transform-arrow-functions
这个插件。
我们需要先安装一下这个插件，然后在把插件添加到命令之中。
```
npm i -D @babel/plugin-transform-arrow-functions
```
然后再运行babel-build命令，就会得到
### 名词解释
