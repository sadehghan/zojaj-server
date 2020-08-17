var mongoose = require('mongoose');

const FeedSchema = mongoose.Schema({
    source: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    news: {
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
    created: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('Feed', FeedSchema);