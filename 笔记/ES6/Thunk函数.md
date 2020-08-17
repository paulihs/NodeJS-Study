### Thunk 函数

#### 参数的求值策略 

```JavaScript
var x  = 12;
function a(sth){
    return  sth + 1;
}
a(x+10);

```

上面这段代码定义了函数a，之后执行，a的参数x+10何时求值？

- 一种是传值调用，在进入函数体之前就计算x+5的值，然后将结果传入函数a。`a(x+5)`传值调用，相当于a(6).
- 另一种叫传名调用，就是将x+5传入函数体，只在用到它的时候求值。a(x+5)传名调用相当于（x+5）+ 1。

#### Thunk函数的含义

编译器的“传名调用”实现，往往是将参数放到一个临时函数之中，再将这个临时函数传入函数体。这个临时函数就叫做 Thunk 函数。

```javascript
function f(m) {
  return m * 2;
}

f(x + 5);

// 等同于

var thunk = function () {
  return x + 5;
};

function f(thunk) {
  return thunk() * 2;
}
```

上面代码中，函数 f 的参数`x + 5`被一个函数替换了。凡是用到原参数的地方，对`Thunk`函数求值即可。

这就是 Thunk 函数的定义，它是“传名调用”的一种实现策略，用来替换某个表达式。

#### JavaScript中的Thunk函数

JavaScript是传值调用，他的Thunk函数含义有所不同。JS Thunk函数替换的不是表达式，而是多参数函数。将多参数函数转换为只接受一个回调函数作为参数的单参数函数。

```!
注意：原来多参数函数的最后一个参数需是一个函数
```

Thunk的作用是将一个函数从一次性传值变成2次传值的函数。

```JavaScript
f(a, b, c) ===> Thunkf(a, b)(c)
```

```javascript
// 正常版本的readFile（多参数版本）
fs.readFile(fileName, callback);

// Thunk版本的readFile（单参数版本）
var Thunk = function (fileName) {
  return function (callback) {
    return fs.readFile(fileName, callback);
  };
};

var readFileThunk = Thunk(fileName);
readFileThunk(callback);
```

注意上面这个叫Thunk的函数就是Thunk函数。他从一个多参数函数变成了一个单参数函数，只不过要传入2次。



任何函数，只有参数有回调函数，就能写成Thunk函数的形式。

下面是一个Thunk函数转换器

```JavaScript
const Thunk = function(fn) {
  return function (...args) {
    return function (callback) {
      return fn.call(this, ...args, callback);
    }
  };
};
```

#### Thunkify模块

Thunkify模块是用于生产环境的转换器

```javascript
var thunkify = require('thunkify');
var fs = require('fs');

var read = thunkify(fs.readFile);
read('package.json')(function(err, str){
  // ...
});
```



Thunkify的源码和前面那个简单的转换器很像。



```javascript
function thunkify(fn) {
  return function() {
    var args = new Array(arguments.length);
    var ctx = this;

    for (var i = 0; i < args.length; ++i) {
      args[i] = arguments[i];
    }

    return function (done) {
      var called;

      args.push(function () {
        if (called) return;
        called = true;
        done.apply(null, arguments);
      });

      try {
        fn.apply(ctx, args);
      } catch (err) {
        done(err);
      }
    }
  }
};
```

就是多了一个检查机制，就是变量called保证回调函数只执行一次。

Thunk函数有什么用？

上面讲了那么多，那么这个Thunk函数到底有啥用呢？

#### Generator函数的流程管理

Thunk函数可以用于Generator函数的自动流程管理（自动执行）。如何来实现？

一个简单的例子：

```javascript
function* gen() {
  // ...
}

var g = gen();
var res = g.next();

while(!res.done){
  console.log(res.value);
  res = g.next();
}
```

上面代码中Generator函数gen会自动执行完所有步骤。但是如果next()过程中包含异步操作的话，要保证前一步执行完，再执行下一步，上面这个自动执行就不行了。这时Thunk函数就派上用场了。

举个栗子



