### Page Visibility Api（页面可见性）

页面可见性API是为了让开发人员知道页面是否对用户可见而推出的。

有三个部分组成：

1. `document.hidden`: 表示页面是否隐藏的布尔值。 页面隐藏包括页面在后台标签页中或者浏览器最小化。
2.  `document.visibilityState`: 表示下列3个可能的值。
   - 页面在后面标签页中，或者浏览器最小化  值为hidden
   - 页面在前台标签页中   值为visible
   - 页面在屏幕外执行预渲染处理  值为prerender

3. `visibilityChange`事件： 当页面从可见变为不可见或者从不可见变为可见，触发该事件。