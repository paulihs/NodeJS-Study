### Cookie

HTTP Cookie，通常称为cookie。**最开始是用于在客户端储存会话信息的，为了弥补HTTP在状态管理上的不足**。

#### 为什么需要cookie呢？

在我们使用web应用的时候，一般都需要使用账户和密码去登陆，这样每个用户的信息数据都是隔离的，使用的服务也互不影响。但是用户登录之后，在页面上的每一次操作所发出的请求，服务端如何知道是刚刚登录的那个用户发出的呢？这时，cookie就派上用场了。在登录请求发出后，服务端在响应中通过设置Set-Cookie 响应头 设置客户端的cookie。在之后的每次请求中都会带上这个cookie一起发送给服务端，服务端就可以从这个cookie中获取到登录用户的信息了。 

> 注意：只有向同一域名发送请求才会带上相应的cookie。



#### cookie的设置方式：

1. 服务器对客户端发送的HTTP请求发送Set-Cookie 作为HTTP响应头的一部分。这样会设置相应的cookie到客户端。
2. 通过document.cookie设置cookie

#### cookie的组成：

cookie是一组一组的键值对，通过=连接。 name=value   name就是名称，value就是值。name和value都必须被URL编码。

这里的URL编码就是把名称和值中的非字母字符进行编码

#### cookie的属性：

一组键值还有一些属性修饰。比如：

- 域(domain)：cookie对那个域有效，向这个域发送请求时会包含这个cookie信息。可以通过`domain=www.baidu.com`来设置。如果没有明确指定的话，那么会默认来自设置cookie的那个域。
- 路径(path)：对于指定域中的那个路径会向服务器发送该cookie，比如你指定path=/book,那么只有向www.baidu.com/book发送请求时才会带上该cookie。
- 失效时间(expires)： 表示cookie何时应该被删除的时间戳。就是过了这个时间，这个cookie就失效了，会被删除，发送请求的时候不会带上这个cookie了
- 安全标志(Secure)：指定后，cookie只有在使用ssl(https)连接的时候才会被发送到服务器。这个ssl连接就是https，通过设置secure字段来指定。
- httponly： 用于限制JavaScript获取cookie，当有这个属性时，cookie只能在发送请求时被用上，不可以通过JS获取到。
- same-site: SameSite属性是用来限制第三方Cookie的。它可以设置三个值： `strict`、`Lax`、`None`。

##### SameSite属性

1. Strict

   Strict最为严格，完全禁止第三方Cookie，跨站点时，任何情况下都不会发送Cookie。换言之，只有当前网页的URL与请求目标完全一致，才会带上Cookie。

   ```bash
   Set-Cookie: CookieName=CookieValue; SameSite=Strict;
   ```

   这个规则过于严格，可能造成非常不好的用户体验。比如，当前网页有一个 GitHub 链接，用户点击跳转就不会带有 GitHub 的 Cookie，跳转过去总是未登陆状态。

2. Lax

   `Lax`规则稍稍放宽，大多数情况也是不发送第三方 Cookie，但是导航到目标网址的 Get 请求除外。

```bash
	Set-Cookie: CookieName=CookieValue; SameSite=Lax;
```

导航到目标网址的 GET 请求，只包括三种情况：链接，预加载请求，GET 表单。详见下表。

| 请求类型  |                 示例                 |    正常情况 | Lax         |
| :-------- | :----------------------------------: | ----------: | :---------- |
| 链接      |         `<a href="..."></a>`         | 发送 Cookie | 发送 Cookie |
| 预加载    | `<link rel="prerender" href="..."/>` | 发送 Cookie | 发送 Cookie |
| GET 表单  |  `<form method="GET" action="...">`  | 发送 Cookie | 发送 Cookie |
| POST 表单 | `<form method="POST" action="...">`  | 发送 Cookie | 不发送      |
| iframe    |    `<iframe src="..."></iframe>`     | 发送 Cookie | 不发送      |
| AJAX      |            `$.get("...")`            | 发送 Cookie | 不发送      |
| Image     |          `<img src="...">`           | 发送 Cookie | 不发送      |

设置了`Strict`或`Lax`以后，基本就杜绝了 CSRF 攻击。当然，前提是用户浏览器支持 SameSite 属性。

3. None

   Chrome 计划将`Lax`变为默认设置。这时，网站可以选择显式关闭`SameSite`属性，将其设为`None`。不过，前提是必须同时设置`Secure`属性（Cookie 只能通过 HTTPS 协议发送），否则无效。

   下面的设置无效。

   ```bash
   Set-Cookie: widget_session=abc123; SameSite=None
   ```

   下面的设置有效。

   ```bash
   Set-Cookie: widget_session=abc123; SameSite=None; Secure
   ```

   

