import mongodb from "mongodb";
import {
    User,
    validate
} from "../models/user.js";
import express from 'express';
const router = express.Router();

router.get('/check/logined', async (req, res) => {
    if (req.cookies.logined) {
        const ObjectID = mongodb.ObjectID;

        if (!ObjectID.isValid(req.cookies.logined)) {
            return res.status(400).send("An error occured");
        }

        let user = await User.findOne({
            _id: req.cookies.logined
        });

        if (!user) res.status(400).send("An error occured");

        return res.json({
            logined: true,
            email: user.Email,
        })
    } else {
        return res.json({
            logined: false,
        })
    }
})

router.patch('/', async (req, res) => {
    try {
        let user = await User.findOne({
            Email: req.body.Email,
        })

        if (!user) return res.status(400).send("An error occured");

        if (user.Password !== req.body.CurrentPassword) return res.json({
            message: 'Current password is not valid'
        })

        const {
            error
        } = validate({
            Password: req.body.NewPassword
        });

        if (error) return res.json({
            message: error.details[0].message
        })

        if (req.body.NewPassword !== req.body.ConfirmNewPassword) {
            return res.json({
                message: 'Given new passwords do not match'
            })
        }

        await User.findOneAndUpdate({
            Email: req.body.Email,
        }, {
            Password: req.body.NewPassword,
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
    router as ChangePasswordRoute
}