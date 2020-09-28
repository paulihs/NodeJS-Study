#### Asset Management

在webpack出现之前，前端工程师使用grunt和gulp去处理css img 字体等资源，将它们从src打包到dist或者build文件夹，JavaScript模块也使用了相同的想法。但是webpack之类的工具动态的打包了所有的依赖项，生成所谓的依赖图来描述各个模块之间的引用关系。这是很好的方式，每个模块都明确的声明他的依赖项，可以避免打包一些没有使用到的模块。

事实上，webpack只能处理JavaScript，它只认识JavaScript代码，那么webpack是如何处理其他类型的文件的呢？答案是**loader**！

loader让webpack拥有处理其他类型文件的能力，不管是css还是image、字体，都有对应的loader处理它，只要在配置项中给需要处理的文件类型添加相应的配置，并安装对应的loader即可。

###### 我们先从加载css开始...

为了能够在JS模块中通过import引入css，我们需要安装`style-loader`和`css-loader`，并把style-loader和css-loader添加到webpack配置文件中。

我们知道webpack的默认配置文件名叫**webpack.config.js**

这里就是要默认的配置文件名。注意：默认配置文件和package.json是在同一级目录。

**webpack.config.js**

```json
  const path = require('path');

  module.exports = {
    entry: './src/index.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
   module: {
     rules: [
       {
         test: /\.css$/,
         use: [
           'style-loader',
           'css-loader',
         ],
       },
     ],
   },
  };
```

