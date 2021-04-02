#### Environment选项

webpack命令行 参数 `--env`用于配置环境变量。

通过 `--env`配置环境变量 数量是没有限制的

在webpack.config.js中可以访问到这些环境变量（前提是webpack配置导出为函数时）

```shell
npx webpack --env production --env NODE_ENV=local
```

对于我们的 webpack 配置，有一个必须要修改之处。通常，`module.exports` 指向配置对象。要使用 `env` 变量，你必须将 `module.exports` 转换成一个函数：

**webpack.config.js**

```javascript
const path = require('path');

module.exports = (env) => {
  // Use env.<YOUR VARIABLE> here:
  console.log('NODE_ENV: ', env.NODE_ENV); // 'local'
  console.log('Production: ', env.production); // true

  return {
    entry: './src/index.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
  };
};
T
```



NODE_ENV

我们可以通过 `--node-env`选项来设置 `process.env.NODE_ENV`:

```shell
npx webpack --node-env production  #process.env.NODE_ENV = 'production'
```

在没有明确设置mode的情况下，--node-env 会覆盖mode的值