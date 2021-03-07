const {merge} = require('webpack-merge');
const common = require('./webpack.common');
const styleLintPlugin = require('stylelint-webpack-plugin');

const config = {
    mode: 'development',
    devServer: {
        open: true, // 최초 webpack-dev-server 실행 시 기본 브라우저를 통해 앱을 연다. 실행때마다 새탭이 열린다.
        overlay: true, // 이 경우 브라우저 상에서도 바로 오류를 확인할 수 있다. 브라우저 화면에 터미널 로그값이 바로 오버레이 됨(React Cli는 기본으로 적용되어 있음.).
        // historyApiFallback: true로 해주면 루트 도메인 뒤에 정해지지 않은 서브도메인으로 접근해도 루트 도메인으로 라우팅 시켜준다. 
        historyApiFallback: {
            // 라우팅 설정을 할 수 있다. from:이걸로 접근하면(정규식), to:이 페이지로 연결해준다.
            rewrites: [
                { from: /^\/subpage$/, to: 'subpage.html' },
                // 특정경로(위의 subpage)를 제외한 모든 경로를 404페이지로 띄우고 싶을 때 == /./ (이게 특정경로를 제외한 모든 경로를 뜻함)
                { from: /./, to: '404.html' }
            ]
        },
        port: 3333, // 3333 포트번호를 사용하고자 하는 경우
    },
    plugins: [
        new styleLintPlugin()
    ]
};

module.exports = merge(common, config)