深入浅出JSBridge：从原理到使用

## 一、前言

在如今移动端盛行的年代，技术选型上基本都是混合开发（**Hybrid**），混合开发是一种开发模式，指使用多种开发模型开发App，通常会涉及到两大类技术：原生**Native**、**Web H5**

- 原生技术主要指iOS（Objective C）、Android（Java），原生**开发效率较低**，开发完成需要重新打包整个App，发布依赖用户的更新，**性能较高功能覆盖率更高**
- Web H5主要由HTML、CSS、JavaScript组成，Web可以更好的实现发布更新，跨平台也更加优秀，但性能较低，特性也受限

混合开发的意义就在于吸取两者的优点，而且随着手机硬件的升级迭代、系统（Android 5.0+、ISO 9.0+）对于Web特性的较好支持，H5的劣势被逐渐缩小

混合开发按照渲染可分为下类：

- Web渲染的混合App（Codova、NativeScript）：在webView中运行JS代码
- 原生渲染的混合App（ReactNative、Weex）：将JS代码转换成原生APP的代码，在APP中运行
- 小程序

其中的原生、Web相互通信都离不开**JSBridge**，这里面小程序比较特殊，对于UI渲染和JS的执行环境做了隔离，基于前两种方式之间。

## 二、JSBridge做了些什么？

在Hybrid模式下，H5会经常需要使用Native的功能，比如打开二维码扫描、调用原生页面、获取用户信息等，同时Native也需要向Web端发送推送、更新状态等，而JavaScript是运行在单独的**JS Context**中（Webview容器、JSCore等），与原生有运行环境的隔离，所以需要有一种机制实现Native端和Web端的**双向通信**，这就是JSBridge：以JavaScript引擎或Webview容器作为媒介，通过协定协议进行通信，实现Native端和Web端双向通信的一种机制。

通过JSBridge，Web端可以调用Native端的Java接口，同样Native端也可以通过JSBridge调用Web端的JavaScript接口，实现彼此的双向调用

![img](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b8d61bad7aa04e66ae316f675a4cd953~tplv-k3u1fbpfcp-watermark.image)

## 三、WebView

首先了解下webView，webView是移动端提供的运行JavaScript的环境，是系统渲染Web网页的一个控件，可与页面JavaScript交互，实现混合开发，其中Android和iOS又有些不同：

Android的WebView采用的是低版本和高版本使用了不同的`webkit`内核，4.4后直接使用了`Chrome`。

iOS中`UIWebView`算是自IOS2就有，但性能较差，特性支持较差，`WKWebView`是iOS8之后的升级版，性能更强特性支持也较好。

WebView控件除了能加载指定的url外，还可以对URL请求、JavaScript的对话框、加载进度、页面交互进行强大的处理，之后会提到拦截请求、执行JS脚本都依赖于此。

## 四、JSB实现原理

Web端和Native可以类比于Client/Server模式，Web端调用原生接口时就如同Client向Server端发送一个请求类似，JSB在此充当类似于HTTP协议的角色，实现JSBridge主要是两点：

1. 将Native端原生接口封装成JavaScript接口
2. 将Web端JavaScript接口封装成原生接口



### 4.1 Native->Web

首先来说Native端调用Web端，这个比较简单，JavaScript作为解释性语言，最大的一个特性就是可以随时随地地通过解释器执行一段JS代码，所以可以将拼接的JavaScript代码字符串，传入JS解析器执行就可以，JS解析器在这里就是webView。

Android 4.4之前只能用**loadUrl**来实现，并且无法执行回调：

```java
String jsCode = String.format("window.showWebDialog('%s')", text);
webView.loadUrl("javascript: " + jsCode);
```

Android 4.4之后提供了**evaluateJavascript**来执行JS代码，并且可以获取返回值执行回调：

```java
String jsCode = String.format("window.showWebDialog('%s')", text);
webView.evaluateJavascript(jsCode, new ValueCallback<String>() {
  @Override
  public void onReceiveValue(String value) {

  }
});

```

iOS的UIWebView使用**stringByEvaluatingJavaScriptFromString**：

```objective-c
NSString *jsStr = @"执行的JS代码";
[webView stringByEvaluatingJavaScriptFromString:jsStr];
```

iOS的WKWebView使用**evaluateJavaScript**：

```objective-c
[webView evaluateJavaScript:@"执行的JS代码" completionHandler:^(id _Nullable response, NSError * _Nullable error) {
  
}];
```



### 4.2 Web->Native

