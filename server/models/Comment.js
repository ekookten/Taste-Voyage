const { Schema, model } = require('mongoose');


const CommentSchema = new Schema({
    commentText: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 280,
    },
    commentAuthor: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date, 
        default: Date.now
    },
});


const Comment = model('Comment', CommentSchema);

module.exports = Comment;
