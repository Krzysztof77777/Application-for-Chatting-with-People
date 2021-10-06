import {
    sendEmail
} from "../utils/email.js";
import {
    Token
} from "../models/token.js";
import {
    User
} from "../models/user.js";
import crypto from "crypto";
import express from 'express';
const router = express.Router();

router.post('/login', async (req, res) => {
    try {
        let user = await User.findOne({
            Email: req.body.Email
        });

        if (!user) return res.json({
            message: "User with given email not exist!"
        })

        user = await User.findOne({
            Email: req.body.Email,
            Password: req.body.Password
        });

        if (user) {
            if (!user.verified) {
                return res.json({
                    modalOpenWithVerify: true,
                    message: "User with given email not confirmed account!",
                    email: req.body.Email,
                })
            }
        }

        if (user) {
            res.cookie('logined', `${user._id}`, {
                maxAge: 1000 * 60 * 60 * 24,
            });
            return res.json({
                logined: true,
                message: "You have been logged in"
            })
        } else {
            return res.json({
                message: "Please provide a valid password for account."
            })
        }
    } catch (error) {
        res.status(400).send("An error occured");
    }
})

router.post('/reset/verify/link', async (req, res) => {
    try {
        let user = await User.findOne({
            Email: req.body.Email
        });

        const randomtoken = crypto.randomBytes(32).toString("hex");

        let token = await Token.findOneAndUpdate({
            userId: user._id,
        }, {
            token: randomtoken,
        })

        const link = `${req.protocol}://${req.headers.host}/registration/verify/${user.id}/${randomtoken}`;

        const message = `<a href="${link}">Click here to activate account</a>`

        await sendEmail(user.Email, "Verify Email", message);

        return res.json({
            sendMessage: true,
        })
    } catch (error) {
        res.status(400).send("An error occured");
    }
})

export {
    router as LoginRoute
}