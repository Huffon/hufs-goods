var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
var Order = require('../models/order');
var Cart = require('../models/cart');

var csrfProtection = csrf();
router.use(csrfProtection);

// 회원 정보 보기
router.get('/profile', isLoggedIn, function(req, res, next) {
    Order.find({ user: req.user }, function(err, orders) {
        if (err) {
            return res.write('Error!');
        }
        var cart;
        orders.forEach(function(order) {
            cart = new Cart(order.cart);
            order.items = cart.generateArray();
        });
        res.render('user/profile', { title: 'Hufs Goods', orders: orders });
    });
});

// 로그아웃 구현
router.get('/logout', function(req, res, next) {
    req.session.destroy(function(err){});
    req.logout();
    res.redirect('/');
});

// Non-LoggedIn Status
router.use('/', notLoggedIn, function(req, res, next) {
    next();
});

// 회원가입창 렌더링
router.get('/signup', function(req, res, next) {
  var messages = req.flash('error');
  res.render('user/signup', { title: 'Hufs Goods', csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
});

// 회원가입 기능 구현
router.post('/signup', passport.authenticate('local.signup', {
  failureRedirect: '/user/signup',
  failureFlash: true
}), function(req, res, next) {
    if (req.session.oldUrl) {
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null
        res.redirect(oldUrl);
    } else {
        res.redirect('/user/profile');
    }
});

// 로그인창 렌더링
router.get('/signin', function(req, res, next) {
  var messages = req.flash('error');
  res.render('user/signin', {title: 'Hufs Goods', csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
});

// 로그인 기능 구현
router.post('/signin', passport.authenticate('local.signin', {
  failureRedirect: '/user/signin',
  failureFlash: true
}), function(req, res, next) {
    // 관리자 유무 검사
    if(req.session.passport.user =='5c15f7cff211325f7db1e70b'){
      res.redirect('/');
    } else if (req.session.oldUrl) {
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null
        res.redirect(oldUrl);
    } else {
        res.redirect('/user/profile');
    }
});

module.exports = router;

// 로그인 되어있는지 확인하는 함수
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

// 로그인 되지 않은지 확인하는 함수
function notLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}
