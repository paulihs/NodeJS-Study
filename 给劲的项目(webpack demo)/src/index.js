import React from 'react';
import ReactDOM from 'react-dom'
//
// function GetComponent() {
//
//     return import(/* webpackChunkName: "app" */ './app.js').then(({ default: _ }) => {
//         const element = document.createElement('div');
//
//         element.innerHTML = _.join(['Hello', 'webpack'], ' ');
//
//         return element;
//
//     }).catch(error => 'An error occurred while loading the component');
// }
import(/* webpackChunkName: "app" */ './app.js').then(({default: _}) => {
    const App = React.createElement(_);
    ReactDOM.render(App, document.getElementById('react-root'));
}).catch(error => {
    console.log('An error occurred while loading the component')
});


