import {
    sendEmail
} from "../utils/email.js";
import {
    Token
} from "../models/token.js";
import {
    User,
    validate
} from "../models/user.js";
import crypto from "crypto";
import express from 'express';
const router = express.Router();

router.post("/registration", async (req, res) => {
    try {
        const {
            error
        } = validate(req.body);

        if (error) return res.json({
            message: error.details[0].message
        })

        let user = await User.findOne({
            Email: req.body.Email
        });

        if (user) return res.json({
            message: "User with given email already exist!"
        })

        user = await new User({
            Name: req.body.Name,
            Surname: req.body.Surname,
            NameWithSurname: `${req.body.Name} ${req.body.Surname}`,
            Email: req.body.Email,
            Password: req.body.Password
        }).save();

        let token = await new Token({
            userId: user._id,
            token: crypto.randomBytes(32).toString("hex"),
        }).save();

        const link = `${req.protocol}://${req.headers.host}/registration/verify/${user.id}/${token.token}`;

        const message = `<a href="${link}">Click here to activate account</a>`

        await sendEmail(user.Email, "Verify Email", message);

        return res.json({
            register: true,
            message: "An Email sent to your account please verify"
        })
    } catch (error) {
        res.status(400).send("An error occured");
    }
});

export {
    router as RegisterRoute
}