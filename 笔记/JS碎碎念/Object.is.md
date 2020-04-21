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
```
2. NaN和NaN相同

```javascript
// NaN和NaN相同
let d = Object.is(NaN, NaN); // true
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