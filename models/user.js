import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import Joi from "joi";

const userSchema = new Schema({
    Name: {
        type: String,
        min: 3,
        max: 15,
        required: true,
    },
    Surname: {
        type: String,
        min: 3,
        max: 15,
        required: true,
    },
    NameWithSurname: {
        type: String,
        required: true,
    },
    Email: {
        type: String,
        required: true,
    },
    Password: {
        type: String,
        min: 6,
        max: 20,
        required: true,
    },
    Avatar: {
        type: String,
        default: "",
    },
    messages: {
        type: Array,
    },
    friendList: {
        type: Array,
    },
    verified: {
        type: Boolean,
        default: false,
    },
});

const User = mongoose.model("user", userSchema);

const validate = (user) => {
    const schema = Joi.object({
        Name: Joi.string().min(3).max(15),
        Surname: Joi.string().min(3).max(15),
        Email: Joi.string().email(),
        Password: Joi.string().min(6).max(20),
    });
    return schema.validate(user);
};

export {
    User,
    validate,
}