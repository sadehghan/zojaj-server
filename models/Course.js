var mongoose = require('mongoose');

const CourseSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    instructor: {
        type: {
            name: String,
            about: String,
            imageUrl: String,
        },
        required: true,
    },
    topics: {
        type: [
            {
                heading: String,
                about: String
            }
        ]
    },
    contentType: {
        type: String,
        enum: ['pdf', 'image', 'text', 'video'],
        required: true,
    },
    contentUrl: {
        type: String,
        required: true,
    },
    created: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('Course', CourseSchema);