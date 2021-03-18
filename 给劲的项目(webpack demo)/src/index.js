// import _ from 'lodash';
// import './style.css';
// import img from './jessie.jpg';
// // import bye from "./bye.js";
// function component() {
//     // bye();
//     const ele = document.createElement('div');
//     ele.innerText = _.join(['hello', 'webpack'], ' ');
//     const myIcon = new Image();
//     myIcon.src = img;
//
//     ele.appendChild(myIcon);
//     return ele;
// }
// document.body.appendChild(component());

    function getComponent() {

        return import(/* webpackChunkName: "lodash" */ 'lodash').then(({ default: _ }) => {
            const element = document.createElement('div');

            element.innerHTML = _.join(['Hello', 'webpack'], ' ');

            return element;

        }).catch(error => 'An error occurred while loading the component');
    }


    getComponent().then(component => {
        document.body.appendChild(component);
    })
