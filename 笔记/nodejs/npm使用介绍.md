### cli：


### 本地安装 
```
npm install 
```
### 全局安装

```
npm install -g
```
### 卸载模块
以express为例
```
npm uninstall express
```

### 更新模块
```
npm update express
```
### 搜索模块
```
npm search express
```

### 在npm资源库中注册用户
```
npm adduser
```
### 发布模块
```
npm publish
```

修改npm的源, 之后的下载就从这个源下载
```shell script
// taobao 的源
npm config set registry https://registry.npm.taobao.org
```
查看源
```shell script
npm config get registry
```

如果只是想修改某一次下载的源，可以将registry作为参数传入
```shell script
npm --registry https://registry.npm.taobao.org install express
```
表示这次从淘宝的源下载express
