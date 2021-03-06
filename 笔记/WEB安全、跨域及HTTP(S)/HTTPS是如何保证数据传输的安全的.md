# HTTPS如何保证数据的安全传输



谈到HTTPS，就不得不提HTTP。HTTP的特点是**明文传输**，因此在传输的每个环节，数据都有可能**被第三方窃取、篡改**。具体来说就是，HTTP数据经过TCP层，然后经过`WIFI路由器`、`运营商`和`目标服务器`。这些环节都可能被中间人拿到数据，进行篡改。这就是我们常说的**中间人攻击**。



为了防范这一类的攻击，我们不得不引入新的加密方案——**HTTPS**。

`HTTPS`并不是一个新的协议, 而是一个加强版的`HTTP`。其原理是**在`HTTP`和`TCP`之间建立了一个中间层**，当`HTTP`和`TCP`通信时并不是像以前那样直接通信，直接经过了一个中间层进行加密，将加密后的数据包传给`TCP`, 响应的，`TCP`必须将数据包解密，才能传给上面的`HTTP`。这个中间层也叫`安全层`。`安全层`的核心就是对数据`加解密`。

接下来我们就来剖析一下`HTTPS`的加解密是如何实现的。



### 对称加密和非对称加密

#### 概念

首先要理解对称加密和非对称加密的概念，然后再分析二者的应用效果如何。

**对称加密**的方式是很简单的。就是`加密`和`解密`用的是**同样的密钥**。

而**非对称加密**，就是有两把密钥。假设有A、B两把密钥，

那么用A密钥加密过的数据只能用B解密。反之，用B密钥加密的数据只能用A解密。



#### 加解密过程

下面来谈谈浏览器和服务器之间的协商加解密的过程

1. 浏览器向服务器发送一个随机数 client_random和一个加密的方法列表。
2. 服务器接收后，向浏览器返回一个随机数 server_random和加密方法。
3. 现在两者拥有了三个相同的凭证：client_random、server_random和加密方法。接着就用这个加密方法把两个随机数混合起来生成密钥，这个密钥就是浏览器和服务器通信的“暗号”。http就是经过这个密钥的加密传给TCP的。



#### 两种加密方式的各自应用的效果

采用**对称加密**，如果第三方在中间获取到了 client_random、server_random和加密方法。那么他就可以拿到加密的密钥，就可以对数据进行解密。那么这种加密方式很容易就被破解了。



既然对称加密很容易破解，那就试试非对称加密。

在非对称加密中，服务器手上有两把钥匙，一把是公钥，就是说所有人都能拿到，是公开的。一把是私钥，只有服务器自己知道。

那么现在开始传输：

1. 浏览器吧client_random和加密方法列表传过来，
2. 服务器接收到，把server_random、加密方法和公钥传给浏览器。
3. 现在两者都有相同的 client_random、server_random和加密方法、公钥，浏览器用这些信息生成与服务器通信的“暗号”。
4. 由于是非对称加密，通过公钥加密的数据只有私钥才能解密。这样就算中间人拿到浏览器传过来的数据，它没有私钥也是不能解密的。
5. 但是这不是绝对的安全，虽然浏览器传给服务端的数据安全了，但是服务器传给浏览器的数据还是可能被中间人获取。这是因为服务器传给浏览器的数据是用私钥加密的。而私钥加密的数据通过公钥可以解密，在这种情况下，中间人拿到公钥还是可以对服务端传过来的数据进行解密。而且采用非对称加密对服务器性能消耗很大，所以这种方案也不是很完善。



### 终极版——对称加密与非对称加密结合

可以发现，对称加密和非对称加密，单独应用一个都会存在安全风险。但是如果把二者结合一下呢？

来看演示流程：

1. 浏览器向服务器发送一个 client_random和加密方法列表。
2. 服务器收到，向浏览器发送一个server_random、加密方法和公钥。
3. 浏览器接收，接着生成另一个随机数 pre_random，并且用公钥加密，传给服务器。
4. 服务器接收到之后用私钥解密得到 pre_random。

现在浏览器和服务器有了相同的 client_random、server_random和pre_random。然后两者使用相同的加密方法混合这三个随机数生成最终的密钥。

然后浏览器和服务器使用相同的密钥进行加密通信（即对称加密），但是中间人没法拿到最终的密钥，因为中间人不知道私钥就没法获取 pre_random。

