const mongoose = require('mongoose');
const { Schema } = mongoose;

const DrawingSchema = new Schema({
    user_id:{
        type: Schema.Types.ObjectId,
        required: true
    },
    drawing_title:{
        type: String,
        required: true
    },
    drawing_tag:{
        type: String,
        required: true
    },
    drawing_url:{
        type: String,
        required: true
    },
    drawing_updated_date:{
        type: Date,
        default: Date.now
    }
});

const Drawing = mongoose.model('Drawing', DrawingSchema);

module.exports = Drawing;