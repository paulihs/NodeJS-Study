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



Class的继承

Class通过`extends`关键字实现继承。

```JavaScript
class Component {
    static name = 'father';
    constructor(props, context, updater){
        this.props = props;
        this.context = context;
        // If a component has string refs, we will assign a different object later.
        this.refs = {ref: '我是ref'};
        // We initialize the default updater but the real one gets injected by the
        // renderer.
        this.updater = updater ;
    }
    setState(partialState, callback){
		this.updater.enqueueSetState(this, partialState, callback, 'setState');
	}
}

class Hello extends Component {
    constructor(...args){
        super(...args);// 调用父类的constructor 
        this.sayHi = 'hello';
    }
    greet(){
        return this.sayHi + super.name
    }
}
```

上面代码中定义了一个Hello类，该类通过extends关键字，继承了Component类的所有属性和方法。

