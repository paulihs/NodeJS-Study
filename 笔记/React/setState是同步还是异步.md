### setState是同步还是异步？



#### 异步的动机和原理——批量更新的艺术



##### setState异步的动机—— 避免频繁的rerender

setState是一个异步的方法，这意味着当我们执行完setState后，state本身并不会立刻发生改变



#### 异步的动机和原理——批量更新的艺术

setState调用之后会发生什么？

如果站在生命周期的角度去思考这个问题的话，可以得出如下这个结论：

![](E:\NodeJS-Study\笔记\React\setState引发的生命周期.png)

从上图中，我们可以看到一个由setState触发的更新流程，涉及rerender在内的多个步骤。rerender的过程包含diff算法以及相应的DOM操作，会带来较大的性能开销。

###### 假设‘一次setState就触发一个完整的更新流程’，那么每一次的setState调用都会触发一次rerender，那么我们的页面可能没刷新几次就卡死了

```JavaScript
this.setState({

  count: this.state.count + 1    ===>    shouldComponentUpdate->componentWillUpdate->render->componentDidUpdate

});

this.setState({

  count: this.state.count + 1    ===>    shouldComponentUpdate->componentWillUpdate->render->componentDidUpdate

});

this.setState({

  count: this.state.count + 1    ===>    shouldComponentUpdate->componentWillUpdate->render->componentDidUpdate

});

```

事实上，这正是setState异步的一个重要的原因——**避免频繁的re-render**





#### 从源码角度看setState工作流

##### 解读setState工作流

setState的流程：

![](E:\NodeJS-Study\笔记\React\setState工作流.png)

下面按照流程，逐个在源码中对号入座。

setState入口函数：

```JavaScript
ReactComponent.prototype.setState = function (partialState, callback) {

  // enqueue 是排队的意思，从这个方法的命名来看，可以知道该方法这将这个组件的这个状态的变化放入一个队列中
    // 这个队列中包含不同组件的状态变更的任务
  this.updater.enqueueSetState(this, partialState);

  if (callback) {

    this.updater.enqueueCallback(this, callback, 'setState');

  }

};

```

入口函数充当了一个分发器的角色，根据入参的不同，将其分发到不同的功能函数中去。这里以partialState参数为对象为例，可以看到它直接调用this.updater.enqueueSetState 这个方法：

```JavaScript

enqueueSetState: function (publicInstance, partialState) {
  // 根据 this 拿到对应的组件实例
  var internalInstance = getInternalInstanceReadyForUpdate(publicInstance, 'setState');
  // 这个 queue 对应的就是一个组件实例的 state变更任务的 数组
    // 这个变更任务数组是和组件实例绑定的
  var queue = internalInstance._pendingStateQueue || (internalInstance._pendingStateQueue = []);
  queue.push(partialState);
  //  enqueueUpdate 用来处理当前的组件实例
  enqueueUpdate(internalInstance);
}
```

这里总结一下enqueueSetState做的两件事：

1. 将新的状态变更任务放进组件的状态变更队列；

2. 用enqueueUpdate处理当前的组件实例；

继续，看看enqueueUpdate做了什么：

```JavaScript
function enqueueUpdate(component) {

  ensureInjected();

  // 注意这一句是问题的关键，isBatchingUpdates标识着当前是否处于批量创建/更新组件的阶段

  if (!batchingStrategy.isBatchingUpdates) {

    // 若当前没有处于批量创建/更新组件的阶段，则立即执行batchedUpdates方法
    // 这里

    batchingStrategy.batchedUpdates(enqueueUpdate, component);

    return;

  }

  // 否则，先把组件塞入 dirtyComponents 队列里，让它“再等等”

  dirtyComponents.push(component);

  if (component._updateBatchNumber == null) {

    component._updateBatchNumber = updateBatchNumber + 1;

  }

}

```

这个enqueueUpdate函数中引用了一个很重要的自由变量batchingStrategy这个对象，这个对象的isBatchingUpdate是属性直接决定当下是走更新流程还是排队等待流程；其中的batchedUpdates方法更是能够直接发起更新流程。

##### 这里我们大胆推测，batchingStrategy或许正是React内部专门用于管控批量更新的对象。

下面来研究一下这个batchingStrategy

> Strategy: n. 策略；

```JavaScript
/**

 * batchingStrategy源码

**/

var ReactDefaultBatchingStrategy = {

  // 全局唯一的锁标识

  isBatchingUpdates: false,
 
  // 发起更新动作的方法

  batchedUpdates: function(callback, a, b, c, d, e) {

    // 缓存锁变量

    var alreadyBatchingStrategy = ReactDefaultBatchingStrategy. isBatchingUpdates

    // 把锁“锁上”

    ReactDefaultBatchingStrategy. isBatchingUpdates = true

    if (alreadyBatchingStrategy) {
      callback(a, b, c, d, e)
    } else {
      // 启动事务，将 callback 放进事务里执行
//注意了：在第一个setState任务进来的时候，就是走的这个分支，因为isBatchingUpdates的初始值是false；
        // 至于下面这行代码到底干了什么，我们后面再细说。
      transaction.perform(callback, null, a, b, c, d, e)

    }

  }

}

```

​		这个batchingStrategy对象并不复杂，可以将它理解为一个**锁管理器**。

