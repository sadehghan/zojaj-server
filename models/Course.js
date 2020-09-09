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
        ],
        default: []
    },
    contentType: {
        type: String,
        enum: ['pdf', 'image', 'text', 'video'],
        default: 'pdf'
    },
    created: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('Course', CourseSchema);