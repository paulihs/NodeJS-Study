JS中，以`0b`开头的数为二进制。比如`0b11`就代表3. 

`0x`表示16进制

###### javascript能够处理的最大数字为`2^53`

我们可以在MAX_SAFE_INTEGER中看出。

```JavaScript
const max = Number.MAX_SAFE_INTEGER;
console.log(max);// 9007199254740991
```

超出这个范围的数字计算我们就无能为力了，现在我们可以使用**新的数据类型**`BigInt`来解决这个问题

bigint就是把<u>字母n放在数字的末尾</u>，他使得js有了处理大的离谱的数字的能力。

创建一个BigInt可以使用**<u>BigInt函数</u>**或者直接在数字的后面加n。

**注意：**

1. **n一定要小写**
2. BigInt函数**<u>不是构造函数</u>**，不可以使用new操作符调用。

bigint有一些方法可以使用：

1. toString 方法 ： 返回数字字符串
2. toLocaleString方法：  返回带逗号的数字字符串
3. valueOf 方法： 返回bigint本身

```JavaScript
const BigInt= 100000000000000000000000000n;
const bigint = BigInt(1000);
typeof BigInt ;// "bigint"
bigint.toString() // '1000'
bigint.toLocaleString(); // '1,000'
bigint.valueOf();// 1000n

```

BigInt只能与BigInt就行运算

```JavaScript
const bigNum = 100n;
bigNum * 2; // err bigint只能和bigint进行运算，不然会报错
```

