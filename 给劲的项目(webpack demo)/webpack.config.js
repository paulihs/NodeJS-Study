const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
module.exports = {
    mode: 'development',

    // entry: './src/index.js',
    entry: {
        app: './src/index.js',
        // 对象语法
        // 用法：entry: { <entryChunkName> string | [string] } | {}
        // index another 这些叫chunkname
        // 描述入口的对象
        // index: {
        //     import: './src/index.js',
        //     dependOn: 'shared',
        // },
        // another: {
        //     import: './src/app.js',
        //     dependOn: 'shared',
        // },
        // shared: 'lodash',
    },
    output: {
        filename: "[name].bundle.js",
        chunkFilename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    // optimization: {
    //     splitChunks: {
    //         chunks: 'all',
    //     },
    // },
    // 配置source-map的配置较devtool   ！！！
    devtool: 'inline-source-map',

    // contentBase 用于指定不受webpack控制的资源文件的目录。
    // webpack-dev-server 在编译后不会生成任何文件，相反他会将打包文件保存在内存中，
    // 并像在服务器根路径上挂载真实的文件一样提供他们
    devServer: {
        //
        port: 8080,
        // 指定主机的ip，如果想要你的服务能在外部被访问，可以指定 0.0.0.0
        // host: '127.0.0.1',
        // 开始 Hot Module Replacement  模块热替换
        // hot: true,
        // contentBase 用于指定不受webpack控制的资源文件的目录。这类资源一般是静态资源。
        contentBase: './diast',
        // publicPath 指定 devServer在哪里通过webpack处理的打包文件，默认是在 '/'
        // 比如下面设置的这个/serve-content-base-at-this-url
        // webpack打包出来的文件都在这个目录下，但是要访问这个项目的话，要在后面加上/
        // 就是 http://localhost:8080/serve-content-base-at-this-url/
        publicPath: '/serve-content-base-at-this-url',
        // 指定这个文件名的文件作为index文件
        // index: 'meimei.html'
    },
    plugins: [
        //  清空 输出文件夹（本项目为dist）
        new CleanWebpackPlugin(),
        // todo 学习 HTMLWebpackPlugin 的使用
        new htmlWebpackPlugin({
            title: 'my',
            template: "./src/index.html"
        })
    ],
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
};
