#### JavaScript垃圾回收机制



###### 周期性： 垃圾回收程序每隔一定时间就会自动执行



##### 基本思路： 确定那个变量不会再使用，然后释放它占用的内存。



在如何标记未使用的变量有不同的实现方式。

在浏览器发展史上，用到过两种主要的标记策略： **标记清理和引用计数**。



##### 标记清理：

在垃圾回收程序运行的时候，会标记内存中储存的所有变量（注意：添加标记的方法有很多种）。

然后，它会将所有在上下文中的变量，以及被上下文中的变量引用的变量的标记去掉。

在此之后再被加上标记的变量就是待删除的了。

原因是在任何上下文中都访问不到它们了。

随后垃圾回收程序做一次垃圾清理，销毁带标记的所有值，并收回它们的内存。



##### 引用计数：

另一种没那么常用的垃圾回收策略是**引用计数**，其思路是对每个值都记录他被引用的次数。

声明变量并给他赋一个引用值时，这个值的引用数为1，如果同一个值又被赋给另一个变量，那么引用数加1。 类似的，如果保存对改值的引用的变量被其他值覆盖了，那么引用数减1。当一个值的引用数为0时，就说明没办法在访问到这个值了，因此就可以安全的回收其内存了。在下一次垃圾回收程序运行的时候，就会释放引用数为0的值的内存。













解除一个值的引用并不会自动导致相关内存被回收。解除引用的关键在于确保相关的值不在上下文里了，因此它在下一次垃圾回收时会被回收。





闭包会造成内存泄漏

https://www.cnblogs.com/fanlu/p/11176319.html

https://github.com/ljianshu/Blog/issues/65