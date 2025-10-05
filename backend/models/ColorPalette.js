const mongoose = require('mongoose');
const { Schema } = mongoose;

const ColorPaletteSchema = new Schema({
    by_admin:{
        type: Boolean,
        required: true
    },
    user_id:{
        type: Schema.Types.ObjectId,
        required: true
    },
    color_palette_name:{
        type: String,
        required: true
    },
    colors:{
        type: [String],
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    }
});

const ColorPalette = mongoose.model('ColorPalette', ColorPaletteSchema);

module.exports = ColorPalette;