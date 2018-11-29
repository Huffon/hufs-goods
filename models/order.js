// 주문 entity
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    user: {type: Schema.ObjectId, ref: 'User'},
    cart: {type: Object, required: true},
    paymentId: {type: String, required: true}
});

module.exports = mongoose.model('Order', schema);