```JavaScript
import isPromise from 'is-promise';
 
isPromise(Promise.resolve());//=>true
isPromise({then:function () {...}});//=>true
isPromise(null);//=>false
isPromise({});//=>false
isPromise({then: true})//=>false
```


 如何判断函数是不是generator 函数


```JavaScript
 function* a(){}
a.constructor.name // "GeneratorFunction"
```
