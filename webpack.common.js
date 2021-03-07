const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const postcssLoader = {
    loader: 'postcss-loader',
    options: {
        postcssOptions: {
            // Allows to specify the path to the config file.
            config: path.resolve(__dirname, "postcss.config.js"),
          },
    }
}

const isProduction = process.env.NODE_ENV === 'PRODUCTION';

// URL로더: data uris?는 4가지 파트로 구성된다=> data:mediatype;base64,data 이렇게 4파트가 한줄로.!!!

module.exports = {
    entry: './src/index.js',
    output: {
        filename: '[name].[chunkhash].js', // hash, contenthash, chunkhash
        path: path.resolve(__dirname, 'dist')
    },
    // json이나 js 파일을 기본으로 보고 그 이외의 확장자 파일을 사용하려면 아래 loader 설정을 해줘야 한다.
    module: {
        rules: [ // 용도에 맞게 css파일 적용하기 : filename.module.scss => css modules (파일명 뒤에 module 단어가 있으면 지역화된 module들에만 적용되도록 하고), // filename.scss => global (파일명뒤에 module 없으면 공통적용)
            {
                test:/\.s?css$/i,
                // 여러 형태의 룰을 배열형태로 넣어주려고 맨 바깥쪽을 한번 싸준다. 
                oneOf: [
                    // 첫번째 룰. 중간에 module 글자가 있으면 이 룰을 탄다.
                    {
                        test: /\.module\.s?css$/,
                        use: [
                            // 1. html내에 인라인으로 스타일이 들어가게 함.
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
                                loader: MiniCssExtractPlugin.loader // 다. 아래에서 적용한 css파일을 외부에서 관리가 되게끔 외부파일로 뽑아서 link 태그에 적용시키는 작업.
                            },
                            {
                                loader: 'css-loader',
                                options: {
                                    modules: true // 나. 아래에서 받은 css 파일을 css-loader가 받아서 모듈을 적용.
                                }
                            },
                            postcssLoader,
                            'sass-loader'
                        ]
                    }, 

                    // 두번째 룰. 위의 첫번째 룰을 따르지 않는 경우는 다 두번째 룰을 따른다. 글로벌 범위로 적용된다. 
                    {
                        use: [
                            // 이런식으로 사용하는거 축약형
                            MiniCssExtractPlugin.loader,
                            'css-loader',
                            postcssLoader,
                            'sass-loader'
                        ]
                    }
                ]
            },
            {
                test: /\.hbs$/,
                use: ['handlebars-loader']
            }, {
                // test키는 로더가 어떤 형식의 파일을 읽어들일지 정의해주는 것. svg는 url loader에서 다룬다. 달러표시($)는 끝맺음을 의미한다. 마지막 i는 대소문자를 구분하지 않겠다는 뜻.
                test: /\.(png|jpe?g|gif)$/i,
                // use키엔 로더를 설정해준다.
                use: [{
                    loader: 'file-loader',
                    options: {
                        // 개발모드일때는 이미지 파일명이 그대로 나오고, 프로덕션모드일땐 해시값 적용되게 분기처리.
                        name() {
                            if(!isProduction){
                                return '[path][name].[ext]';
                            }
                            return '[contenthash].[ext]';
                        },
                        // 1. 파일을 불러올 때 url 경로에 assets 경로가 추가되어야 함.
                        publicPath: 'assets/',
                        // 2. 파일을 읽어들인 모듈들이 dist 폴더안에 assets 폴더 안에 생성되어야 함. 이렇게 path 추가로 하는건 위에 js에도 적용할 수 있음.
                        outputPath: 'assets/'
                    }
                }]
            }, {
                test: /\.svg$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 8192 //byte 크기 단위의 숫자를 넣는다(파일크기제한기능).
                    }
                }]
            }, {
                test: /.js/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[contenthash].css'
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
            minify: isProduction ? {
                // 어떤걸 minify 할 수 있는지는(옵션) github에서 자세히 볼 수 있음. 
                collapseWhitespace: true,
                useShortDoctype: true,
                removeScriptTypeAttributes: true 
            } : false
        }),
        new CleanWebpackPlugin(),
        new webpack.DefinePlugin({
            IS_PRODUCTION: isProduction
        }),
    ],
    
}