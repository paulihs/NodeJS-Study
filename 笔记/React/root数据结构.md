```JavaScript
// 我们使用的ReactDom.render
const ReactDOM: Object = {
  render(
    element: React$Element<any>,
    container: DOMContainer,
    callback: ?Function,
  ) {

    return legacyRenderSubtreeIntoContainer(
      null,
      element,
      container,
      false,
      callback,
    );
  },
};

function legacyCreateRootFromDOMContainer(
  container: DOMContainer,
  forceHydrate: boolean,
): Root {
  // 默认是false
  const shouldHydrate =
    forceHydrate || shouldHydrateDueToLegacyHeuristic(container);

  // First clear any existing content.
  if (!shouldHydrate) {
    let warned = false;
    let rootSibling;
    // rootSibling默认是undefined
    // 如果container.lastChild存在（被选节点的最后一个子节点），就把这个子节点删除
    // 就是说 根节点如果不是空的标签，就把他的子节点删除，一直删到空为止（因为是while语句）
    while ((rootSibling = container.lastChild)) {
      container.removeChild(rootSibling);
    }
  }

  // Legacy roots are not async by default.
  const isConcurrent = false;
  // 初始化 时 入参  dom，false， false
  return new ReactRoot(container, isConcurrent, shouldHydrate);
}

function legacyRenderSubtreeIntoContainer(
  parentComponent: ?React$Component<any, any>,
  children: ReactNodeList,
  container: DOMContainer,
  forceHydrate: boolean,
  callback: ?Function,
) {

  // 初始化的时候forceHydrate 是false
  // parentComponent 是null

  // TODO: Without `any` type, Flow says "Property cannot be accessed on any
  // member of intersection type." Whyyyyyy.
  // 先判断DOM中有没有这个属性

  let root: Root = (container._reactRootContainer: any);

  // initial mount (初始化)
  if (!root) {
    // 没有这个属性就是初次渲染
    // Initial mount
    // 给根节点添加这个属性，同时赋值给root。
    // 
    root = container._reactRootContainer = legacyCreateRootFromDOMContainer(
      container,
      forceHydrate,
    );
    if (typeof callback === 'function') {
      const originalCallback = callback;
      callback = function() {
        const instance = getPublicRootInstance(root._internalRoot);
        originalCallback.call(instance);
      };
    }
    // Initial mount should not be batched.
    // 初始化的时候不要批量更新
    unbatchedUpdates(() => {
      if (parentComponent != null) {
        root.legacy_renderSubtreeIntoContainer(
          parentComponent,
          children,
          callback,
        );
      } else {
        // children就是App这个根组件，callback就是回调函数。
        // 执行root的render方法  
        root.render(children, callback);
      }
    });
  } else {
    if (typeof callback === 'function') {
      const originalCallback = callback;
      callback = function() {
        const instance = getPublicRootInstance(root._internalRoot);
        originalCallback.call(instance);
      };
    }
    // Update
    if (parentComponent != null) {
      root.legacy_renderSubtreeIntoContainer(
        parentComponent,
        children,
        callback,
      );
    } else {
      root.render(children, callback);
    }
  }
  return getPublicRootInstance(root._internalRoot);
}




```



