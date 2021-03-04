const mongoose = require('mongoose');


// Schema
const Schema = mongoose.Schema;
const StudentSchema = new Schema({
    first_name: String,
    last_name: String,
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    parent: {type: Schema.Types.ObjectId, ref: 'Parent'}
});

// Model
const Student = mongoose.model('Student', StudentSchema);

module.exports =  Student;