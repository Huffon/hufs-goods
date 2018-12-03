var Product = require('../models/product');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/shopping', {useNewUrlParser:true});

var products = [
    new Product({
        imgPath: "images/craft/hand_mirror.jpg",
        title: '자개 손거울',
        description: '자개 무늬 손거울',
        price: 11000,
        category: 1,
        qty: 1
    }),
    new Product({
        imgPath: "images/craft/name_card.jpg",
        title: '자개 자동 명함집',
        description: '자개 무늬 명함집',
        price: 12000,
        category: 1,
        qty: 5
    }),
    new Product({
        imgPath: "images/craft/touch_name.jpg",
        title: '자동 명함함',
        description: '자동 열림 명함함',
        price: 11000,
        category: 1,
        qty: 0
    }),
    new Product({
        imgPath: "images/watch/round_clock.jpg",
        title: '원형 벽시계',
        description: '원형 모양 벽시계',
        price: 17000,
        category: 2,
        qty: 5
    }),
    new Product({
        imgPath: "images/watch/clobal_clock.jpg",
        title: '글로벌 탁상시계',
        description: '지구본 모양 탁상시계',
        price: 39000,
        category: 2,
        qty: 5
    }),
    new Product({
        imgPath: "images/watch/earth_clock.jpg",
        title: '지구본 시계',
        description: '지구본 시계',
        price: 23000,
        category: 2,
        qty: 5
    }),
    new Product({
        imgPath: "images/stationery/logitech_mouse.jpg",
        title: '로지텍 무선 마우스',
        description: '로지텍사의 무선 마우스',
        price: 16000,
        category: 3,
        qty: 5
    }),
    new Product({
        imgPath: "images/stationery/marvel_pen.jpg",
        title: '마블 볼펜',
        description: '마블링이 돋보이는 볼펜',
        price: 7000,
        category: 3,
        qty: 5
    }),
    new Product({
        imgPath: "images/stationery/pencil_case.jpg",
        title: '외대필통',
        description: '깔끔한 학교 로고가 돋보이는 필통',
        price: 4000,
        category: 3,
        qty: 5
    }),
    new Product({
        imgPath: "images/living/3mode_umbrella.jpg",
        title: '3단 완전 자동우산',
        description: '잭니클라우스 3단',
        price: 15000,
        category: 4,
        qty: 5
    }),
    new Product({
        imgPath: "images/living/mug_set.jpg",
        title: '커피잔 세트',
        description: '행남 본차이나',
        price: 56000,
        category: 4,
        qty: 5
    }),
    new Product({
        imgPath: "images/living/golf_ball.jpg",
        title: '골프공 6구 세트',
        description: 'Titleist Pro V1',
        price: 56000,
        category: 4,
        qty: 5
    })
];

var done = 0;
for (var i = 0; i < products.length; i++) {
    products[i].save(function(err, result) {
        done++;
        if(done == products.length){
            exit();
        }
    });
}

function exit() {
    mongoose.disconnect();
}
