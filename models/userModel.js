const mongoose = require('mongoose');
const crypto = require('crypto');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter a name.']
    },
    email: {
        type: String,
        required: [true, 'A user must have an email address.'],
        unique: [true, 'This email address is already in use.'],
        lowercase: true,
        validate: [validator.isEmail, 'Please enter a valid email address']
    },
    photo: {
        type: String,
        default: 'default.jpg'
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'A user must create a password.'],
        minlength: [8, 'Your password must contain at least 8 characters.'],
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [
            true,
            'This password does not match. Please check and try again'
        ],
        // This ONLY works on 'create' & 'save'!!
        validate: {
            validator: function (el) {
                return el === this.password;
            },
            message: 'Passwords do not match!'
        }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
    },
    spotifyAccessToken: String,
    spotifyRefreshToken: String
});

const User = mongoose.model('User', userSchema);

module.exports = User;