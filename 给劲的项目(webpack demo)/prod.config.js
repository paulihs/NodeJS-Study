const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    // 入口文件
    entry: './src/index.js',
    // bundle文件的地址、名称等信息
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'geijin.bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env','@babel/preset-react']
                    },
                },
            },
            //  这使得我们可以在模块中通过import引入css文件，
            //  当这个模块被加载时，会在head标签中添加一个内容为css样式的style标签
            //  这些loader是一颠倒的顺序去调用的，数组中的第一个loader最后一个执行
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ],
            },
            // 这个file-loader让我们可以在模块中使用import引入图片 ` import myImage from './my-image.png'`
            //  这个图片会被处理，然后添加到output文件夹，而这个myImage变量将包含这个图片被处理之后最终的路径
            //  当我们使用css-loader的时候，在css中使用这样的写法 url('./my-image.png') ,my-image图片会以与上面类似的方式被处理
            // 同样的事情也发生在使用html-loader 处理 <img src='./my-image.png'/> 的时候
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'file-loader',
                    // 'url-loader',
                ],
            },
            // 字体文件
            //  file-loader和url-loader 会处理任意文件，并把它们输出到output目录
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    'file-loader',
                ],
            }
        ]
    },
    plugins: [
        //  清空 输出文件夹（本项目为dist）
        new CleanWebpackPlugin(),
        // todo 学习 HTMLWebpackPlugin 的使用
        new htmlWebpackPlugin({
            title: '123',
            template: "./src/index.html"
        })
    ],
    //  默认值就是 production
    // mode: 'production'
    mode: 'development'
};