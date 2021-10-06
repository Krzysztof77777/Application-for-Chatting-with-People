import mongodb from "mongodb";
import {
    Token
} from "../models/token.js";
import {
    User
} from "../models/user.js";
import express from 'express';
const router = express.Router();

router.head("/:id/:token", async (req, res) => {
    try {
        const ObjectID = mongodb.ObjectID;

        if (!ObjectID.isValid(req.params.id)) {
            return res.json({
                message: 'Invalid link'
            })
        }

        const user = await User.findOne({
            _id: req.params.id
        });

        if (!user) return res.json({
            message: 'Invalid link'
        })

        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token,
        });

        if (!token) return res.json({
            message: 'Invalid link'
        })

        await User.findOneAndUpdate({
            _id: user._id,
        }, {
            verified: true
        });

        await Token.findByIdAndRemove(token._id);

        return res.json({
            isConfirmed: true,
            message: "Email verified succesfully"
        })
    } catch (error) {
        res.status(400).send("An error occured");
    }
});

export {
    router as VerifyRoute
}