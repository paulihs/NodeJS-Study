###  Generator

> Generator函数在javascript语言中具有广泛应用，他解决了长久以来困扰JS开发者的一个问题——回调地狱（回调函数嵌套过深）。极大改善了JS异步编程的开发体验。

###### 概念

generator函数是一个状态机，它里面封装了多个内部状态。

###### 1. 语法

generator函数形式上就是一个普通函数，但是它有两个特征：

1. 在`function`关键字和函数名之间有一个星号（*）；
2. 在函数体内部使用`yield`表达式，输出不同的内部状态；

```javascript
function* helloGen(){
    yield 'hello';
    yield 'world';
    return 'end';
}
let hello = helloGen();
hello.next();// {value: "hello", done: false}
hello.next();// {value: "world", done: false}
hello.next();// {value: "end", done: true}
hello.next();// {value: undefined, done: true}
```

上面的generator函数内部使用了2两个`yield`表达式和一个return语句，所以这个函数有三个状态’hello‘，’world‘，’end‘。

generator函数的调用方法和普通函数一样，不同的是调用generator函数之后，该函数并不执行，返回的也不是函数的执行结果，而是返回一个遍历器对象，想要获得函数的内部状态必须调用遍历器对象的next方法，调用一次next方法generator函数就会从函数头部或者上次停下来的地方开始执行，直到遇到下一个yield表达式或者return语句为止。换句话说，generator函数是分段执行的，yield表达式是暂停执行的标志，而next方法是恢复执行。

上面代码一共执行了四次next方法：

1. 第一次调用，generator函数开始执行，直到遇到第一个yield为止。next方法的返回值是一个对象他的value属性是当前yield表达式的值，done属性为false，表示遍历还没有结束。
2. 第二次调用，generator从上一次yield表达式停下的地方开始继续执行，直到下一个yield表达式为止。next方法返回的对象的value属性是yield表达式的值’world‘。done属性为false。
3. 第三次调用，generator从上次yield表达式停下的地方开始继续执行，直到遇到return语句（如果没有return就执行到函数结束）。next方法返回的对象的value属性是return语句后面表达式的值："end"（如果没有return的话，值为undefined），done属性的值为true，表示遍历结束。
4. 第四次调用，此时generator函数已经运行完毕，next方法返回的对象的value属性为undefined，done属性为true。之后再去调用next方法返回的依然是这个值。

###### yield表达式

yield表达式是暂停标志，在调用next方法时，generator函数会从函数头部或上一次暂停的地方继续执行，直到yield表达式为止，将yield表达式的值作为输出对象的value。

yield表达式只能在generator函数中使用。yield表达式如果用在另一个表达式中，必须放在圆括号里面。如果是用作函数参数或者放在赋值表达式的右边，可以不加括号。

next方法

yield表达式是没有返回值的，或者说总是返回undefined，next方法可以带入一个参数，这个参数会作为上一个yield表达式的返回值，看一个例子：

```javascript
function*fun(){
    const a = yield 1 + 2;
    console.log(a);
}
const gen = fun();
gen.next(); // { value: 3, done: false }
gen.next(); // a: undefined
```

这个例子中的a为undefined就是因为yield表达式是没有返回值得，但是通过next方法我们可以传入一个值作为yield表达式的值。还有一个值得注意的地方，就是当我们首次调用next方法时，传入参数是不起作用的，第一次调用next方法起的是启动函数的作用。

for...of

for...of 可以循环可以自动遍历Generator函数运行返回的遍历器对象。不需要再去调用next方法。

```javascript
function * func(){
    yield 12;
    yield 15;
    yield 16;
    yield 17;
    yield 18;
    return 19
}
const gen = func();
for( let i of gen) {
    console.log(i);
}
// 12 15 16 17 18 


```

注意return语句的返回值19，不会再for...of循环中。除了`for...of`循环以外，扩展运算符（`...`）、解构赋值和`Array.from`方法内部调用的，都是遍历器接口。（Array.from方法是将类数组转化为数组。）

throw方法

Generator.prototype.throw()

Generator函数返回的遍历器对象都有一个throw方法，可以在函数之外抛出错误在函数内捕获。看个例子：

```javascript
function *func(){
    try{
        yield 10;
    } catch(e){
        console.log('inner error', e);
    }
}
const lele = func();
lele.next();
try{
    lele.throw(12);
    lele.throw(13);
}catch(e){
    console.log('outer error', e)
}
// inner error 12
// outer error 13
```

这个例子中在外面使用了两个throw方法，第一次的时候被函数体内的catch捕获，第二次被外部的catch捕获。这是因为函数体已经执行完毕，不会再捕获第二个error。这里要注意throw方法就相当于重启函数的执行，同时立马抛了一个错误。同时如果这个错误被捕获了，还会附带执行下一条yield表达式，就是再执行一次next方法。

return

Generator.prototype.return

return 方法表示将Generator函数返回的遍历器对象的done设置为true。表示函数已经执行完了。如果不提供参数返回值得value属性为undefined。如果在Generator函数中有try...finally,而且正在执行try代码块，那么return方法会导致立即加入finally代码块，执行完之后退出。

yield*表达式

如果在一个Generator函数中调用另一个Generator函数，需要在前者的函数体中手动遍历。有了yield*表达式，就不需要去手动遍历了。

```javascript
function *a(){
    yield 1;
    yield 2;
}
function *b(){
    yield 3;
    yield* a();
}
 // 相当于
 function*b(){
 	yield 3;
 	yield 1;
 	yield 2;
 }
```

### 

