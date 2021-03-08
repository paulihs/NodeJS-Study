### 浅比较

在学习react 时，PureComponent和component的区别就是PureComponent天生就带有shouldComponentUpdate，而他这个shouldComponentUpdate中的判断逻辑就是对props和state进行浅比较

PureComponent中 shouldComponentUpdate源码

```javascript
if (this._compositeType === CompositeTypes.PureClass) {
  shouldUpdate = !shallowEqual(prevProps, nextProps) || ! shallowEqual(this.state, nextState);
}
```

shallowEqual源码

```JavaScript
const hasOwn = Object.prototype.hasOwnProperty

function is(x, y) {
  if (x === y) {
    return x !== 0 || y !== 0 || 1 / x === 1 / y
  } else {
    return x !== x && y !== y
  }
}

export default function shallowEqual(objA, objB) {
    // 这个is函数是Object.is的polyfill写法
    // 
  if (is(objA, objB)) return true
// 
  if (typeof objA !== 'object' || objA === null ||
      typeof objB !== 'object' || objB === null) {
    return false
  }

  const keysA = Object.keys(objA)
  const keysB = Object.keys(objB)

  if (keysA.length !== keysB.length) return false

  for (let i = 0; i < keysA.length; i++) {
    if (!hasOwn.call(objB, keysA[i]) ||
        !is(objA[keysA[i]], objB[keysA[i]])) {
      return false
    }
  }

  return true
}
```



# Object.is()用于判断两个值是否相同。

###  Object.is()接受两个参数返回一个布尔值。

```javascript
    let bel = Object.is(val1, val2);
```

###  Object.is()比较两个值相当于使用`===`,但是有两个**例外**之处。
1. -0和+0不相同

```javascript
// 1. -0和+0不相同
let a = Object.is(-0, +0); // false
let b = Object.is(-0, 0); // false
let c = Object.is(-0, -0); // true
let d = Object.is(0, +0); // true
```
2. NaN和NaN相同

```javascript
// NaN和NaN相同
let d = Object.is(NaN, NaN); // true
```

3. Infinity和Infinity相同

```JavaScript
let d = Object.is(Infinity, Infinity); // true
let dd = Object.is(-Infinity, Infinity); // false
let ddd = Object.is(-Infinity, -Infinity); // true
```



### Polyfill

```javascript
if (!Object.is) {
  Object.is = function(x, y) {
    // SameValue algorithm
    if (x === y) { // Steps 1-5, 7-10
      // Steps 6.b-6.e: +0 != -0
      return x !== 0 || 1 / x === 1 / y;
    } else {
      // Step 6.a: NaN == NaN
      return x !== x && y !== y;
    }
  };
}
```

**注意：在JS中，1/0===Infinity,0可以作为分母，不过结果为无穷！**













https://www.imweb.io/topic/598973c2c72aa8db35d2e291