```javascript
// 
function ReactRoot(
  container: DOMContainer,
  isConcurrent: boolean,
  hydrate: boolean,
) {
  const root = createContainer(container, isConcurrent, hydrate);
  this._internalRoot = root;
}
// 根据 根容器(DOM节点) 创建  Fiber节点
export function createContainer(
  containerInfo: Container,
  isConcurrent: boolean,
  hydrate: boolean,
): OpaqueRoot {
  return createFiberRoot(containerInfo, isConcurrent, hydrate);
}

// 创建root(根Fiber)
// root是一个对象，保存着和根节点相关的信息，如Fiber等
export function createFiberRoot(
  containerInfo: any,
  isConcurrent: boolean,
  hydrate: boolean,
): FiberRoot {
  // Cyclic construction. This cheats the type system right now because
  // stateNode is any.
    // 创建根节点的Fiber
  const uninitializedFiber = createHostRootFiber(isConcurrent);

  let root;
  if (enableSchedulerTracing) {
    root = ({
      current: uninitializedFiber,
      containerInfo: containerInfo,
      pendingChildren: null,

      earliestPendingTime: NoWork,
      latestPendingTime: NoWork,
      earliestSuspendedTime: NoWork,
      latestSuspendedTime: NoWork,
      latestPingedTime: NoWork,

      pingCache: null,

      didError: false,

      pendingCommitExpirationTime: NoWork,
      finishedWork: null,
      timeoutHandle: noTimeout,
      context: null,
      pendingContext: null,
      hydrate,
      nextExpirationTimeToWorkOn: NoWork,
      expirationTime: NoWork,
      firstBatch: null,
      nextScheduledRoot: null,

      interactionThreadID: unstable_getThreadID(),
      memoizedInteractions: new Set(),
      pendingInteractionMap: new Map(),
    }: FiberRoot);
  } else {
    root = ({
      current: uninitializedFiber,
      containerInfo: containerInfo,
      pendingChildren: null,

      pingCache: null,

      earliestPendingTime: NoWork,
      latestPendingTime: NoWork,
      earliestSuspendedTime: NoWork,
      latestSuspendedTime: NoWork,
      latestPingedTime: NoWork,

      didError: false,

      pendingCommitExpirationTime: NoWork,
      finishedWork: null,
      timeoutHandle: noTimeout,
      context: null,
      pendingContext: null,
      hydrate,
      nextExpirationTimeToWorkOn: NoWork,
      expirationTime: NoWork,
      firstBatch: null,
      nextScheduledRoot: null,
    }: BaseFiberRootProperties);
  }

  uninitializedFiber.stateNode = root;

  // The reason for the way the Flow types are structured in this file,
  // Is to avoid needing :any casts everywhere interaction tracing fields are used.
  // Unfortunately that requires an :any cast for non-interaction tracing capable builds.
  // $FlowFixMe Remove this :any cast and replace it with something better.
  return ((root: any): FiberRoot);
}

// 创建根节点的Fiber
export function createHostRootFiber(isConcurrent: boolean): Fiber {
  // isConcurrent 默认是false
  let mode = isConcurrent ? ConcurrentMode | StrictMode : NoContext;

  if (enableProfilerTimer && isDevToolsPresent) {
    // Always collect profile timings when DevTools are present.
    // This enables DevTools to start capturing timing at any point–
    // Without some nodes in the tree having empty base times.
    mode |= ProfileMode;
  }

  return createFiber(HostRoot, null, null, mode);
}


```



```JavaScript

// 创建新Fiber
const createFiber = function(
  tag: WorkTag,
  pendingProps: mixed,
  key: null | string,
  mode: TypeOfMode,
): Fiber {
  // $FlowFixMe: the shapes are exact here but Flow doesn't like constructors
  return new FiberNode(tag, pendingProps, key, mode);
};

// Fiber工厂
function FiberNode(
  tag: WorkTag,
  pendingProps: mixed,
  key: null | string,
  mode: TypeOfMode,
) {

  // Fiber节点
  // Instance
  this.tag = tag;
  this.key = key;
  this.elementType = null;
  this.type = null;
  this.stateNode = null;

  // Fiber
  this.return = null;
  this.child = null;
  this.sibling = null;
  this.index = 0;

  this.ref = null;

  this.pendingProps = pendingProps;
  this.memoizedProps = null;
  this.updateQueue = null;
  this.memoizedState = null;
  this.contextDependencies = null;

  this.mode = mode;

  // Effects
  this.effectTag = NoEffect;
  this.nextEffect = null;

  this.firstEffect = null;
  this.lastEffect = null;

  this.expirationTime = NoWork;
  this.childExpirationTime = NoWork;

  this.alternate = null;

  if (enableProfilerTimer) {
    // Note: The following is done to avoid a v8 performance cliff.
    //
    // Initializing the fields below to smis and later updating them with
    // double values will cause Fibers to end up having separate shapes.
    // This behavior/bug has something to do with Object.preventExtension().
    // Fortunately this only impacts DEV builds.
    // Unfortunately it makes React unusably slow for some applications.
    // To work around this, initialize the fields below with doubles.
    //
    // Learn more about this here:
    // https://github.com/facebook/react/issues/14365
    // https://bugs.chromium.org/p/v8/issues/detail?id=8538
    this.actualDuration = Number.NaN;
    this.actualStartTime = Number.NaN;
    this.selfBaseDuration = Number.NaN;
    this.treeBaseDuration = Number.NaN;

    // It's okay to replace the initial doubles with smis after initialization.
    // This won't trigger the performance cliff mentioned above,
    // and it simplifies other profiler code (including DevTools).
    this.actualDuration = 0;
    this.actualStartTime = -1;
    this.selfBaseDuration = 0;
    this.treeBaseDuration = 0;
  }

  if (__DEV__) {
    this._debugID = debugCounter++;
    this._debugSource = null;
    this._debugOwner = null;
    this._debugIsCurrentlyTiming = false;
    this._debugHookTypes = null;
    if (!hasBadMapPolyfill && typeof Object.preventExtensions === 'function') {
      Object.preventExtensions(this);
    }
  }
}
```