```javascript
var fs = require('fs');
var thunkify = require('thunkify');
var readFileThunk = thunkify(fs.readFile);

var gen = function* (){
  var r1 = yield readFileThunk('/etc/fstab');
  console.log(r1.toString());
  var r2 = yield readFileThunk('/etc/shells');
  console.log(r2.toString());
};
```

代码中，yield后面是一个Thunk函数，而yield的作用是把程序执行权移出Generator函数，那么就需要一种方式将执行权再移回Generator函数。

这个方法就是thunk函数，因为Thunk函数接受一个回调作为参数，所以在回调中，可以将执行权会给Generator函数。我们先手动执行上面这个Generator函数。

```javascript
var g = gen();

var r1 = g.next();// r1是个对象，有done和value属性
// 注意 r1.value 是一个Thunk函数，他接受一个函数作为回调
// 在这个回调里面 再调用next方法将执行权交回给Generator函数
r1.value(function (err, data) {
  if (err) throw err;
  var r2 = g.next(data);
  r2.value(function (err, data) {
    if (err) throw err;
    g.next(data);
  });
});
```

那么仔细观察上面的回调函数，会发现Generator函数的执行过程就是将同一个回调函数反复传入next方法返回结果的value属性，这使得我们可以用递归的方式完成这个过程。

#### Thunk函数的自动流程管理

Thunk函数的作用在于可以作为yield表达式的值，用于自动执行Generator函数。

> **原理**就是在yield后面是一个Thunk函数，异步操作就发生在这个Thunk内部，当异步操作结束时调用回调函数，在回调函数里面执行next方法，把执行权交还给Generator函数!

```JavaScript
function run(fn) {
  var gen = fn();

  function next(err, data) {
    var result = gen.next(data);
    if (result.done) return;
    result.value(next);
  }

  next();
}

function* g() {
  // ...
}

run(g);
```

这个run函数就是一个generator执行器。但是他有两个限制：

1. run的参数必须是个Generator函数
2. 在Generator函数中yield表达式后面跟的必须是个Thunk函数

#### co模块

co模块也是用于Generator函数的自动执行的。只要将Generator函数传入co函数，他就会自动执行，co函数会返回一个Promise对象，可以用then方法添加回调。

那么为啥co可以自动执行Generator函数呢？其实原理是类似的。Generator函数是一个异步操作容器，他的自动执行需要一种机制，一种在异步操作有结果之后将控制权交还给Generator函数的机制。

有两种方法可以做到：

1. 回调函数。就像前面讲到的run函数一样。将异步操作包装成Thunk函数，在回调函数找那个交回执行权。
2. Promise对象，将异步操作包装成Promise对象，用then方法交回执行权。



co模块是两种方法的结合，使用co的前提是yield命令后面是Thunk函数或者Promise对象。

还是前面readFile的例子：

```javascript
var fs = require('fs');

var readFile = function (fileName){
  return new Promise(function (resolve, reject){
    fs.readFile(fileName, function(error, data){
      if (error) return reject(error);
      resolve(data);
    });
  });
};

var gen = function* (){
  var f1 = yield readFile('/etc/fstab');
  var f2 = yield readFile('/etc/shells');
  console.log(f1.toString());
  console.log(f2.toString());
};
```

然后手动执行：

```javascript
var g = gen();

g.next().value.then(function(data){
  g.next(data).value.then(function(data){
    g.next(data);
  });
});
```



那么基于Promise写出的自动执行器就是

```javascript
function run(gen){
  var g = gen();

  function next(data){
    var result = g.next(data);
    if (result.done) return result.value;
    result.value.then(function(data){
      next(data);
    });
  }

  next();
}

run(gen);
```

可以和Thunk版本对比着来看：

```JavaScript
function run(fn) {
  var gen = fn();

  function next(err, data) {
    var result = gen.next(data);
    if (result.done) return;
    result.value(next);
  }

  next();
}
```

可以发现，两个版本唯一的区别就是 交还控制权方式的差别，上面的是通过Promise对象的then方法，而下面这个是通过Thunk函数的回调。