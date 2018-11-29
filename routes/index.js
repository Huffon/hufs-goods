var express = require('express');
var router = express.Router();
var Product = require('../models/product');
var Cart = require('../models/cart');
var Order = require('../models/order');

// 초기 화면 렌더링
router.get('/', function(req, res, next) {
  var successMsg = req.flash('success')[0];
  Product.find(function(err, docs) {
      var productChunks = [];
      var chunkSize = 3;
      for (var i = 0; i < docs.length; i += chunkSize){
          productChunks.push(docs.slice(i, i + chunkSize));
      }
      res.render('shop/index', {title: 'Hufs Goods', products: productChunks, successMsg: successMsg, noMessage: !successMsg });  
  });
});

// 장바구니 기능 구현
router.get('/add-to-cart/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    Product.findById(productId, function(err, product) {
        if (err) {
            return res.redirect('/');
        }
        cart.add(product, product.id);
        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect('/');
    });
});

// 장바구니 상품 1개씩 감소하는 기능 구현
router.get('/reduce/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.reduceByOne(productId);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
});

// 쇼핑카트 렌더링
router.get('/shopping-cart', function(req, res, next) {
    if (!req.session.cart) {
        return res.render('shop/shopping-cart', {products: null});
    }
    var cart = new Cart(req.session.cart);
    res.render('shop/shopping-cart', {title: 'Hufs Goods', products: cart.generateArray(), totalPrice: cart.totalPrice});
});

// 결제창 렌더링 
router.get('/checkout', isLoggedIn, function(req, res, next) {
    if (!req.session.cart) {
        return res.redirect('/shopping-cart');
    }
    var cart = new Cart(req.session.cart);
    var errMsg = req.flash('error')[0];
    res.render('shop/checkout', {title: 'Hufs Goods', totalPrice: cart.totalPrice, errMsg: errMsg, noError: !errMsg});
});

// 결제 기능 구현
router.post('/checkout', isLoggedIn, function(req, res, next) {
    if (!req.session.cart) {
        return res.redirect('/shopping-cart');
    }    

    var cart = new Cart(req.session.cart);

    var stripe = require("stripe")("sk_test_LWM2lxEIGrBmJdKl7CaKtHA2");

    stripe.charges.create({
        amount: cart.totalPrice * 1,
        currency: "krw",
        source: "tok_mastercard", // obtained with Stripe.js
        description: "Test charged"
    }, function(err) {
        if (err) {
            req.flash('error', err.message);
            return res.redirect('/checkout');
        }
        var order = new Order({
            user: req.user,
            cart: cart,
            address: req.body.address,
            name: req.body.name,
            paymentId: "tok_mastercard"
        });
        order.save(function(err, result) {
            req.flash('success', '구매가 성공적으로 이루어졌습니다.');
            req.session.cart = null;
            res.redirect('/');    
        });
    });
});

module.exports = router;

// 로그인 되어있는지 확인하는 함수
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.oldUrl = req.url;
    res.redirect('/user/signin');
};