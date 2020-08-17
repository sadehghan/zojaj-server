var mongoose = require('mongoose');

const ChatSchema = mongoose.Schema({
    chatters: {
        type: [mongoose.Schema.Types.ObjectId],
        required: true,
    },
    chats: {
        type: [
            {
                userId: mongoose.Schema.Types.ObjectId,
                chat: String,
                date: {
                    type: Date,
                    default: Date.now,
                }
            }
        ],
        default: []
    },
    lastUpdateDate: {
        type: Date,
        default: Date.now,
    },
    isChannel: {
        type: Boolean,
        default: false,
    },
    admin: [mongoose.Schema.Types.ObjectId],
});

ChatSchema.pre('update', function (next) {
    this.lastUpdateDate = Date.now;
    next();
});

module.exports = mongoose.model('Chat', ChatSchema);