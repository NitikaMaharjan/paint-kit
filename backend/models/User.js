const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    user_email:{
        type: String,
        required: true,
        unique: true
    },
    user_username:{
        type: String,
        required: true
    },
    user_password:{
        type: String,
        required: true
    },
    user_registered_date:{
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;