Web调用Native端主要有两种方式



#### 4.2.1 拦截Webview请求的URL Schema

URL Schema是类URL的一种请求格式，格式如下：

```http
<protocol>://<host>/<path>?<qeury>#fragment
```

我们可以自定义JSBridge通信的URL Schema，比如：`jsbridge://showToast?text=hello`

Native加载WebView之后，Web发送的所有请求都会经过WebView组件，所以Native可以重写WebView里的方法，从来**拦截Web发起的请求**，我们对请求的格式进行判断：

- 如果符合我们自定义的URL Schema，对URL进行解析，拿到相关操作、操作，进而调用原生Native的方法
- 如果不符合我们自定义的URL Schema，我们直接转发，请求真正的服务

![img](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9a72777241094ad2b45d5e3b58a17fe1~tplv-k3u1fbpfcp-watermark.image)

Web发送URL请求的方法有这么几种：

1. `a`标签
2. `location.href`
3. 使用`iframe.src`
4. 发送`ajax`请求

这些方法，`a`标签需要用户操作，`location.href`可能会引起页面的跳转丢失调用，发送`ajax`请求Android没有相应的拦截方法，所以使用`iframe.src`是经常会使用的方案：

- 安卓提供了shouldOverrideUrlLoading方法拦截
- UIWebView使用shouldStartLoadWithRequest，WKWebView则使用decidePolicyForNavigationAction

这种方式从早期就存在，**兼容性很好**，但是由于是基于URL的方式，**长度受到限制而且不太直观**，**数据格式有限制，而且建立请求有时间耗时**。

#### 4.2.2 向Webview中注入JS API

这个方法会通过webView提供的接口，App将Native的相关接口注入到JS的Context（window）的对象中，一般来说这个对象内的方法名与Native相关方法名是相同的，Web端就可以直接在全局**window**下使用这个暴露的全局JS对象，进而调用原生端的方法。

这个过程会更加简单直观，不过有兼容性问题，大多数情况下都会使用这种方式

Android（4.2+）提供了**addJavascriptInterface**注入：

```java
// 注入全局JS对象
webView.addJavascriptInterface(new NativeBridge(this), "NativeBridge");

class NativeBridge {
  private Context ctx;
  NativeBridge(Context ctx) {
    this.ctx = ctx;
  }

  // 增加JS调用接口
  @JavascriptInterface
  public void showNativeDialog(String text) {
    new AlertDialog.Builder(ctx).setMessage(text).create().show();
  }
}
```

在Web端直接调用这个方法即可：

```javascript
window.NativeBridge.showNativeDialog('hello');
```

iOS的UIWebView提供了**JavaSciptCore**

iOS的WKWebView提供了**WKScriptMessageHandler**

## 4.3 带回调的调用

上面已经说到了Native、Web间双向通信的两种方法，但站在一端而言还是一个单向通信的过程 ，比如站在Web的角度：Web调用Native的方法，Native直接相关操作但无法将结果返回给Web，但实际使用中会经常需要将操作的结果返回，也就是JS回调。

所以在对端操作并返回结果，有输入有输出才是完整的调用，那如何实现呢？

其实基于之前的单向通信就可以实现，我们在一端调用的时候在参数中加一个**callbackId**标记对应的回调，对端接收到调用请求后，进行实际操作，如果带有callbackId，对端再进行一次调用，将结果、callbackId回传回来，这端根据callbackId匹配相应的回调，将结果传入执行就可以了。

![img](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/803aa3e5ec4a412684a289aa24666834~tplv-k3u1fbpfcp-watermark.image)

可以看到实际上还是通过**两次单项通信**实现的。

以Android，在Web端实现带有回调的JSB调用为例：

```html
// Web端代码：
<body>
  <div>
    <button id="showBtn">获取Native输入，以Web弹窗展现</button>
  </div>
</body>
<script>
  let id = 1;
  // 根据id保存callback
  const callbackMap = {};
  // 使用JSSDK封装调用与Native通信的事件，避免过多的污染全局环境
  window.JSSDK = {
    // 获取Native端输入框value，带有回调
    getNativeEditTextValue(callback) {
      const callbackId = id++;
      callbackMap[callbackId] = callback;
      // 调用JSB方法，并将callbackId传入
      window.NativeBridge.getNativeEditTextValue(callbackId);
    },
    // 接收Native端传来的callbackId
    receiveMessage(callbackId, value) {
      if (callbackMap[callbackId]) {
        // 根据ID匹配callback，并执行
        callbackMap[callbackId](value);
      }
    }
  };

	const showBtn = document.querySelector('#showBtn');
  // 绑定按钮事件
  showBtn.addEventListener('click', e => {
    // 通过JSSDK调用，将回调函数传入
    window.JSSDK.getNativeEditTextValue(value => window.alert('Natvie输入值：' + value));
  });
</script>
```

