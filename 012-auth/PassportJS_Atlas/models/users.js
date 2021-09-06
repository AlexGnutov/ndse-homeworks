const {Schema, model} = require('mongoose');

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    }, 
    information: {
        type: String,
        default: "",
    }
});

module.exports = model('User', userSchema);