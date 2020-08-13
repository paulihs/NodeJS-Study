## Flex布局是什么？
Flex是Flexible Box的缩写，意为‘弹性布局’，用来为盒状模型提供最大的灵活性。
1. 任何一个容器都可以指定为Flex布局。

```css
.box {
    display: flex;    
}

```

2. 行内元素也可以使用Flex布局。

```css
.box {
    display: inline-flex;    
}
```
3. 设为Flex布局之后，子元素的`float`、`clear`、`vertical-align`属性将失效。

## 基本概念
采用Flex布局的元素，称为Flex容器，简称**容器**。他的所有子元素自动称为容器成员，称为Flex项目（item），简称‘**项目**’。
容器默认有两条轴：水平的主轴和垂直的交叉轴。主轴的开始位置（与边框的交叉点）叫做`main start`，结束位置叫做`main end`；交叉轴开始的位置叫`cross start`。结束的位置叫`cross end`。项目默认沿主轴排列。单个项目占据的主轴空间叫做`main size`，占据的交叉轴空间叫做`cross size`。

## 容器的属性
以下6个属性设置在容器上。

* flex-direction
* flex-wrap
* flex-flow
* justify-content
* align-items
* align-content

### 1. flex-direction
`flex-direction`属性决定主轴的方向（即项目的排列方向）。
他有四个可能的值：
1. row （默认值）：主轴为水平方向，起点在左边。
2. row-reverse：主轴为水平方向，起点在右边。
3. column：主轴为垂直方向，起点在上沿。
4. column-reverse：主轴为垂直方向，起点在下沿。

### 2. flex-wrap
默认情况下，项目都排在一条线上（又称轴线）。`flex-wrap`属性定义，如果一条轴线排不下，如何换行。
他有三个可能的值：
1. nowrap（默认值）：不换行。 
2. wrap：换行，第一行在上方。
3. wrap-reverse: 换行，第一行在下方。

### 3. flex-flow
`flex-flow`属性是`flex-direction`属性和`flex-wrap`属性的简写形式，默认值为`row nowrap`。

```css
.box {
  flex-flow: <flex-direction> || <flex-wrap>;
}
```

### 4. justify-content
`justify-content`属性定义了项目在主轴上的对齐方式。
他有五个可能的值：
1. flex-start（默认值）：左对齐
2. flex-end：右对齐
3. center：居中
4. space-between：两端对齐，中间间隔相等
5. space-around：每个项目的左右间隔都相等，所以，项目之间的间隔比项目与边框的间隔大一倍。
![效果图](https://user-gold-cdn.xitu.io/2020/2/27/17085a5131a56cd7?w=637&h=763&f=png&s=7217)

### 5.align-items
`align-items`属性定义项目在交叉轴上如何对齐。
他有也有五个可能的值：
1. flex-start：上对齐
2. flex-end：下对齐
3. center：居中
4. baseline：项目第一行文字的基线对齐
5. stretch（默认值）： 如果项目未设置高度或设为auto，将占满整个容器的高度。

### 6. align-content
`align-content`属性定义了多根轴线时，cross line（竖轴）的对齐方式，如果只有一条轴线，则该属性不起作用。

```css
.box {
  align-content: flex-start | flex-end | center | space-between | space-around | stretch;
}
```

![效果图](https://user-gold-cdn.xitu.io/2020/2/27/17085c55da063ce4?w=620&h=786&f=png&s=8280)
1. flex-start：与交叉轴的起点对齐。
2. flex-end：与交叉轴的终点对齐。
3. center：竖直居中。
4. space-between：与交叉轴两端对齐，轴线之间的间隔平均分布。
5. space-around：每根轴线两侧（水平轴上下两侧）的间隔都相等。所以，轴线之间的间隔比轴线与边框的间隔大一倍。
6. stretch（默认值）：每条轴线内容占满整个交叉轴。

## 项目的属性
以下6个属性设置在项目(子元素)上
1. order
2. flex-grow
3. flex-shrink
4. flex-basis
5. flex
6. align-self

### 1. order
order属性定义项目的排列顺序。数值越小，排列越靠前，默认为0。**注意：order为整数，可以为负**

![紫色为容器](https://user-gold-cdn.xitu.io/2020/2/28/1708964664ed23aa?w=751&h=480&f=png&s=3372)

### 2. flex-grow
`flex-grow`属性定义项目的放大比例，默认为0，即即使存在剩余空间也不放大。**注意：flex-grow为正数**
如果所有项目的flex-grow都为1，则他们会等分剩余空间，如果一个项目flex-grow为2，其他项目都为1，则前者占据的剩余空间是其他项的两倍。**注意理解这里的剩余空间这个概念，剩余空间指的是除去项目内容所占空间之后的剩余空间。比如下面例子中的剩余空间是除去数字文本占据的空间之后剩下的的空间，所以每个项目占据的空间= 项目内容所占空间 + 按比例分配给项目的剩余空间**
![flex-grow可以为小数](https://user-gold-cdn.xitu.io/2020/2/28/17089679c74aebb7?w=802&h=211&f=png&s=7337)

### 3. flex-shrink
flex-shrink属性定义了项目缩小比例，默认为1，即如果空间不足，该项目将缩小。

![](https://user-gold-cdn.xitu.io/2020/2/28/17089a36ca60567d?w=700&h=145&f=jpeg&s=18256)

如果项目的flex-shrink属性都为1，当空间不足时，都将等比例缩小。如果一个项目的flex-shrink为0，其他项目为1，则空间不足时，前者不缩小。负值对该属性无效。

### 4.flex-basis
flex-basis属性定义了在分配多余空间之前，项目占据的主轴空间（main size）。浏览器根据这个属性计算主轴是否有多余空间。他的默认值为auto。即项目本来的大小。他可以设为和`width`和`height`属性一样的值（比如100px），则项目将占据固定空间。flex-basis相当于项目的width属性，当项目同时设置了width和flex-basis时，width无效。

### 5. flex
flex属性是`flex-grow`，`flex-shrink`和`flex-basis`的简写，默认值为`0 1 auto`。后两个属性可选。

```css
.item {
  flex: none | [ <'flex-grow'> <'flex-shrink'>? || <'flex-basis'> ]
}
```

该属性有两个快捷值：auto （1 1 auto）和none（0 0 auto）

### align-self
`align-self`属性允许单个项目与其他项目不一样的对齐方式，可覆盖`align-items`属性。默认值为`auto`，表示继承父元素的`align-items`属性。

```css
.item {
  align-self: auto | flex-start | flex-end | center | baseline | stretch;
}
```
该属性可能取6个值，除了auto，其他都与align-items属性完全一致。