#### 在浏览器中，从输入URL到页面展示，这过程中发生了什么？

![](E:\NodeJS-Study\笔记\pics\从url输入到页面展示.png)



上图展示了从url输入到页面展示的主要过程，总的来说可以分为以下几个部分：

- DNS解析： 将域名解析成IP地址。
- TCP连接：TCP三次握手建立连接。
- 发送HTTP请求
- 服务器处理请求并返回HTTP报文
- 浏览器解析渲染页面
- 断开连接：TCP四次挥手



#### URL是什么？

URL（Uniform Resource Locator），统一资源定位符，用于定位互联网上的资源，俗称网址。

比如 http://www.w3school.com.cn/html/index.asp，遵守以下的语法规则：

**scheme://host.domain:port/path/filename**
各部分解释如下：
scheme - 定义因特网服务的类型。常见的协议有 http、https、ftp、file，其中最常见的类型是 http，而 https 则是进行加密的网络传输。
host - 定义域主机（http 的默认主机是 www）
domain - 定义因特网**域名**，比如 w3school.com.cn
port - 定义主机上的端口号（http 的默认端口号是 80）
path - 定义服务器上的路径（如果省略，则文档必须位于网站的根目录中）。
filename - 定义文档/资源的名称

## 二、域名解析（DNS）

在浏览器输入网址后，首先要经过域名解析，因为浏览器并不能直接通过域名找到对应的服务器，而是要通过 IP 地址。大家这里或许会有个疑问----计算机既可以被赋予 IP 地址，也可以被赋予主机名和域名。比如 `www.hackr.jp`。那怎么不一开始就赋予个 IP 地址？这样就可以省去解析麻烦。我们先来了解下什么是 IP 地址

#### 1.IP 地址

IP 地址是指互联网协议地址，是 IP Address 的缩写。IP 地址是 IP 协议提供的一种统一的地址格式，它为互联网上的每一个网络和每一台主机分配一个逻辑地址，以此来屏蔽物理地址的差异。IP 地址是一个 32 位的二进制数，比如 127.0.0.1 为本机 IP。
**域名就相当于 IP 地址乔装打扮的伪装者，带着一副面具。它的作用就是便于记忆和沟通的一组服务器的地址**。用户通常使用主机名或域名来访问对方的计算机，而不是直接通过 IP 地址访问。**因为与 IP 地址的一组纯数字相比，用字母配合数字的表示形式来指定计算机名更符合人类的记忆习惯。但要让计算机去理解名称，相对而言就变得困难了。因为计算机更擅长处理一长串数字。为了解决上述的问题，DNS 服务应运而生。**

#### 2.什么是域名解析

DNS 协议提供通过域名查找 IP 地址，或逆向从 IP 地址反查域名的服务。**DNS 是一个网络服务器，我们的域名解析简单来说就是在 DNS 上记录一条信息记录**。

```
例如 baidu.com  220.114.23.56（服务器外网IP地址）80（服务器端口号）
```

#### 3. 浏览器如何通过域名去查询 URL 对应的 IP 呢

![](E:\NodeJS-Study\笔记\pics\dns查询流程.png)

- 浏览器缓存：浏览器会按照一定的频率缓存 DNS 记录。
- 操作系统缓存：如果浏览器缓存中找不到需要的 DNS 记录，那就去操作系统中找。
- 路由缓存：路由器也有 DNS 缓存。
- ISP 的 DNS 服务器：ISP 是互联网服务提供商(Internet Service Provider)的简称（比如电信、移动、联通），ISP 有专门的 DNS 服务器应对 DNS 查询请求。ISP的DNS服务器俗称本地DNS服务器。
- 根服务器：ISP 的 DNS 服务器还找不到的话，它就会向根服务器发出请求，进行递归查询（DNS 服务器先问根域名服务器.com 域名服务器的 IP 地址，然后再问.baidu 域名服务器，依次类推）

![](E:\NodeJS-Study\笔记\pics\根服务器递归查询.png)

总结：客户端向DNS服务器发送域名，DNS服务器查询到域名对应的IP地址，返回给浏览器，浏览器拿着这个IP，加上协议开始与服务端交互。这个交互的第一步是建立TCP连接。

#### 三 TCP三次握手

知道服务端的IP地址后，就可以和服务端建立连接了，连接的方式分为两种，可靠的TCP和不可靠的UDP，http协议是基于TCP的，所以需要和服务器建立TCP连接。怎么建立？通过三次握手。