```JavaScript

```

```JavaScript
// 真正的 RENDER 在这里
ReactRoot.prototype.render = function(
  children: ReactNodeList,
  callback: ?() => mixed,
): Work {
  const root = this._internalRoot;
  // 创建任务
  const work = new ReactWork();
  callback = callback === undefined ? null : callback;

  // 如果callback存在，就把放入待执行队列
  if (callback !== null) {
    work.then(callback);
  }
  updateContainer(children, root, null, work._onCommit);
  return work;
};

// 更新根节点
// element就是App组件对应的react元素对象
// container就是 root对象，这个对象里面有根节点对应的Fiber对象
export function updateContainer(
  element: ReactNodeList,
  container: OpaqueRoot,
  parentComponent: ?React$Component<any, any>,
  callback: ?Function,
): ExpirationTime {
  const current = container.current;
  const currentTime = requestCurrentTime();
  const expirationTime = computeExpirationForFiber(currentTime, current);
  return updateContainerAtExpirationTime(
    element,
    container,
    parentComponent,
    expirationTime,
    callback,
  );
}

export function updateContainerAtExpirationTime(
  element: ReactNodeList,
  container: OpaqueRoot,
  parentComponent: ?React$Component<any, any>,
  expirationTime: ExpirationTime,
  callback: ?Function,
) {
  // TODO: If this is a nested container, this won't be the root.
  const current = container.current;

  const context = getContextForSubtree(parentComponent);
  if (container.context === null) {
    container.context = context;
  } else {
    container.pendingContext = context;
  }

  return scheduleRootUpdate(current, element, expirationTime, callback);
}
```

```JavaScript
// 入参分别是 节点类型，penddingProps，key，mode
function FiberNode(tag, pendingProps, key, mode){
      // Fiber节点
  // Instance
  this.tag = tag;
  this.key = key;
  this.elementType = null;
  this.type = null;
  this.stateNode = null;

  // Fiber
  this.return = null;
  this.child = null;
  this.sibling = null;
  this.index = 0;

  this.ref = null;

  this.pendingProps = pendingProps;
  this.memoizedProps = null;
  this.updateQueue = null;
  this.memoizedState = null;
  this.contextDependencies = null;

  this.mode = mode;

  // Effects
  this.effectTag = NoEffect;
  this.nextEffect = null;

  this.firstEffect = null;
  this.lastEffect = null;

  this.expirationTime = NoWork;
  this.childExpirationTime = NoWork;

  this.alternate = null;
}

let root = {
      current: uninitializedFiber,
      containerInfo: containerInfo,
      pendingChildren: null,

      pingCache: null,

      earliestPendingTime: NoWork,
      latestPendingTime: NoWork,
      earliestSuspendedTime: NoWork,
      latestSuspendedTime: NoWork,
      latestPingedTime: NoWork,

      didError: false,

      pendingCommitExpirationTime: NoWork,
      finishedWork: null,
      timeoutHandle: noTimeout,
      context: null,
      pendingContext: null,
      hydrate,
      nextExpirationTimeToWorkOn: NoWork,
      expirationTime: NoWork,
      firstBatch: null,
      nextScheduledRoot: null,
    };
```