**注意： 这些属性不会被一起发送到后端，只有键值对会被发送到服务器，这些属性时给浏览器做提示用的。name和value都被URL编码了，获取的时候需要通过decodeURIComponent（）来解码**

设置cookie的时候，只有name和value是必须的。其他属性可以不设置。

> 什么是第三方Cookie? 第三方Cookie就是由第三方网站引导发出的Cookie，它除了用于CSRF攻击，还可以用于用户追踪。
>
> 看个例子：
>
> 比如，Facebook在第三方网站上插入一张看不见的图片。
>
> ```HTML
> <img src="facebook.com" style="visibility:hidden;">
> ```
>
> 浏览器加载上面代码是，就会想Facebook发送带有Cookie的请求，Facebook因此就知道你是谁，访问了什么网站。

#### Cookie如何跨域

通常情况Cookie只对其指定的域有效，如果是CORS方式跨域的话，需要在客户端设置XHR对象的withCredentials属性为true，同时需要在服务端设置

```bash
Access-Control-Allow-Credentials: true
```

如果发送的是带凭据的请求，但服务器的响应中没有包含这个头部，那么浏览器就不会把响应交给

JavaScript（于是，responseText 中将是空字符串，status 的值为 0，而且会调用 onerror()事件处

理程序）。

#### Cookie的缺陷

- 容量缺陷：cookie体积上限为4k，只能用来储存少量的数据。

- 性能缺陷：Cookie和域名绑定，不管这个域名下的地址需不需要这个Cookie，请求都会带上完整的Cookie，这样随着请求的增多，其实会造成巨大的性能浪费。因为请求携带了很多不必要的内容。

- 安全缺陷：由于Cookie以纯文本的形式在浏览器和服务器中传递，很容易被非法用户获取截获。跨站请求伪造就是以Cookie的缺陷造成的安全问题。同时如果`HttpOnly`为false的情况下，Cookie信息能够被JS脚本读取。

  

sessionStorage和localStorage都是用来储存信息在浏览器中的

localStorage和sessionStorage是存在浏览器

|              | localStorage                         | sessionStorage                           |
| ------------ | ------------------------------------ | ---------------------------------------- |
| 容量         | 5M                                   | 5M                                       |
| 存储时间     | 永久存在（除非被删除）               | 当前会话持续时间内存在（页面关闭就消失） |
| 储存位置     | 只存在于客户端，不参与与服务端的通信 | 只存在于客户端，不参与与服务端的通信     |
| 读取方式     | 同步                                 | 同步                                     |
| 存储值的类型 | 字符串                               | 字符串                                   |
|              | 同一域名下的页面可共享               | 各个会话相互隔离                         |


localStorage生命周期是永久，这意味着除非用户显示在浏览器提供的api上清除localStorage信息或者清除了浏览器缓存，否则这些信息将永远存在。存放数据大小为一般为5MB,而且它仅在客户端（即浏览器）中保存，不参与和服务器的通信。

sessionStorage仅在当前会话下有效，关闭页面或浏览器后被清除。存放数据大小为一般为5MB,而且它仅在客户端（即浏览器）中保存，不参与和服务器的通信。**他的特点是即便是相同域名下的两个页面，只要它们不在同一个浏览器窗口中打开，那么它们的 sessionStorage 内容便无法共享**；

localstorage和sessionStorage都只能在同源的页面访问，修改，都不支持跨域。

对localstorage和sessionStorage的设置，修改，删除都会触发storage事件。这个事件是绑定在document上的。

触发事件的操作有：

1. setItem
2. delete或者removeItem
3. 调用storage对象的clear方法

indexedDB也是只能在同源的页面访问，设置。

### IndexedDB

`IndexedDB`是运行在浏览器中的`非关系型数据库`, 本质上是数据库，绝不是和刚才WebStorage的 5M 一个量级，理论上这个容量是没有上限的。

关于它的使用，本文侧重原理，而且 MDN 上的教程文档已经非常详尽，这里就不做赘述了，感兴趣可以看一下[使用文档](https://developer.mozilla.org/zh-CN/docs/Web/API/IndexedDB_API/Using_IndexedDB)。

接着我们来分析一下`IndexedDB`的一些重要特性，除了拥有数据库本身的特性，比如`支持事务`，`存储二进制数据`，还有这样一些特性需要格外注意：

1. 键值对存储。内部采用`对象仓库`存放数据，在这个对象仓库中数据采用**键值对**的方式来存储。
2. 异步操作。数据库的读写属于 I/O 操作, 浏览器中对异步 I/O 提供了支持。
3. 受同源策略限制，即无法访问跨域的数据库。

http://www.ruanyifeng.com/blog/2018/07/indexeddb.html

https://github.com/ljianshu/Blog/issues/25

https://juejin.im/post/6844903516826255373