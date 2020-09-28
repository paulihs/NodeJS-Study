# 安装webpack
## 安装最新或者指定版本：
``` shell
npm install --save-dev webpack
npm install --save-dev webpack@<version>
npm install --save-dev webpack-cli
```

`webpack.config.js`是webpack的默认配置文件，不需要额外指定。当然，如果我们想指定一个文件作为webpack的配置文件的话，可以使用`--config` 指定配置文件的名称。 

`webpack-cli` 是webpack的命令行工具，它允许我们在终端中使用webpack的命令。当然是依靠 `npx webpack ...`的方式，直接在命令行中使用`webpack`命令是没办法被识别的。

在使用webpack之前，我们使用`<script>`来引入依赖，比如像`lodash`这样的库。但是这样做有这样的几个弊端：
1. 通过<script>引入lodash库，是把库注册在全局变量‘_’上面，增加了全局变量，同时这种依赖关系不明显
2. 一旦这个script加载资源失败，或者加载的顺序发生错误，程序就会因此出错。
3. 如果在程序中没有用到lodash这个库，那么浏览器就不得不去下载这个没必要的资源。



