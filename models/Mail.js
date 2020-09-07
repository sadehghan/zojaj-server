var mongoose = require('mongoose');

const MailSchema = mongoose.Schema({
    source: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    destinations: {
        type: [mongoose.Schema.Types.ObjectId],
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    readers: {
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
    },
    importanters: {
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
    },
    created: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('Mail', MailSchema);