// TODO 关于什么是Fiber https://zhuanlan.zhihu.com/p/37095662

var queue = [];

ReacDOM.render = function (root, container) {
    queue.push(root)
    updateFiberAndView()
};

function getVdomFormQueue() {
    return queue.shift()
}

function Fiber(vnode){
    for(var i in vnode){
        this[i] = vnode[i]
    }
    this.uuid = Math.random()
}
//我们简单的Fiber目前来看，只比vdom多了一个uuid属性
function toFiber(vnode){
    if(!vnode.uuid){
        return new Fiber(vnode)
    }
    return vnode
}

function updateFiberAndView() {
    var now = new Date - 0;
    var deadline = new Date + 100;
    updateView() //更新视图，这会耗时，因此需要check时间
    if (new Date < deadline) {
        var vdom = getVdomFormQueue()
        var fiber = vdom, firstFiber
        var hasVisited = {}
        do {//深度优先遍历
            var fiber = toFiber(fiber);//A处
            if(!firstFiber){
                fibstFiber = fiber
            }
            if (!hasVisited[fiber.uuid]) {
                hasVisited[fiber.uuid] = 1
                //根据fiber.type实例化组件或者创建真实DOM
                //这会耗时，因此需要check时间
                updateComponentOrElement(fiber);
                if (fiber.child) {
                    //向下转换
                    if (new Date - 0 > deadline) {
                        queue.push(fiber.child) //时间不够，放入栈
                        break
                    }
                    fiber = fiber.child;
                    continue  //让逻辑跑回A处，不断转换child, child.child, child.child.child
                }
            }
            //如果组件没有children，那么就向右找
            if (fiber.sibling) {
                fiber = fiber.sibling;
                continue //让逻辑跑回A处
            }
            // 向上找
            fiber = fiber.return
            if(fiber === fibstFiber || !fiber){
                break
            }
        } while (1)
    }
    if (queue.length) {
        setTimeout(updateFiberAndView, 40)
    }
}

function updateComponentOrElement(fiber){
    var {type, stateNode, props} = fiber
    if(!stateNode){
        if(typeof type === "string"){
            fiber.stateNode = document.createElement(type)
        }else{
            var context = {}//暂时免去这个获取细节
            fiber.stateNode = new type(props, context)
        }
    }
    if(stateNode.render){
        //执行componentWillMount等钩子
        children = stateNode.render()
    }else{
        children = fiber.childen
    }
    var prev = null;
    //这里只是mount的实现，update时还需要一个oldChildren, 进行key匹配，重复利用已有节点
    for(var i = 0, n = children.length; i < n; i++){
        var child = children[i];
        child.return = fiber;
        if(!prev){
            fiber.child = child
        }else{
            prev.sibling = child
        }
        prev = child;
    }
}