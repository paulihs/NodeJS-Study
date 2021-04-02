import React from 'react';
import ReactDOM from 'react-dom'
import App from './app'

// // 注册 service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js').then(registration => {
            console.log('SW registered: ', registration);
        }).catch(registrationError => {
            console.log('SW registration failed: ', registrationError);
        });
    });
}
// import(/* webpackChunkName: "app" */ './app.js').then(({default: _}) => {
//     const App = React.createElement(_);
//     ReactDOM.render(App, document.getElementById('react-root'));
// }).catch(error => {
//     console.log('An error occurred while loading the component')
// });


ReactDOM.render(<App/>, document.getElementById('react-root'));

