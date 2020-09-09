var mongoose = require('mongoose');

const ShareSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    likesNo: {
        type:  Number,
        default: 0,
    },
    likers: {
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
    },
    commentsNo: {
        type: Number,
        default: 0,
    },
    comments: {
        type: [
            {
                commenterId: mongoose.Schema.Types.ObjectId,
                comment: String,
                created: {
                    type: Date,
                    default: Date.now,
                }
            }
        ],
        default: [],
    },
    description: String,
    attachments: {
        type: [
            {
                contentType: {
                    type: String,
                    enum: ['pdf', 'image', 'text', 'video'],
                },
                id: String,
            }
        ],
        default: [],
    },
    created: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('Share', ShareSchema);