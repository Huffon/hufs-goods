var Product = require('../models/product');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/shopping', {useNewUrlParser:true});

var products = [
    new Product({
        imgPath: "data:image/jpeg;base64,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",
        title: '로고 롱패딩',
        description: '겨울 계절학기용 롱패딩',
        price: 65000,
        category: 4,
        qty: 1
    }),

new Product({
        imgPath: "http://hufsjapan.ac.kr/files/attach/images/161971/501/156/8dca4e74a5caa426395627abe7055469.jpg",
        title: '로고 에코백',
        description: '전공책 넣고 다니다가 찢어져도 책임 못져요',
        price: 3000,
        category: 4,
        qty: 5
    }),

new Product({
        imgPath: "https://scontent.cdninstagram.com/vp/8c5f182c376d6909f13d1777ac26fc87/5CA0AFDB/t51.2885-15/sh0.08/e35/s640x640/33067195_611266469234074_374396263447134208_n.jpg",
        title: 'Boo 인형',
        description: '누구에게나 당당하지 못한 마스코트',
        price: 13000,
        category: 4,
        qty: 1
    }),

new Product({
        imgPath: "http://img1.daumcdn.net/thumb/R1920x0/?fname=http%3A%2F%2Fcfile6.uf.tistory.com%2Fimage%2F9927034D5C178222196572",
        title: '로고 야구점퍼',
        description: '박성웅님도 즐겨입으셨다는 그 야구점퍼',
        price: 35000,
        category: 4,
        qty: 1
    }),
    new Product({
        imgPath: "http://img1.daumcdn.net/thumb/R1920x0/?fname=http%3A%2F%2Fcfile24.uf.tistory.com%2Fimage%2F993E1B345C15F6311567E8",
        title: '자개 손거울',
        description: '자개 무늬 손거울',
        price: 11000,
        category: 1,
        qty: 1
    }),
    new Product({
        imgPath: "http://img1.daumcdn.net/thumb/R1920x0/?fname=http%3A%2F%2Fcfile6.uf.tistory.com%2Fimage%2F99473F415C15F698278868",
        title: '자개 자동 명함집',
        description: '자개 무늬 명함집',
        price: 12000,
        category: 1,
        qty: 5
    }),
    new Product({
        imgPath: "http://img1.daumcdn.net/thumb/R1920x0/?fname=http%3A%2F%2Fcfile21.uf.tistory.com%2Fimage%2F99E114415C15F698235A81",
        title: '자동 명함함',
        description: '자동 열림 명함함',
        price: 11000,
        category: 1,
        qty: 0
    }),
    new Product({
        imgPath: "http://img1.daumcdn.net/thumb/R1920x0/?fname=http%3A%2F%2Fcfile2.uf.tistory.com%2Fimage%2F997B87365C15F69B2AF2B5",
        title: '원형 벽시계',
        description: '원형 모양 벽시계',
        price: 17000,
        category: 2,
        qty: 5
    }),
    new Product({
        imgPath: "http://img1.daumcdn.net/thumb/R1920x0/?fname=http%3A%2F%2Fcfile26.uf.tistory.com%2Fimage%2F999366365C15F69A29C0FA",
        title: '글로벌 탁상시계',
        description: '지구본 모양 탁상시계',
        price: 39000,
        category: 2,
        qty: 5
    }),
    new Product({
        imgPath: "http://img1.daumcdn.net/thumb/R1920x0/?fname=http%3A%2F%2Fcfile29.uf.tistory.com%2Fimage%2F993743365C15F69A24A919",
        title: '지구본 시계',
        description: '지구본 시계',
        price: 23000,
        category: 2,
        qty: 5
    }),
    new Product({
        imgPath: "http://img1.daumcdn.net/thumb/R1920x0/?fname=http%3A%2F%2Fcfile25.uf.tistory.com%2Fimage%2F99648E415C15F699209B00",
        title: '로지텍 무선 마우스',
        description: '로지텍사의 무선 마우스',
        price: 16000,
        category: 3,
        qty: 5
    }),
    new Product({
        imgPath: "http://img1.daumcdn.net/thumb/R1920x0/?fname=http%3A%2F%2Fcfile6.uf.tistory.com%2Fimage%2F9958C2415C15F699263164",
        title: '마블 볼펜',
        description: '마블링이 돋보이는 볼펜',
        price: 7000,
        category: 3,
        qty: 5
    }),
    new Product({
        imgPath: "http://img1.daumcdn.net/thumb/R1920x0/?fname=http%3A%2F%2Fcfile28.uf.tistory.com%2Fimage%2F99B0F3415C15F69A1E8168",
        title: '외대필통',
        description: '깔끔한 학교 로고가 돋보이는 필통',
        price: 4000,
        category: 3,
        qty: 5
    }),
    new Product({
        imgPath: "http://img1.daumcdn.net/thumb/R1920x0/?fname=http%3A%2F%2Fcfile23.uf.tistory.com%2Fimage%2F990CDF415C15F69828C584",
        title: '3단 완전 자동우산',
        description: '잭니클라우스 3단',
        price: 15000,
        category: 4,
        qty: 5
    }),
    new Product({
        imgPath: "http://img1.daumcdn.net/thumb/R1920x0/?fname=http%3A%2F%2Fcfile1.uf.tistory.com%2Fimage%2F99644B415C15F69920AFFB",
        title: '커피잔 세트',
        description: '행남 본차이나',
        price: 56000,
        category: 4,
        qty: 5
    }),
    new Product({
        imgPath: "http://img1.daumcdn.net/thumb/R1920x0/?fname=http%3A%2F%2Fcfile7.uf.tistory.com%2Fimage%2F99C498415C15F6992A7063",
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
