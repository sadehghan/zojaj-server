const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    bookmarkedFeeds: {
        type: [mongoose.Schema.Types.ObjectId],
        default: []
    }
});

module.exports = mongoose.model('User', UserSchema);