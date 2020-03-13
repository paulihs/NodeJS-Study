## node.js 的特点
1. 事件驱动非阻塞模型。
2. 单线程的编程模型。

## 核心模块

### 文件系统


### Node模块的引入
`nodejs`中，通过`require`引入模块，`require`接受一个路径作为参数，返回一个对象。这个过程是**同步的**。`Node`查找文件的顺序是先找**核心模块**，然后是**当前模块**，最后是`node_modules`。


### module.export和exports的关系
如果在一个模块内同时出现`module.export`和`exports`，那么该模块会输出`module.export`而忽略`exports`。`exports`相当于`module.export`的一个引用，默认输出一个空对象。可以将`exports.lele`看做`module.export.lele`的简写。将`exports`设置为其他值会切断其余`module.export`的联系。所以千万别这么做！

```javascript
function lele(){}
exports = lele; // 错误，Node不允许重写exports
```
### 使用`node_modules`重用模块的规则
如果在require(path)中path是相对路径，那么node就会去对应的路径去找模块。如果不是相对路径，那么node就会从该程序文件的同一目录下查找，查找规则如下：
先看是不是核心模块，是的话直接返回模块。不是就看模块在不在当前目录下的node_modules中，在的话直接返回，不在的话尝试进入父目录，存在的话去父目录下的node_modules中找，不存在父目录的话去环境变量NODE_PATH指定的目录下找，找不到的话就抛出异常。

### 注意事项
require(path)中，path如果没有指定文件，只是一个目录的话，要么在这个目录下定义模块的文件被命名为`index.js`，要么目录下有`package.json`文件，在文件中有个`main`字段指定取代`index.js`的文件。
这个规则是这样的：
先看有没有`package.json`，有的话再看里面`main`字段有没有指定文件，`main`指定了文件且存在就返回对应的模块，`main`指定的文件不存在就报错。假如没有`main`字段那就看目录下面有没有`index.js`，有的话就返回`index.js`里面的模块，没有就报错。

node会将模块作为**对象缓存起来**，如果两个文件引用相同的模块，那么他们引用的是同一个对象。

