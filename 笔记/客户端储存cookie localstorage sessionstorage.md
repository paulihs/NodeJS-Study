### Cookie

HTTP Cookie，通常称为cookie。**最开始是用于在客户端储存会话信息的，为了弥补HTTP在状态管理上的不足**。

#### 为什么需要cookie呢？

在我们使用web应用的时候，一般都需要使用账户和密码去登陆，这样每个用户的信息数据都是隔离的，使用的服务也互不影响。但是用户登录之后，在页面上的每一次操作所发出的请求，服务端如何知道是刚刚登录的那个用户发出的呢？这时，cookie就派上用场了。在登录请求发出后，服务端在响应中通过设置Set-Cookie 响应头 设置客户端的cookie。在之后的每次请求中都会带上这个cookie一起发送给服务端，服务端就可以从这个cookie中获取到登录用户的信息了。 

注意：只有向同一域名发送请求才会带上相应的cookie。



cookie的设置方式：

1. 服务器对客户端发送的HTTP请求发送Set-Cookie 作为HTTP响应头的一部分。这样会设置相应的cookie到客户端。
2. 通过document.cookie设置cookie

cookie的组成：

cookie是一组一组的键值对，通过=连接。 name=value   name就是名称，value就是值。name和value都必须被URL编码。

这里的URL编码就是把名称和值中的非字母字符进行编码

cookie的属性：

一组键值还有一些属性修饰。比如：

域：cookie对那个域有效，向这个域发送请求时会包含这个cookie信息。可以通过domain=www.baidu.com来设置。如果没有明确指定的话，那么会默认来自设置cookie的那个域。

路径：对于指定域中的那个路径会向服务器发送该cookie，比如你指定path=/book,那么只有向www.baidu.com/book发送请求时才会带上该cookie。

失效时间： 表示cookie何时应该被删除的时间戳。就是过了这个时间，这个cookie就失效了，会被删除，发送请求的时候不会带上这个cookie了

安全标志：指定后，cookie只有在使用ssl连接的时候才会被发送到服务器。这个ssl连接就是https，通过设置secure字段来指定。

httponly： 用于限制JavaScript获取cookie，当有这个属性时，cookie只能在发送请求时被用上，不可以通过js获取到。

**注意： 这些属性不会被一起发送到后端，只有键值对会被发送到服务器，这些属性时给浏览器做提示用的。name和value都被URL编码了，获取的时候需要通过decodeURIComponent（）来解码**

设置cookie的时候，只有name和value是必须的。其他属性可以不设置。

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

indexDB也是只能在同源的页面访问，设置。

https://github.com/ljianshu/Blog/issues/25

https://juejin.im/post/6844903516826255373