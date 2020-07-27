###### 静态方法 & 静态属性

```JavaScript
class person {
    static nickname = 'david';
    static name(){
        // 静态方法中的this指的是 类本身，而不是类的实例
	console.log(this.nickname)
}
}
```



###### 