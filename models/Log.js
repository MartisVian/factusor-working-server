const mongoose = require('mongoose');


// Schema
const Schema = mongoose.Schema;
const LogSchema = new Schema({
    user_id: {type: Schema.Types.ObjectId, ref: 'User'},
    student_id: {type: Schema.Types.ObjectId, ref: 'Student'},
    date: Date
});

// Model
const Log = mongoose.model('Log', LogSchema);

module.exports =  Log;