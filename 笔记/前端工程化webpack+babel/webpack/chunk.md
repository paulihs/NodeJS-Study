### chunk

https://webpack.docschina.org/concepts/under-the-hood/

chunk有两种形式：

1. initial（初始化）是入口起点的main chunk。初始化起点生成的chunk由entry配置决定。包含入口起点指定的所有模块及其依赖项。

2. 还有一种是延迟加载的模块。这在动态导入（import()），或者splitChunkPlugin时会出现。

每个chunk都有对应的资源（asset）。这里的资源就是指输出的文件（打包结果）



 **webpack.config.js**

```JavaScript
module.exports = {
  entry: './src/index.jsx',
};
```

**./src/index.jsx**

```JavaScript
import React from 'react';
import ReactDOM from 'react-dom';

import('./app.jsx').then((App) => {
  ReactDOM.render(<App />, root);
});
```

这里会生成一个名为main的initial chunk。其中包含：

- `./src/index.jsx`
- `react`
- `react-dom`

以及除了`./app.jsx`外的所有依赖。

然后会为`./app.jsx`创建一个non-initial chunk,这是因为`./app.jsx`是动态引入的。

**
Output:**

- `/dist/main.js` - 一个 `initial` chunk
- `/dist/394.js` - `non-initial` chunk

默认情况下，这些 `non-initial` chunk 没有名称，因此会使用唯一 ID 来替代名称。 在使用动态导入时，我们可以通过使用 [magic comment(魔术注释)](https://webpack.docschina.org/api/module-methods/#magic-comments) 来显式指定 chunk 名称：

```js
import(
  /* webpackChunkName: "app" */
  './app.jsx'
).then((App) => {
  ReactDOM.render(<App />, root);
});
```

**Output:**

- `/dist/main.js` - 一个 `initial` chunk
- `/dist/app.js` - `non-initial` chunk

## output(输出) 

输出文件的名称会受配置中的两个字段的影响：

- [`output.filename`](https://webpack.docschina.org/configuration/output/#outputfilename) - 用于 `initial` chunk 文件
- [`output.chunkFilename`](https://webpack.docschina.org/configuration/output/#outputchunkfilename) - 用于 `non-initial` chunk 文件
- 在某些情况下，使用 `initial` 和 `non-initial` 的 chunk 时，可以使用 `output.filename`。

这些字段中会有一些 [占位符](https://webpack.docschina.org/configuration/output/#template-strings)。常用的占位符如下：

- `[id]` - chunk id（例如 `[id].js` -> `485.js`）
- `[name]` - chunk name（例如 `[name].js` -> `app.js`）。如果 chunk 没有名称，则会使用其 id 作为名称
- `[contenthash]` - 输出文件内容的 md4-hash（例如 `[contenthash].js` -> `4ea6ff1de66c537eb9b2.js`）

