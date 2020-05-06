##### Object.assign()
Object.assign方法用于将所有可枚举属性的值从一个或者多个源对象复制到目标对象，它将返回目标对象。
```javascript
const target = { a: 1, b: 2 };
const source = { b: 4, c: 5 };

const returnedTarget = Object.assign(target, source);

console.log(target);
// expected output: Object { a: 1, b: 4, c: 5 }

console.log(returnedTarget);
// expected output: Object { a: 1, b: 4, c: 5 }
console.log(target===returnedTarget)
```
