const {Schema, model} = require('mongoose');

const messageSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    }, 
    date: {
        type: Date,
        required: true,
    },
    bookId: {
        type: String,
        required: true,
    }
});

module.exports = model('Message', messageSchema);