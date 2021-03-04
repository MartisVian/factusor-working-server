var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ParentSchema = new Schema({
    first_name: String,
    last_name: String,
    cnp: Number,
    address: String,
    city: String,
    phone: Number,
    user: {type: Schema.Types.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Parent', ParentSchema);