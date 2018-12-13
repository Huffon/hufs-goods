// 로그인을 위한 passport.js 설정
var passport = require('passport');
var User = require('../models/user');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

// 회원가입 검사
passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done) {
    req.checkBody('email', '이메일 양식이 맞지 않습니다.').notEmpty().isEmail();
    req.checkBody('password', '비밀번호를 4자 이상으로 설정해주세요.').notEmpty().isLength({min:4});
    var errors = req.validationErrors();
    var address = req.body.address;
    var phone = req.body.phone;
    var name = req.body.name;

    if (errors) {
        var messages = [];
        errors.forEach(function(error) {
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }
    User.findOne({ 'email': email }, function( err, user) {
        if (err) return done(err);
        if (user) return done(null, false, {message: '이미 존재하는 이메일입니다.'});

        var newUser = new User();
        newUser.email = email;
        console.log(req.body);
        newUser.password = newUser.encryptPassword(password);
        newUser.address = address;
        newUser.phone = phone;
        newUser.name = name;
        newUser.save(function(err, reuslt) {
           if(err){
            return done(err);
           }
            return done(null, newUser);
        });
    });
}));

// 로그인 검사
passport.use('local.signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done) {
    req.checkBody('email', '이메일 양식이 맞지 않습니다.').notEmpty().isEmail();
    req.checkBody('password', '비밀번호를 4자 이상으로 입력해주세요.').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        var messages = [];
        errors.forEach(function(error) {
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }
    User.findOne({'email': email}, function(err, user) {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, {message: '해당 이메일이 존재하지 않습니다.'});
        }
        if (!user.validPassword(password)) {
            return done(null, false, {message: '비밀번호가 일치하지 않습니다.'});
        }
        return done(null, user);
    }) 
}));