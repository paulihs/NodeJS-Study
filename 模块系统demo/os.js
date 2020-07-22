var path = require("path");

// // 格式化路径
// console.log('normalization : ' + path.normalize('/test/test1//2slashes/1slash/..'));
//
// // 连接路径
// console.log('joint path : ' + path.join('/test', 'test1', '2slashes/1slash', 'ta23b', '..'));

// 转换为绝对路径
// console.log('resolve : ' + path.resolve('/'));

// // 路径中文件的后缀名
// console.log('ext name : ' + path.extname('main.js'));


let yaoshui = require('./commonjs.js');
// require('./other.js')
let other = require('./other.js')

console.log('yaoshui',yaoshui)
yaoshui.hello = 12
console.log(yaoshui)
let artist = require('./commonjs.js');
console.log('艺术家',artist)
// let other = require('./other.js')
console.log('os other',other)
console.log(this,'this')
