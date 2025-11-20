const mongoose = require('mongoose');
const { Schema } = mongoose;

const AdminSchema = new Schema({
    admin_email:{
        type: String,
        required: true,
        unique: true
    },
    admin_username:{
        type: String,
        required: true
    },
    admin_password:{
        type: String,
        required: true
    },
    admin_registered_date:{
        type: Date,
        default: Date.now
    }
});

const Admin = mongoose.model('Admin', AdminSchema);

module.exports = Admin;