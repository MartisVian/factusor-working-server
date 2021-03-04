var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    email: String,
    password: String,
    first_name: String,
    last_name: String,
    address: String,
    city: String,
    phone: Number,
    id_card: String,
    cif: Number,
    business_name: String,
    business_details: String,
    hour_price: Number,
    bill_number: Number
});

module.exports = mongoose.model('User', UserSchema);