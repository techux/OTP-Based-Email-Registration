const mongoose = require('mongoose');
const validator = require('email-validator')

const userSchema = new mongoose.Schema({
    firstName : {
        type: String,
        required: true
    },
    lastName : {
        type: String,
        default: ""
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (v)=> validator.validate(v) ,
            message: (props) => `${props.value} is not a valid email address!`
        }
    },
    password : {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('user', userSchema) ;