比较一下和单纯的使用非对称加密的区别，本质上是**防止私钥加密的数据外传**。单独使用非对称加密，最大的漏洞就是服务器回传数据给浏览器只能使用私钥，这是问题的根源。



### 添加数字证书

尽管通过两个加密方式结合的方式能很好的实现加密传输，但是实际上还是存在以下问题的。

如果黑客采用了DNS劫持，将目标地址替换成黑客服务器地址，然后在伪造一份公钥和私钥，照样可以和浏览器进行数据传输。而对于浏览器用户而言，他并不知道自己在访问一个危险的服务器。

所以HTTPS在结合对称加密和非对称加密的基础上，还添加了**数字证书认证**的步骤。其目的就是让服务器证明自己的身份。

#### 传输过程

为了获取这个证书，服务器运营者需要向第三方认证机构获取授权，这个第三方机构也叫`CA`(`Certificate Authority`), 认证通过后 CA 会给服务器颁发**数字证书**。

这个数字证书有两个作用:

1. **服务器向浏览器证明自己的身份**。
2. **把公钥传给浏览器**。

这个验证的过程发生在什么时候呢？

当服务器传送`server_random`、加密方法的时候，顺便会带上`数字证书`(包含了`公钥`), 接着浏览器接收之后就会开始**验证数字证书**。如果验证通过，那么后面的过程照常进行，否则拒绝执行。

现在我们来梳理一下`HTTPS`最终的加解密过程:

![https://user-gold-cdn.xitu.io/2019/12/15/16f080a6f6375dc1?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2019/12/15/16f080a6f6375dc1?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

#### 数字证书的认证过程：

1. 当客户端收到这个证书之后，使用本地配置的权威机构的公钥对证书进行解密得到服务端的公钥和证书的数字签名，数字签名经过CA公钥解密得到证书信息摘要。
2. 然后证书签名的方法计算一下当前证书的信息摘要，与收到的信息摘要作对比，如果一样，表示证书一定是服务器下发的，没有被中间人篡改过。因为中间人虽然有权威机构的公钥，能够解析证书内容并篡改，但是篡改完成之后中间人需要将证书重新加密，但是中间人没有权威机构的私钥，无法加密，强行加密只会导致客户端无法解密，如果中间人强行乱修改证书，就会导致证书内容和证书签名不匹配。
   那第三方攻击者能否让自己的证书显示出来的信息也是服务端呢？（伪装服务端一样的配置）显然这个是不行的，因为当第三方攻击者去CA那边寻求认证的时候CA会要求其提供例如域名的whois信息、域名管理邮箱等证明你是服务端域名的拥有者，而第三方攻击者是无法提供这些信息所以他就是无法骗CA他拥有属于服务端的域名。


### 运用与总结

#### 安全性考虑：

- HTTPS协议的加密范围也比较有限，在黑客攻击、拒绝服务攻击、服务器劫持等方面几乎起不到什么作用
- SSL证书的信用链体系并不安全，特别是在某些国家可以控制CA根证书的情况下，中间人攻击一样可行

> 中间人攻击（MITM攻击）是指，黑客拦截并篡改网络中的通信数据。又分为被动MITM和主动MITM，被动MITM只窃取通信数据而不修改，而主动MITM不但能窃取数据，还会篡改通信数据。最常见的中间人攻击常常发生在公共wifi或者公共路由上。 

#### 成本考虑：

- SSL证书需要购买申请，功能越强大的证书费用越高
- SSL证书通常需要绑定IP，不能在同一IP上绑定多个域名，IPv4资源不可能支撑这个消耗（SSL有扩展可以部分解决这个问题，但是比较麻烦，而且要求浏览器、操作系统支持，Windows XP就不支持这个扩展，考虑到XP的装机量，这个特性几乎没用）。
- 根据ACM CoNEXT数据显示，使用HTTPS协议会使页面的加载时间延长近50%，增加10%到20%的耗电。
- HTTPS连接缓存不如HTTP高效，流量成本高。
- HTTPS连接服务器端资源占用高很多，支持访客多的网站需要投入更大的成本。
- HTTPS协议握手阶段比较费时，对网站的响应速度有影响，影响用户体验。比较好的方式是采用分而治之，类似12306网站的主页使用HTTP协议，有关于用户信息等方面使用HTTPS。