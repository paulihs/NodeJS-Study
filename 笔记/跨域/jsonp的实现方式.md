jsonp是利用script标签能够访问跨域资源的特性，实现跨域资源请求的。
其原理很简单： 在**目标url**后面加上**callback参数**，然后服务端会返回一段代码：

```JavaScript
callBackName(响应数据)
```

下面是完整实现：

```JavaScript
function jsonpReq(options){
    const {url, callback} = options;
    const scriptTag = document.createElement('script');
    scriptTag.src = `${url}?callback=${callback.name}`;
    document.body.appendChild(scriptTag);
}

function handleResponse(){
    
}

jsonpReq({
    url: '...',
    callback: handleResponse,
})
```

注意我们上面写的这段代码：

1. 在url中加上callback参数，这个参数的值是一个全局函数的函数名。这样做的目的是能在下载的js代码中引用到这个函数来处理请求的响应。
2. 这个callback函数必须是一个全局函数，这样每发一个jsonp请求就创建一个全局变量这会增加很多全局变量。

那么能不能解决这个问题呢？

可以的，通过创建一个全局对象的方法，包裹callback，在请求结束后，删除该方法。

```JavaScript
(function (global) {
    var id = 0,
        container = document.getElementsByTagName("head")[0];

    function jsonp(options) {
        if(!options || !options.url) return;

        var scriptNode = document.createElement("script"),
            data = options.data || {},
            url = options.url,
            callback = options.callback,
            fnName = "jsonp" + id++;

        // 实际回调函数的函数名
        data["callback"] = fnName;

        // 拼接url
        var params = [];
        for (var key in data) {
            params.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
        }
        url = url.indexOf("?") > 0 ? (url + "&") : (url + "?");
        url += params.join("&");
        
        scriptNode.src = url;

        // 传递的是一个匿名的回调函数，要执行的话，暴露为一个全局方法
        global[fnName] = function (res) {
            callback && callback(res);
            container.removeChild(scriptNode);
            delete global[fnName];
        }

        // 出错处理
        scriptNode.onerror = function () {
            callback && callback({error:"error"});
            container.removeChild(scriptNode);
            global[fnName] && delete global[fnName];
        }

        scriptNode.type = "text/javascript";
        container.appendChild(scriptNode)
    }
	// 输出为
    global.jsonp = jsonp;

})(window);
```

