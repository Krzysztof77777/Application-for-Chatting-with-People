import mongodb from "mongodb";
import {
    sendEmail
} from "../utils/email.js";
import {
    Token
} from "../models/token.js";
import {
    User,
    validate,
} from "../models/user.js";
import crypto from "crypto";
import express from 'express';
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        let user = await User.findOne({
            Email: req.body.Email
        });

        if (!user) return res.json({
            message: "User with given email not exist!"
        })

        if (user) {
            if (!user.verified) {
                return res.json({
                    message: "User with given email not confirmed account!"
                })
            }
        }

        let token = await Token.findOne({
            userId: user._id,
        });

        if (!token) {
            token = await new Token({
                userId: user._id,
                token: crypto.randomBytes(32).toString("hex"),
            }).save();
        } else {
            await Token.findOneAndUpdate({
                userId: user._id,
            }, {
                token: crypto.randomBytes(32).toString("hex"),
            })
            token = await Token.findOne({
                userId: user._id,
            });
        }

        const link = `${req.protocol}://${req.headers.host}/reset/password/verify/${user.id}/${token.token}`;

        const message = `<a href="${link}">Click here to reset password</a>`

        await sendEmail(user.Email, "Reset password", message);

        return res.json({
            done: true,
            message: "Please check your email inbox for a link to complete the reset"
        })
    } catch (error) {
        res.status(400).send("An error occured");

    }
})

router.head('/verify/:id/:token', async (req, res) => {
    try {
        const ObjectID = mongodb.ObjectID;

        if (!ObjectID.isValid(req.params.id)) {
            return res.json({
                isValidLink: false,
            })
        }

        let user = await User.findOne({
            _id: req.params.id,
        });

        if (!user) return res.json({
            isValidLink: false,
        })

        let token = await Token.findOne({
            userId: user._id,
            token: req.params.token,
        });

        if (!token) return res.json({
            isValidLink: false,
        })

        return res.json({
            isValidLink: true,
            email: user.Email,
        })
    } catch (error) {
        res.status(400).send("An error occured");
    }
})

router.patch('/verify/:id/:token/change', async (req, res) => {
    try {
        const {
            error
        } = validate({
            Password: req.body.Password
        });

        if (error) return res.json({
            message: error.details[0].message
        })

        if (req.body.Password !== req.body.ConfirmPassword) {
            return res.json({
                message: 'Given passwords do not match'
            })
        }

        await User.findOneAndUpdate({
            Email: req.body.Email
        }, {
            Password: req.body.Password
        });

        let user = await User.findOne({
            Email: req.body.Email,
        })

        await Token.findOneAndDelete({
            userId: user._id,
        })

        return res.json({
            done: true,
            message: "The password's been changed",
        })
    } catch (error) {
        res.status(400).send("An error occured");
    }
})

export {
    router as ResetPasswordRoute
}