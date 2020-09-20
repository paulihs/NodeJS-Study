### Cookie

HTTP Cookie，通常称为cookie。最开始是用于在客户端储存会话信息的。



cookie的设置方式：

1. 服务器对客户端发送的HTTP请求发送Set-Cookie 作为HTTP响应头的一部分。这样会设置相应的cookie到客户端。
2. 通过document.cookie设置cookie

cookie的组成：

cookie是一组一组的键值对，通过=连接。 name=value   name就是名称，value就是值。name和value都必须被URL编码。

cookie的属性：

一组键值还有一些属性修饰。不如：

域：cookie对那个域有效，向这个域发送请求时会包含这个cookie信息。可以通过domain=www.baidu.com来设置。如果没有明确指定的话，那么会默认来自设置cookie的那个域。

路径：对于指定域中的那个路径会向服务器发送该cookie，比如你指定path=/book,那么只有向www.baidu.com/book发送请求时才会带上该cookie。

失效时间： 表示cookie何时应该被删除的时间戳。就是过了这个时间，这个cookie就失效了，会被删除，发送请求的时候不会带上这个cookie了

安全标志：指定后，cookie只有在使用ssl连接的时候才会被发送到服务器。这个ssl连接就是https，通过设置secure字段来指定。

httponly： 用于限制JavaScript获取cookie，当有这个属性时，cookie只能在发送请求时被用上，不可以通过js获取到。

**注意： 这些属性不会被一起发送到后端，只有键值对会被发送到服务器，这些属性时给浏览器做提示用的。name和value都被URL编码了，获取的时候需要通过decodeURIComponent（）来解码**

设置cookie的时候，只有name和value是必须的。其他属性可以不设置。

cookie长度最多为4k。



sessionStorage和localStorage都是用来储存信息在浏览器中的

localStorage和sessionStorage是存在浏览器


localStorage生命周期是永久，这意味着除非用户显示在浏览器提供的api上清除localStorage信息或者清除了浏览器缓存，否则这些信息将永远存在。存放数据大小为一般为5MB,而且它仅在客户端（即浏览器）中保存，不参与和服务器的通信。

sessionStorage仅在当前会话下有效，关闭页面或浏览器后被清除。存放数据大小为一般为5MB,而且它仅在客户端（即浏览器）中保存，不参与和服务器的通信。源生接口可以接受，亦可再次封装来对Object和Array有更好的支持。

localstorage和sessionStorage都只能在同源的页面访问，修改，都不支持跨域。

对localstorage和sessionStorage的设置，修改，删除都会触发storage事件。这个事件是绑定在document上的。

触发事件的操作有：

1. setItem
2. delete或者removeItem
3. 调用storage对象的clear方法

indexDB也是只能在同源的页面访问，设置。

https://juejin.im/post/6844903516826255373