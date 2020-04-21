**reduce方法**
```javascript
array.reduce(function(total, currentValue, currentIndex, arr){
//逻辑

}, initialValue)
```
reduce方法是一个递归方法，接受一个函数和一个可选的初始值为参数。
参数函数的参数分别为：
* total: 上次的值，如果是第一次执行，就是initialValue，其他时候为上一次函数的返回值。
* currentValue：本轮次对应得数组项，有初始值得时候，函数第一次执行为数组的第一项，没有初始值得时候，
函数第一次执行，currentValue为数组的第二项，此时total为数组的第一项。
* currentIndex：在没有初始值得时候，第一次执行currentIndex为1，有初始值的时候第一次执行为0。
* arr： 数组本身。
