正常使用instanceof

```JavaScript
let Car = function() {}
let benz = new Car()
benz instanceof Car // true
let car = new String('Mercedes Benz')
car instanceof String // true
let str = 'Covid-19'
str instanceof String // false
```

自己实现instanceof：

```javascript
function myInstanceof(instance, constroutor){
if(typeof instance !== 'object'||instance === null){
   return false;
   }
	let proto = Object.getPrototypeOf(instance);
    while(true){
        if(proto===null){
            return false;
        }
        if(proto===constroutor.protoType){
           return true
        }
        proto = Object.getPrototypeOf(proto);
    }
}
```



