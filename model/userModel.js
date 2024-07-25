const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'User must have a name '],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'User must have a email '],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'please provide a valid email'],
    },
    password: {
        type: String,
        required: [true, 'please Provide a password'],
        minlength: 8,
        select: false, //not shown in response
    },
    savedPassword: {
        type: String,
        required: [true, 'please Provide a password'],
        minlength: 8,
        select: false, //not shown in response
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'realtor'],
        default: 'user',
    },
    phoneNumber: {
        type: String,
        required: [true, 'please provide a phone number'],
    },
    passwordConfirm: {
        type: String,
        required: [true, 'please confirm your password'],
        validate: {
            validator: function (el) {
                return el === this.password;
            },
            message: 'passwords are not the same',
        },
    },
    passwordChangedAt: {
        type: Date,
        required: [false],
    },
    passwordResetCode: String,
    accountVerifyCode: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false,
    },
    verified: {
        type: Boolean,
        default: false,
        select: true,
    },
    accountCreatedAt: {
        type: Date,
        required: [false],
        default: new Date(),
    },
});

//hash password when creating or updating user we know that because the password is modified
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
        this.passwordConfirm = undefined;
        next();
    } else {
        return next();
    }
});

//add the date of the cahnged password
userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next();
    this.passwordChangedAt = Date.now() - 1000;
    next();
});

userSchema.pre(/^find/, function (next) {
    this.find({ active: { $ne: false } });
    next();
});

//methods to the schema we need

userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        );

        return JWTTimestamp < changedTimestamp;
    }

    // False means NOT changed
    return false;
};

userSchema.methods.createPasswordResetCode = function () {
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

    this.passwordResetCode = crypto
        .createHash('sha256')
        .update(resetCode)
        .digest('hex');

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // Expires in 10 mins

    return resetCode;
};

userSchema.methods.createAccountVerifyCode = function () {
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    this.accountVerifyCode = crypto
        .createHash('sha256')
        .update(verifyCode)
        .digest('hex');

    return verifyCode;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
