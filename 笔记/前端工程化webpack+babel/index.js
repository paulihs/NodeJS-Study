




// modules是一个对象，key是每个模块的路径，值是每个模块的内容，以function包裹，通过eval执行。
/**
 * modules是一个对象，
 * 他的key是每个模块的路径，
 * 值是每个模块的内容，
 * 以function包裹，
 * 通过eval执行。
 */

(function(modules) { // webpackBootstrap

    // 模块缓存
    var installedModules = {};

    // The require function
    // moduleId是模块的路径，需要注意的是每个文件的moduleId是固定的，不会因为引用该文件的位置不一样，而导致moduleId（路径）不一样
    //比如 ./src/bye.js 和 ../src/bye.js 引用的是同一个文件，但是他们的导入路径不一样，但是webpack打包之后，这个文件的moduleId是不变的，都是"./src/bye.js",无论你在何处引用此模块。

    function __webpack_require__(moduleId) {

        // 检查是否在缓存中
        if(installedModules[moduleId]) {
            // 在的话直接返回对应模块的输出
            return installedModules[moduleId].exports;
        }
        // 不在缓存中
        // Create a new module (and put it into the cache)
        // 创建一个新的模块，并把它放入缓存中
        var module = installedModules[moduleId] = {
            i: moduleId,
            l: false,
            exports: {}
        };

        // Execute the module function
        // 执行模块文件
        modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

        // Flag the module as loaded
        //将模块的load属性置为true。
        module.l = true;

        // Return the exports of the module
        // 导出模块的exports
        return module.exports;
    }


    // expose the modules object (__webpack_modules__)
    // 暴露webpack的打包依赖图对象，这个modules就是 立即执行函数的入参
    __webpack_require__.m = modules;

    // expose the module cache
    // 暴露模块缓存
    __webpack_require__.c = installedModules;

    // define getter function for harmony exports
    // 定义模块的输出，这里的输出指的是通过export导出的变量，注意与export default的区别

    __webpack_require__.d = function(exports, name, getter) {
        // 使用export导出的变量，只暴露他的getter方法，说明该变量只可以使用，不可以赋值
        if(!__webpack_require__.o(exports, name)) {
            Object.defineProperty(exports, name, { enumerable: true, get: getter });
        }
    };

    // define __esModule on exports
    // 在exports上定义__esModule
    __webpack_require__.r = function(exports) {
        if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
            Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
        }
        Object.defineProperty(exports, '__esModule', { value: true });
    };

    // create a fake namespace object
    // mode & 1: value is a module id, require it
    // mode & 2: merge all properties of value into the ns
    // mode & 4: return value when already ns object
    // mode & 8|1: behave like require
    __webpack_require__.t = function(value, mode) {
        if(mode & 1) value = __webpack_require__(value);
        if(mode & 8) return value;
        if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
        var ns = Object.create(null);
        __webpack_require__.r(ns);
        Object.defineProperty(ns, 'default', { enumerable: true, value: value });
        if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
        return ns;
    };

    // getDefaultExport function for compatibility with non-harmony modules
    __webpack_require__.n = function(module) {
        var getter = module && module.__esModule ?
            function getDefault() { return module['default']; } :
            function getModuleExports() { return module; };
        __webpack_require__.d(getter, 'a', getter);
        return getter;
    };

    // Object.prototype.hasOwnProperty.call
    __webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

    // __webpack_public_path__ 配置的publicPath
    __webpack_require__.p = "";


    // Load entry module and return exports
    return __webpack_require__(__webpack_require__.s = "./src/index.js");
})
/************************************************************************/
({

    /***/ "./src/bye.js":
    /*!********************!*\
      !*** ./src/bye.js ***!
      \********************/
    /*! exports provided: default, abs, b, ninja */
    /***/ (function(module, __webpack_exports__, __webpack_require__) {

        "use strict";
        eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"abs\", function() { return abs; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"b\", function() { return b; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"ninja\", function() { return ninja; });\n/* harmony default export */ __webpack_exports__[\"default\"] = (function () {\n  console.log(1341234);\n});\nfunction abs() {\n  console.log('abs');\n}\nvar b = 'ninja';\nvar ninja = 650;\n\n\n//# sourceURL=webpack:///./src/bye.js?");

        /***/ }),

    /***/ "./src/index.js":
    /*!**********************!*\
      !*** ./src/index.js ***!
      \**********************/
    /*! no exports provided */
    /***/ (function(module, __webpack_exports__, __webpack_require__) {

        "use strict";
        eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _bye_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./bye.js */ \"./src/bye.js\");\nconsole.log(_bye_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"]);\n\n\nconsole.log(Object(_bye_js__WEBPACK_IMPORTED_MODULE_0__[\"abs\"])());\nconsole.log(_bye_js__WEBPACK_IMPORTED_MODULE_0__);\nObject(_bye_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])();\n\n//# sourceURL=webpack:///./src/index.js?");

        /***/ })

});