![](E:\NodeJS-Study\笔记\pics\三次握手.jpg)

1. 第一次握手：Client将标志位**SYN置为1**，**随机产生**一个值**seq=x**，并将该数据包发送给Server，Client进入SYN_SENT状态，等待Server确认。
2. 第二次握手：Server收到数据包后由标志位SYN=1知道Client请求建立连接，Server将标志位**SYN**和**ACK**都置为1，**ack=x+1**，**随机产生一个值seq=y**，并将该数据包发送给Client以确认连接请求，Server进入SYN_RCVD状态。
3. 第三次握手：Client收到确认后，**检查ack是否为x+1**，**ACK是否为1**，如果正确则将标志位**ACK置为1**，**ack=y+1**，并将该数据包发送给Server，Server检查**ack是否为y+1**，**ACK是否为1**，如果正确则连接建立成功，Client和Server进入ESTABLISHED状态，完成三次握手，随后Client与Server之间可以开始传输数据了。

三次握手就是客户端和服务端相互确认对方的收发能力，这是确认双方手法能力所需的最小次数

#### 四 发送HTTP请求，接受响应

建立了 TCP 连接，浏览器就可以和服务器进行通信了，HTTP 中的数据就是在这个通信过程中传输的。下面是一个 HTTP 请求的完整示例。

![img](https://pic4.zhimg.com/v2-a24207fcba237642a73b635c7da30eec_b.jpg)



服务器收到 HTTP 请求后，会返回给浏览器 HTTP 响应，下面是一个 HTTP 响应的完整示例。

![img](https://pic4.zhimg.com/v2-bdeac5040e03b540142625b4b54c2f9f_b.jpg)



服务器会通过响应行中的**状态码**告诉浏览器它的处理结果，常见的状态码有以下几类：

- 2XX：成功，最常见的是 200 OK
- 3XX：需要进一步操作，比如 301 永久重定向，302 临时重定向，304 未修改
- 4XX：请求出错，比如最常见的 404 未找到资源，还有 403 禁止请求
- 5XX：服务器出错，比如 500 服务器内部错误，502 网关错误



#### 五 四次挥手断开TCP连接

![](E:\NodeJS-Study\笔记\pics\四次挥手.jpg)

由于TCP连接是全双工的，因此，每个方向都必须要单独进行关闭，这一原则是当一方完成数据发送任务后，发送一个FIN来终止这一方向的连接，收到一个FIN只是意味着这一方向上没有数据流动了，即不会再收到数据了，但是在这个TCP连接上仍然能够发送数据，直到这一方向也发送了FIN。首先进行关闭的一方将执行主动关闭，而另一方则执行被动关闭，上图描述的即是如此。
（1）第一次挥手：Client发送一个FIN，用来关闭Client到Server的数据传送，Client进入FIN_WAIT_1状态。
（2）第二次挥手：Server收到FIN后，发送一个ACK给Client，确认序号为收到序号+1（与SYN相同，一个FIN占用一个序号），Server进入CLOSE_WAIT状态。
（3）第三次挥手：Server发送一个FIN，用来关闭Server到Client的数据传送，Server进入LAST_ACK状态。
（4）第四次挥手：Client收到FIN后，Client进入TIME_WAIT状态，接着发送一个ACK给Server，确认序号为收到序号+1，Server进入CLOSED状态，完成四次挥手。



#### 六 浏览器解析HTML，加载资源渲染页面

1. HTML代码转化成DOM
2. CSS代码转化成CSSOM（CSS Object Model）
3. 结合DOM和CSSOM，生成一棵渲染树（包含每个节点的视觉信息） render tree
4. 生成布局（layout），即将所有渲染树的所有节点进行平面合成   layout
5. 将布局绘制（paint）在屏幕上     paint

https://github.com/ljianshu/Blog/issues/24

[https://www.zhihu.com/search?type=content&q=%E4%BB%8E%E8%BE%93%E5%85%A5URL%E5%88%B0%E9%A1%B5%E9%9D%A2%E5%B1%95%E7%A4%BA%E8%BF%99%E4%B8%AA%E8%BF%87%E7%A8%8B%E4%B8%AD%E5%8F%91%E7%94%9F%E4%BA%86%E4%BB%80%E4%B9%88](https://www.zhihu.com/search?type=content&q=从输入URL到页面展示这个过程中发生了什么)

































https://www.cnblogs.com/jin-zhe/p/11586327.html