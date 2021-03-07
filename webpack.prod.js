const { merge } = require('webpack-merge');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const common = require('./webpack.common');

const config = {
    plugins: [
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorPluginOptions: {
                preset: ['default', { discardComments: { removeAll: true } }],
            },
            canPrint: true
        }),
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
    mode: 'production' // 빌드 환경이 개발모드인지 프로덕션모드인지 설정해주는 옵션. 'production'으로 하면 index.html이 자동으로 minify 돼서 나온다.
};

module.exports = merge(common, config)