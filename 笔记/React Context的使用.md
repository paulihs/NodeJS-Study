## context是什么？
> 在react应用中，数据是通过`props`属性自上而下传递的。单这种做法对于某些类型的属性来说极其繁琐（比如主题），这些属性在应用中的许多组价都需要。Context提供了一种在组件之间共享此类值的方式，不必通过组件树逐层传递`props`。

## 核心API
### React.createContext

```javascript
<!--file: mycontext.js-->
import { createContext } from 'react';
const MyContext = createContext(defaultValue);
export default MyContext;
```
使用createContext创建一个Context对象，当React渲染一个订阅了这个context对象的组件，这个组件会从组件树中离自身最近的那个匹配的Provider中读取当前context的值。只有当组件所处的树中没有匹配到Provider时，其defaultValue参数才会生效。

### Context容器：Context.Provider

```javascript
import MyContext from './mycontext.js';
<MyContext.Provider value={/* 某个值*/}/>
```
每个Context对象都会返回一个`Provider`React组件，他允许消费组件订阅context的变化。`Provider`接受一个`value`属性，传递给消费组件。一个`Provider`可以和多个消费组件有对应关系。多个`Provider`也可以嵌套使用，里层的会覆盖外层的数据。当`Provider`的value值发生变化的时候，它内部的所有消费组件都会重新渲染。Provider及其内部的consumer组件都不受制于shouldComponentUpdate函数，因此当consumer组件在其祖先组件推测更新的情况下也能更新。通过新旧值检测来确定变化，使用了与`Object.is`相同算法。

### 在class组件中使用Context： Class.contextType
在class组件中使用Context，我们需要将class类的contextType属性设置为context对象。这可以让该class组件实例使用this.context来消费最近的Provider上的那个值，你可以在任何生命周期中访问到它，包括render函数中。

```javascript
import MyContext from './mycontext.js';
class MyClass extends React.Component {
  componentDidMount() {
    let value = this.context;
    /* 在组件挂载完成后，使用 MyContext 组件的值来执行一些有副作用的操作 */
  }
  componentDidUpdate() {
    let value = this.context;
    /* ... */
  }
  componentWillUnmount() {
    let value = this.context;
    /* ... */
  }
  render() {
    let value = this.context;
    /* 基于 MyContext 组件的值进行渲染 */
  }
}
MyClass.contextType = MyContext;
```
当然如果你正在使用class的静态属性，你也可以这么写。

```javascript
import MyContext from './mycontext.js';
class MyClass extends React.Component {
  static contextType = MyContext;
  render() {
    let value = this.context;
    /* 基于这个值进行渲染工作 */
  }
}
```

### 在函数式组件中使用context： Context.Consumer

```javascript
import MyContext from './mycontext.js';
<MyContext.Consumer>
  {value => /* 基于 context 值进行渲染*/}
</MyContext.Consumer>
```

这里的函数组件可以订阅到context的变化，这个函数接受当前的context值，返回一个React节点，传递给函数的value值等同于往上组件树离这个context最近的Provider提供的value值,如果没有对应的Provider，value参数等同于传递给createContext()的defaultValue。注意到了吗，Provider是可以嵌套的，里面的值会覆盖外面的，所以consumer的值来自于最近的Provider。

### 在嵌套组件（消费组件）中更新Context
在一个组件树中嵌套很深的组件中更新context是很有必要的。在这种场景下，你可以通过context传递一个函数，使得consumers更新context：


```javascript
// context
import { createContext } from 'react';
export default createContext({ theme: 'red', toggleTheme: ()=>{}});

 <ThemeContext.Provider value={{ theme: 'red', toggleTheme: ()=>{/* 相关变化context的逻辑*/}}}>
    <Content />
 </ThemeContext.Provider>

 <ThemeContext.Consumer>
    {({theme, toggleTheme}) => (
    <button
        onClick={toggleTheme}
        style={{backgroundColor: theme.background}}>
        Toggle Theme
    </button>
    )}
 </ThemeContext.Consumer>

```
### 消费多个context
为了确保context快速进行重渲染，React需要使每个consumers组件的context在组件树中成为一个单独的节点。

```javascript
// Theme context，默认的 theme 是 “light” 值
const ThemeContext = React.createContext('light');

// 用户登录 context
const UserContext = React.createContext({
  name: 'Guest',
});

class App extends React.Component {
  render() {
    const {signedInUser, theme} = this.props;

    // 提供初始 context 值的 App 组件
    return (
      <ThemeContext.Provider value={theme}>
        <UserContext.Provider value={signedInUser}>
          <Layout />
        </UserContext.Provider>
      </ThemeContext.Provider>
    );
  }
}

function Layout() {
  return (
    <div>
      <Sidebar />
      <Content />
    </div>
  );
}

// 一个组件可能会消费多个 context
function Content() {
  return (
    <ThemeContext.Consumer>
      {theme => (
        <UserContext.Consumer>
          {user => (
            <ProfilePage user={user} theme={theme} />
          )}
        </UserContext.Consumer>
      )}
    </ThemeContext.Consumer>
  );
}
```