​		这里的锁指的是react全局唯一的isBatchingUpdates变量，isBatchingUpdates的初始值是false，意味着当前

没有进行任何批量更新操作。当React调用batchedUpdate去执行更新动作时，会先把这个锁给锁上

（isBatchingUpdates 置为true），表面当前已经处于批量更新过程中了。当锁被锁上的时候，任何需要更新的组

件都只能暂时进入dirtyComponents里面排队等候，这个时候是状态更新的任务是不能插队的。此处出现的任务

锁的思想，是React面对大量状态变更任务，依然能够有序分批处理的基石。



理解了批量更新的整体管理机制，这里我们还有注意BatchedUpdates中，这个让人不解（非常重要）的调用：

```JavaScript
transaction.perform(callback, null, a, b, c, d, e);
```

这行代码为我们引出了一个非常硬核的概念——**React中的Transaction（事务）机制**。



#### 理解React中的Transaction（事务）机制

Transaction 在 React 源码中的分布可以说非常广泛。如果你在 Debug React 项目的过程中，发现函数调用栈中出现了 initialize、perform、close、closeAll 或者 notifyAll 这样的方法名，那么很可能你当前就处于一个 Trasaction 中。

Transaction 在 React 源码中表现为一个核心类，React 官方曾经这样描述它：**Transaction 是创建一个黑盒**，该黑盒能够封装任何的方法。因此，那些需要在函数运行前、后运行的方法可以通过此方法封装（即使函数运行中有异常抛出，这些固定的方法仍可运行），实例化 Transaction 时只需提供相关的方法即可。

这段话的描述还是不够直观，那么来看看React源码中对Transaction的注释：

```
* <pre>

 *                       wrappers (injected at creation time)
 *                                      +        +
 *                                      |        |
 *                    +-----------------|--------|--------------+
 *                    |                 v        |              |
 *                    |      +---------------+   |              |
 *                    |   +--|    wrapper1   |---|----+         |
 *                    |   |  +---------------+   v    |         |
 *                    |   |          +-------------+  |         |
 *                    |   |     +----|   wrapper2  |--------+   |
 *                    |   |     |    +-------------+  |     |   |
 *                    |   |     |                     |     |   |
 *                    |   v     v                     v     v   | wrapper
 *                    | +---+ +---+   +---------+   +---+ +---+ | invariants
 * perform(anyMethod) | |   | |   |   |         |   |   | |   | | maintained
 * +----------------->|-|---|-|---|-->|anyMethod|---|---|-|---|-|-------->
 *                    | |   | |   |   |         |   |   | |   | |
 *                    | |   | |   |   |         |   |   | |   | |
 *                    | |   | |   |   |         |   |   | |   | |
 *                    | +---+ +---+   +---------+   +---+ +---+ |
 *                    |  initialize                    close    |
 *                    +-----------------------------------------+
 * </pre>
```

再来结合上文中涉及事务的代码来看：

```JavaScript
transaction.perform(callback, null, a, b, c, d, e);
```

所谓事务（transaction）就是一个壳子，它首先会将目标函数（callback）用warpper（一组initialize和close方法称为一个warpper）封装起来，同时需要使用Transaction类暴露的perform方法去执行它。正如上面的注释所示，在anyMethod执行之前，perform会先执行所有wrapper的initialize方法，之后执行anyMethod，最后执行所有warpper的close方法。

下面结合对事务机制的理解，我们继续来看ReactDefaultBatchingStrategy这个对象。

这个ReactDefaultBatchingStrategy其实就是一个批量更新策略事务。它有两个warpper：

FLUSH_BATCHED_UPDATES 和 RESET_BATCHED_UPDATES。



```javascript
var RESET_BATCHED_UPDATES = {

  initialize: emptyFunction,

  close: function () {
// 将'任务锁'打开
    ReactDefaultBatchingStrategy.isBatchingUpdates = false;

  }

};

var FLUSH_BATCHED_UPDATES = {

  initialize: emptyFunction,
// 循环所有的dirtyComponent，调用updateComponent来执行组件的生命周期
  close: ReactUpdates.flushBatchedUpdates.bind(ReactUpdates)

};

var TRANSACTION_WRAPPERS = [FLUSH_BATCHED_UPDATES, RESET_BATCHED_UPDATES];

```

我们把这两个wrapper套进Transaction的执行机制里，不难得出这样一个流程：

在callback执行完之后（同时其后面的同步任务也执行完之后），RESET_BATCHED_UPDATES将isBatchingUpdates置为false，FLUSH_BATCHED_UPDATES执行flushBatchedUpdates，然后里面会循环所有dirtyComponent，调用updateComponent来执行所有组件的生命周期。（componentWillreceiveProps ->shouldComponentUpdate -> componentWillUpdate -> render -> componentDidUpdate）,完成组件的更新。

注意 开启状态更新任务 收集的过程是同步的，就是事务中anyMethod这个部分。这个anyMethod不能仅仅看做是一个函数，而是要看做从anyMethod开始的同步任务。比如上面这些例子中第一个setState开启事务，然后同步执行后面的setState，将状态更新的任务放到队列中，然后这个anyMethod部分就执行完毕了，后面开始打开任务锁，再把dirtyComponent循环一遍，用updateComponent来执行对应组件的生命周期。

