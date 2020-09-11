# 安装webpack
## 安装最新或者指定版本：
```
npm install --save-dev webpack
npm install --save-dev webpack@<version>
```

`webpack.config.js`是webpack的默认配置文件，不需要额外指定。当然，如果我们想指定一个文件作为webpack的配置文件的话，可以使用`--config` 指定配置文件的名称。 

`webpack-cli` 是webpack的命令行工具，它允许我们在终端中使用webpack的命令。当然是依靠 `npx webpack ...`的方式，直接在命令行中使用`webpack`命令是没办法被识别的。

