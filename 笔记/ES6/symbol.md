symbol是一种新的原始数据类型，表示独一无二的值。

symbol通过Symbol函数生成，

```javascript
let a = Symbol();
let b = Symbol();
a === b; // false
typeof a ;// 'symbol'
```

##### 注意调用symbol函数不需要使用new操作符，也不能使用，用了会报错。

现在对象的属性名有多了一种类型symbol类型。在此之前，对象的属性名只能是字符串。

Symbol函数可以传入一个字符串作为参数， 表示对symbol实例的描述。symbol同时还可以转化为字符串还有布尔值

```javascript
let sym = Symbol('My symbol');

String(sym) // 'Symbol(My symbol)'
sym.toString() // 'Symbol(My symbol)'
Boolean(sym) // true
```

创建Symbol时，添加个描述同样可以被实例的description属性获取。这个属性是定义在Symbol的原型对象上的。

## Symbol.prototype.description

```javascript
const sym = Symbol('foo');
sym.description // 'foo'
```

### `Symbol.for()`,`Symbol.keyFor()`

Symbol.for()接受一个字符串作为参数，然后搜索有没有使用该参数作为名称Symbol值。如果有的话就返回这个symbol值。否则就新建一个以该字符串为名称的Symbol值，并将其**全局注册**。

通过Symbol.for()方法创建的symbol符号是全局符号注册表中的一员，或者说通过Symbol.for()创建的symbol符号是全局符号。

```javascript
let s0 = Symbol('foo');
let s1 = Symbol.for('foo');
let s2 = Symbol.for('foo');
s0 === s1 // false
s1 === s2 // true

```



即使采用相同的符号描述，在全局注册表中定义的符合和使用Symbol()定义的符号也并不相同。上面代码中s0是Symbol直接生成的，他不会注册到全局中，s1是通过Symbol.for()创建的，并且s1会被登记在全局环境中供搜索。所以s0和s1是不同的，而s1和s2是同一个symbol。

Symbol.for()的这个全局登记特性，可以用在**不同的iframe**或者service worker中取到同一个值。

```javascript
const iframe = document.createElement('iframe');
iframe.src = String(window.location);
document.body.appendChild(iframe);

iframe.contentWindow.Symbol.for('foo') === Symbol.for('foo')
```

Symbol.keyFor()方法返回一个已登记的Symbol类型值的key。

这个已登记的符号就是全局符号，如果查询的不是全局符号，就会返回undefined。

```javascript
let s1 = Symbol.for("foo");
Symbol.keyFor(s1) // "foo"

let s2 = Symbol("foo");
Symbol.keyFor(s2) // undefined

let s3 = Symbol.for();
Symbol.keyFor(s3) // 'undefined'

let s4 = Symbol.for('');
Symbol.keyFor(s4) // ''
```

注意 传入keyFor方法的值必须是一个已经登记的Symbol类型的值，也就是说是用Symbol.for生成的Symbol值。如果传入

的是Symbol生成的值，就会返回undefined。