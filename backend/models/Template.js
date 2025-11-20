const mongoose = require('mongoose');
const { Schema } = mongoose;

const TemplateSchema = new Schema({
    admin_id:{
        type: Schema.Types.ObjectId,
        required: true
    },
    template_title:{
        type: String,
        required: true
    },
    template_tag:{
        type: String,
        required: true
    },
    template_url:{
        type: String,
        required: true
    },
    template_updated_date:{
        type: Date,
        default: Date.now
    }
});

const Template = mongoose.model('Template', TemplateSchema);

module.exports = Template;