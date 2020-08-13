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





那么我们需要在异步操作结束时，把执行权交还给Generator函数



|      |      |
| ---- | ---- |
|      |      |