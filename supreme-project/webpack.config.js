const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const cleanWebpackPlugin = require('clean-webpack-plugin');
module.exports = {
    entry: './src/index.js',
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, 'dist'),
    },
    devtool: 'inline-source-map',

    // 告诉webpack-dev-server 从dist文件夹给 localhost:8000提供文件
    // webpack-dev-server 在编译后不会生成任何文件，相反他会将打包文件保存在内存中，
    // 并像在服务器根路径上挂载真实的文件一样提供他们
    devServer: {
        contentBase: './dist',
    },
    plugins: [
        //  清空 输出文件夹（本项目为dist）
        new cleanWebpackPlugin(),
        // todo 学习 HTMLWebpackPlugin 的使用
        new htmlWebpackPlugin({
            title: 'webpack-learning'
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
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
    mode: 'development',
};
