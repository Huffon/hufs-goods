var express = require('express');
var router = express.Router();
var Product = require('../models/product');
var Cart = require('../models/cart');
var Order = require('../models/order');

// 초기 화면 렌더링
router.get('/', function(req, res, next) {
  var successMsg = req.flash('success')[0];
  var _admin = isAdmin(req, res);

  Product.find(function(err, docs) {
      var productChunks = [];
      var chunkSize = 3;
      for (var i = 0; i < docs.length; i += chunkSize){
          productChunks.push(docs.slice(i, i + chunkSize));
      }
      res.render('shop/index', {title: 'Hufs Goods', products: productChunks, successMsg: successMsg, noMessage: !successMsg, admin:_admin });
  });
});

// 재고관리 화면 렌더링
router.get('/stock', function(req, res, next) {

    var _admin = isAdmin(req, res);
    Product.find(function(err, docs) {
        var productChunks = [];
        var chunkSize = 3;
        for (var i = 0; i < docs.length; i += chunkSize){
            productChunks.push(docs.slice(i, i + chunkSize));
        }
        res.render('shop/stock', {title: 'Hufs Goods', products: productChunks, admin:_admin});
    });
  });
  
  // 주문 관리 화면 렌더링
  router.get('/orders', function(req, res, next) {
    var _admin = isAdmin(req, res);
    Order.find(function(err, orders) {
        if (err) {
            return res.write('Error!');
        }
        var cart;
        var total_price=0;
        var qty=0;
        orders.forEach(function(order) {
            cart = new Cart(order.cart);
            order.items = cart.generateArray();
            total_price +=cart.totalPrice;
            qty +=cart.totalQty
  
        });
        res.render('shop/orders', { title: 'Hufs Goods', orders: orders, total: total_price, qty: qty, admin:_admin});
    });
  });

// 공예품 화면 렌더링
router.get('/craft', function(req, res, next) {
    var successMsg = req.flash('success')[0];
    Product.find({ category: 1 }, function(err, docs) {
        var productChunks = [];
        var chunkSize = 3;
        for (var i = 0; i < docs.length; i += chunkSize) {
            productChunks.push(docs.slice(i, i + chunkSize));
        }
        res.render('shop/craft', {title: 'Hufs Goods', products: productChunks, successMsg: successMsg, noMessage: !successMsg });
    });
  });


// 시계/감사패 화면 렌더링
router.get('/watch', function(req, res, next) {
    var successMsg = req.flash('success')[0];
    Product.find({ category: 2 }, function(err, docs) {
        var productChunks = [];
        var chunkSize = 3;
        for (var i = 0; i < docs.length; i += chunkSize) {
            productChunks.push(docs.slice(i, i + chunkSize));
        }
        res.render('shop/watch', {title: 'Hufs Goods', products: productChunks, successMsg: successMsg, noMessage: !successMsg });
    });
  });

  // 사무/문구 화면 렌더링
router.get('/stationery', function(req, res, next) {
    var successMsg = req.flash('success')[0];
    Product.find({ category: 3 }, function(err, docs) {
        var productChunks = [];
        var chunkSize = 3;
        for (var i = 0; i < docs.length; i += chunkSize) {
            productChunks.push(docs.slice(i, i + chunkSize));
        }
        res.render('shop/stationery', {title: 'Hufs Goods', products: productChunks, successMsg: successMsg, noMessage: !successMsg });
    });
  });

  // 생활잡화 화면 렌더링
router.get('/living', function(req, res, next) {
    var successMsg = req.flash('success')[0];
    Product.find({ category: 4 }, function(err, docs) {
        var productChunks = [];
        var chunkSize = 3;
        for (var i = 0; i < docs.length; i += chunkSize) {
            productChunks.push(docs.slice(i, i + chunkSize));
        }
        res.render('shop/living', {title: 'Hufs Goods', products: productChunks, successMsg: successMsg, noMessage: !successMsg });
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

// 재고관리 재고 감소
router.get('/substock/:id', function(req, res, next) {
    var productId = req.params.id;
    subStock(productId,1);
    res.redirect('/stock');
});
//재고관리 재고 추가
router.get('/addstock/:id', function(req, res, next) {
    var productId = req.params.id;

    addStock(productId);
    res.redirect('/stock');
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

//관리자인지 확인하는 함수
function isAdmin(req, res) {
  if (req.isAuthenticated()) {
    if (req.session.passport.user == '5c15f7cff211325f7db1e70b'){
      return 1;
    }
  }
  return 0;
}

// 재고 추가
function addStock(productId) {
  Product.findById(productId, function(err, product) {
    if (err) {}
    else{
      product.qty++;
      product.save(function(err, qty) {
        console.log(qty.qty);
      });
    }
  });
}

//재고 감소
function subStock(productId, num) {
  Product.findById(productId, function(err, product) {
    if (err) {}
    else {
      if (product.qty==0) {}
      else {
        product.qty -= num;
        product.save(function(err, qty) {
          console.log(qty.qty);
        });
      }
    }
  });
}
