const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');

module.exports = {
    entry: './index.js',
    output: {
        filename: '[name].[chunkhash].js', // hash, contenthash, chunkhash
        path: path.resolve(__dirname, 'dist')
    },
    // json이나 js 파일을 기본으로 보고 그 이외의 확장자 파일을 사용하려면 아래 loader 설정을 해줘야 한다.
    module: {
        rules: [
            {
                test:/\.css$/i,
                use: [
                    // 1.
                    //'style-loader',

                    // 2. 여러개의 스타일 파일을 하나로 번들해준다. 근데 html 파일 내에 주입함.
                    // {
                    //     loader: 'style-loader',
                    //     options: {
                    //         injectType: 'singletonStyleTag' // css 파일들을 하나로 합쳐준다.
                    //     }
                    // },
                    
                    // 3. (2.랑 충돌날 수 있으니까 둘 중 하나만 쓸 것) 이건 html문서 밖으로 css파일을 생성해준다. dist폴더 안에 main.css 파일로 생김.
                    {
                        loader: MiniCssExtractPlugin.loader
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true
                        }
                    }
                ]
            },
            {
                test: /\.hbs$/,
                use: ['handlebars-loader']
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[contenthash].css'
        }),
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorPluginOptions: {
                preset: ['default', { discardComments: { removeAll: true } }],
            },
            canPrint: true
        }),
        // index.html 파일을 생성해주고 스크립트나 번들 파일을 알아서 연결해준다.
        new HtmlWebpackPlugin({
            title: 'PRACTICE!!!',
            template: './template.hbs',
            // 이 옵션을 body로 해주지 않으면 css랑 js가 다 head에 들어감.
            inject: 'body',
            meta: {
                viewport: 'width=device-width, initial-scale=1.0'
            },
            minify: {
                // 어떤걸 minify 할 수 있는지는(옵션) github에서 자세히 볼 수 있음. 
                collapseWhitespace: true,
                useShortDoctype: true,
                removeScriptTypeAttributes: true 
            }
        }),
        new CleanWebpackPlugin()
    ],
    optimization: {
        // 런타임 청크 설정하기
        runtimeChunk: {
            name: 'runtime'
        },
        // 스플릿 청크 설정하기
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        },
        // terser 필요코드
        minimize: true,
        // 위에 한줄만 써도 동작은 하는데 terser 디폴트 기능밖에 사용할 수 없음. 아래는 커스터마이징 하기 위한 코드.
        minimizer: [
            // webpack5부터는 terser 플로그인이 기본 제공되기때문에 설치 안해도 됨.
            new TerserWebpackPlugin()],
    },
    mode: 'none' // 빌드 환경이 개발모드인지 프로덕션모드인지 설정해주는 옵션. 'production'으로 하면 index.html이 자동으로 minify 돼서 나온다.
}