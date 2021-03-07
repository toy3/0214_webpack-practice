import 'normalize.css';
import styles from './index.module.scss';
import $ from 'jquery';
import slackImg from './images/slack.png';
import slackImgSvg from './images/slack.svg';
import '@babel/polyfill';

function component(){
    const element = document.createElement('div');
    element.innerHTML = 'Hello Webpack World!!!';

    // 이미지 태그 추가
    const imgElement = document.createElement('img');
    // imgElement.src = slackImg;
    imgElement.src = slackImgSvg;
    imgElement.classList = styles.slackImg;

    console.log(slackImg);
    console.log(styles);

    // 앞에서 생성한 div 안에 img 를 넣어주기.
    element.appendChild(imgElement);

    // css 모듈 설정을 해서 클래스명을 겹치지 않게 해줌.
    element.classList = styles.helloWebpack;

    return element;
}

document.body.appendChild(component());

console.log($(`.${styles.helloWebpack}`).length);
console.log(`IS_PRODUCTION MODE: ${IS_PRODUCTION}`);