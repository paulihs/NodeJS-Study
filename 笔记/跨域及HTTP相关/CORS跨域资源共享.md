#### CORS(Cross-Origin Resource Sharing， 跨域资源共享)

CORS定义了在访问跨域资源的时候，浏览器和服务器之间应该如何沟通。

使用CORS实现跨域，客户端请求需要添加一个额外的头部 Origin，这个头部包含了请求页面的源信息（协议、域名、端口），服务器会根据这个Origin信息决定是否给与响应。

```JavaScript
Origin：  http://www.nczonline.net
```

如果服务器认为这个请求可以接受，就在响应头中的Access-Control-Allow-Origin字段中设置相同的源信息（如果该资源是公共资源，可以回发 * ）。

```JavaScript
Access-Control-Allow-Origin: http://www.nczonline.net
```

如果请求头中没有这个Origin信息，或者有这个头部但与响应头中源信息Access-Control-Allow-Origin不匹配，浏览器就会驳回请求。正常情况下，浏览器会处理请求。**注意，请求和响应都不包含 cookie 信息**。

这里涉及到Cookie不能跨域的问题，在使用cors跨域时，请求和响应中都不包含Cookie信息。

那么有没有例外呢？假如需要在跨域请求时带上凭据（比如cookie、http认证及客户端SSL证明），可以通过设置xhr对象的withCredentials属性为true，来实现指定某个请求应该发送凭据。

如果服务器接收到带凭据的请求，那么在响应头中会有如下响应

```JavaScript
Access-Control-Allow-Credentials: true
```

如果发送的是带凭据的请求，但服务器的响应中没有包含这个头部，那么浏览器就不会把响应交给

JavaScript（于是，responseText 中将是空字符串，status 的值为 0，而且会调用 onerror()事件处

理程序）。





在没有跨域时，服务端只要在响应头部放入set-cookie，那么就会有cookie产生并保存在客户端。在下一次客户端向服务端发送请求时，浏览器的机制就会自动带上cookie随请求一并发给服务端。

https://www.cnblogs.com/xiaojingyuan/p/7606536.html