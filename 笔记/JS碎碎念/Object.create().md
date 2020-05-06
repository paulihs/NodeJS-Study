##### Object.create(obj)
Object.create()方法接受一个对象为参数，返回一个对象，返回的对象是参数为原型的构造函数创建的一个空对象。

```javascript
const obj = {
    le: 12,
    ha: 15
};
const copyObj = Object.create(obj);
copyObj // {}
copyObj.__proto__ === obj; // true
```
