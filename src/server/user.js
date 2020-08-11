import mongoose from 'mongoose';
import PhoneNumber from 'awesome-phonenumber';
import email from 'email-addresses';
const bcrypt = require("bcrypt");
import errorCodes from './errorcode';

const ERRORCODE = errorCodes.USER_CREATION;

mongoose.connect('mongodb://192.168.0.101:27017/socialight', {useNewUrlParser: true});

const saltRounds = 10;
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 64;
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, ERRORCODE["0030"]],
        maxlength: 64,
    },
    countryCode: {
        type: String,
        required: [true, 'User country code required']
    },
    phone: {
        type: String,
        required: [true, 'User phone number required'],
        validate: {
            validator: function(v) {
                return new Promise((res,rej) => {
                    let isValid = new PhoneNumber(v, this.countryCode).isValid();
                    User.find({phone: v},function(err,docs) {
                        if(err) {
                            rej(err);
                        } else {
                            res(docs.length === 0 && isValid);
                        }                        
                    });
                });
            },
            message: props => `${props.value} is not a valid phone number, or it is taken.`
        }
    },
    email: {
        type: String,
        required: [true, 'User email is required'],
        validate: {
            validator: function(v) {
                return new Promise((res,rej) => {
                    let validEmail = !!email(v);
                    User.find({email: v},function(err,docs) {
                        if(err) {
                            console.log(err);
                            rej(err);
                        } else {
                            res(docs.length === 0 & validEmail)
                        }
                    });
                });

            },
            message: props => `${props.value} is not a valid email, or it is taken.`
        }
    },
    hashedPassword: {
        type: String,
        required: [true, "User password is required"]
    },
});

UserSchema.statics.getHashedPassword = function(rawPassword, passwordConfirm) {
    if(rawPassword.length < MIN_PASSWORD_LENGTH || rawPassword > MAX_PASSWORD_LENGTH) {
        throw "Password was too long or too short"
    } else if (rawPassword !== passwordConfirm) {
        throw "Passwords do not match"
    }

    return bcrypt.hashSync(rawPassword, saltRounds);
}

const User = mongoose.model('User', UserSchema);

User.createCollection();

export default User;