```Java
// Android端代码
webView.addJavascriptInterface(new NativeBridge(this), "NativeBridge");

class NativeBridge {
  private Context ctx;
  NativeBridge(Context ctx) {
    this.ctx = ctx;
  }

  // 获取Native端输入值
  @JavascriptInterface
  public void getNativeEditTextValue(int callbackId) {
    MainActivity mainActivity = (MainActivity)ctx;
    // 获取Native端输入框的value
    String value = mainActivity.editText.getText().toString();
    // 需要注入在Web执行的JS代码
    String jsCode = String.format("window.JSSDK.receiveMessage(%s, '%s')", callbackId, value);
    // 在UI线程中执行
    mainActivity.runOnUiThread(new Runnable() {
      @Override
      public void run() {
        mainActivity.webView.evaluateJavascript(jsCode, null);
      }
    });
  }
}
```



以上代码简单实现了一个demo，在Web端点击按钮，会获取Native端输入框的值，并将值以Web端弹窗展现，这样就实现了Web->Native带有回调的JSB调用，同理Native->Web也是同样的逻辑，不同的只是将callback保存在Native端罢了，在此就不详细论述了。

## 五、开源的JSBridge

可以看到，实现一个完整的JSBridge还是挺麻烦的，还需要考虑低端机型的兼容问题、同步异步调用问题，好在已经有开源的JSBridge供我们直接使用了：

- DSBridge，主要通过注入API的形式，[DSBridge for Android](https://github.com/wendux/DSBridge-Android)、[DSBridge for IOS](https://github.com/wendux/DSBridge-IOS)
- JsBridge，主要通过拦截URL Schema，[JsBridge](https://github.com/lzyzsd/JsBridge)

以`DSBridge-Android`为例：

```html
// Web端代码
<body>
  <div>
    <button id="showBtn">获取Native输入，以Web弹窗展现</button>
  </div>
</body>
// 引入SDK 这一步是必须的（因为要实现有回调的调用）
<script src="https://unpkg.com/dsbridge@3.1.3/dist/dsbridge.js"></script>
<script>
  const showBtn = document.querySelector('#showBtn');
  showBtn.addEventListener('click', e => {
    // 注意，这里代码不同：SDK在全局注册了dsBridge，通过call调用Native方法
    dsBridge.call('getNativeEditTextValue', '', value => {
      window.alert('Native输入值' + value);
    })
  });
</script>
复制代码

```

```java
// Android代码
// 使用dwebView替换原生webView
dwebView.addJavascriptObject(new JsApi(), null);

class JSApi {
  private Context ctx;
  public JSApi (Context ctx) {
    this.ctx = ctx;
  }

  @JavascriptInterface
  public void getNativeEditTextValue(Object msg, CompletionHandler<String> handler) {
    String value = ((MainActivity)ctx).editText.getText().toString();
    // 通过handler将value传给Web端，实现回调的JSB调用
    handler.completed(value);
  }
}
```

可以看到，代码被精简了很多，其它更多使用直接看文档就可以

## 六、Summary

至此，大家应该对JSBridge的原理、使用有了一个比较深入的认知，这里对文章做一个总结：

Hybrid开发是目前移动端开发的主流技术选项，其中Native和Web端的双向通信就离不开**JSBridge**。

其中Native调用Web端是直接在JS的Context直接执行JS代码，

Web端调用Native端有两种方法，

一种是基于**URL Schema**的拦截操作，

另一种是向JS的Context（window）注入Api，其中注入Api是目前最好的选择。

完整的调用是双向通信，需要一个回调函数，技术实现上就是使用了两次单向通信

其次，相对于造轮子，更推荐使用目前已经开源的JSBridge：DSBridge、jsBridge。

参考链接：

- [iOS OC与JS交互](https://www.jianshu.com/p/a0004a75deb3?from=groupmessage)
- [移动端混合开发入门](https://www.imooc.com/learn/1176)
- [Android WebView基本用法](https://www.runoob.com/w3cnote/android-tutorial-webview.html)



### JSBridge的实现：

https://blog.csdn.net/yuzhengfei7/article/details/93468914

https://juejin.cn/post/6936814903021797389



