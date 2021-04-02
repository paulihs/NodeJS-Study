### plugin

插件是webpack的支柱功能。





clean-webpack-plugin

html-webpack-plugin

# **[webpack-manifest-plugin](https://github.com/danethurber/webpack-manifest-plugin)**

[`mini-css-extract-plugin`](https://webpack.js.org/plugins/mini-css-extract-plugin)：





#### 开发一个插件

相比于Loader，插件的能力范围更宽，因为loader只是在模块加载环节工作，而插件的工作范围几乎可以触及webpack工作的每个环节

那么，这种插件机制是如何实现的呢？

其实说起来也非常简单，Webpack 的插件机制就是我们在软件开发中最常见的钩子机制。

钩子机制也特别容易理解，它有点类似于 Web 中的事件。在 Webpack 整个工作过程会有很多环节，为了便于插件的扩展，Webpack 几乎在每一个环节都埋下了一个钩子。这样我们在开发插件的时候，通过往这些不同节点上挂载不同的任务，就可以轻松扩展 Webpack 的能力。





webpack要求我们的插件必须是一个函数或者是一个包含apply方法的对象。