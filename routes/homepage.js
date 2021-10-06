import path from 'path';
import {
    fileURLToPath
} from 'url';
const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);
import fs from 'fs';
import mongodb from "mongodb";
import {
    User,
    validate
} from "../models/user.js";
import {
    globalChat
} from "../models/globalchat.js";
import express from 'express';
const router = express.Router();

router.patch('/changeAvatar', async (req, res) => {
    const ObjectID = mongodb.ObjectID;

    if (!ObjectID.isValid(req.cookies.logined)) {
        return res.status(400).send("An error occured");
    }

    let user = await User.findOne({
        _id: req.cookies.logined
    });

    if (!user) return res.status(400).send("An error occured");

    const userObject = user.toObject();

    if (!(userObject.Avatar === "")) {
        fs.unlinkSync(path.join(__dirname, '../build/uploads/') + userObject.Avatar, (err) => {});
    }

    const avatar = req.files.avatar;
    const avatarPath = path.join(__dirname, '../build/uploads/') + req.cookies.logined + avatar.name;

    avatar.mv(avatarPath, function (err) {
        if (err) {
            return res.status(500).send(err);
        }
    });

    await User.findOneAndUpdate({
        _id: req.cookies.logined
    }, {
        Avatar: `${req.cookies.logined}${avatar.name}`,
    })

    return res.json({
        done: true
    })
})

router.get('/check/logined', async (req, res) => {
    try {
        if (req.cookies.logined) {
            const ObjectID = mongodb.ObjectID;

            if (!ObjectID.isValid(req.cookies.logined)) {
                return res.status(400).send("An error occured");
            }

            let user = await User.findOne({
                _id: req.cookies.logined
            });

            if (!user) return res.json({
                logined: false,
            })

            return res.json({
                logined: true,
                objectID: req.cookies.logined,
                name: user.Name,
                surname: user.Surname,
                avatar: user.Avatar,
            })
        } else {
            return res.json({
                logined: false,
            })
        }
    } catch (error) {
        res.status(400).send("An error occured");
    }
})

router.get('/logout', (req, res) => {
    try {
        res.clearCookie('logined');
        return res.json({
            logout: true,
        })
    } catch (error) {
        res.status(400).send("An error occured");
    }
})

router.post('/transferUsers', async (req, res) => {
    try {
        const user = await User.findOne({
            _id: req.cookies.logined
        });

        if (!user) return res.status(400).send("An error occured");

        const userObject = user.toObject();

        const users = await User
            .find({
                $or: [{
                        _id: {
                            $ne: req.cookies.logined,
                        },
                        Name: {
                            $regex: `^${req.body.inputText.trim()}`,
                            $options: 'i'
                        },
                        verified: true,
                    },
                    {
                        _id: {
                            $ne: req.cookies.logined,
                        },
                        Surname: {
                            $regex: `^${req.body.inputText.trim()}`,
                            $options: 'i'
                        },
                        verified: true,
                    },
                    {
                        _id: {
                            $ne: req.cookies.logined,
                        },
                        NameWithSurname: {
                            $regex: `^${req.body.inputText.trim()}`,
                            $options: 'i'
                        },
                        verified: true,
                    }
                ]
            })
            .limit(10)
            .exec();

        const usersObject = [];

        for (const el of users) {
            const idOfUser = `${el._id.valueOf()}`;
            let isFriend = false;
            let isAccepted = null;
            for (const element of userObject.friendList) {
                if (element.with === idOfUser) {
                    isFriend = true;
                    if (!element.isAccepted) {
                        isAccepted = false;
                        isFriend = false;
                    }
                }
            }
            usersObject.push({
                Avatar: el.Avatar,
                Name: el.Name,
                Surname: el.Surname,
                _id: el._id,
                isFriend,
                isAccepted,
            })
        }

        return res.json({
            users: usersObject,
        })
    } catch (error) {
        res.status(400).send("An error occured");
    }
})

router.post('/acceptInvitation', async (req, res) => {
    try {
        const user = await User.findOne({
            _id: req.cookies.logined
        });

        if (!user) return res.status(400).send("An error occured");

        const userObject = user.toObject();

        const withContact = await User.findOne({
            _id: req.body.WITH
        })

        const withContactObject = withContact.toObject();

        for (const el of userObject.friendList) {
            if (el.with === req.body.WITH) {
                el.isAccepted = true;
            }
        }

        for (const el of withContactObject.friendList) {
            if (el.with === req.cookies.logined) {
                el.isAccepted = true;
            }
        }

        await User.findOneAndUpdate({
            _id: req.cookies.logined,
        }, {
            friendList: userObject.friendList
        })

        await User.findOneAndUpdate({
            _id: req.body.WITH,
        }, {
            friendList: withContactObject.friendList
        })

        return res.json({
            sent: true
        })
    } catch (error) {
        res.status(400).send("An error occured");
    }
})

router.delete('/removeInvitation', async (req, res) => {
    try {
        const user = await User.findOne({
            _id: req.cookies.logined
        });

        if (!user) return res.status(400).send("An error occured");

        const userObject = user.toObject();

        const withContact = await User.findOne({
            _id: req.body.WITH
        })

        const withContactObject = withContact.toObject();

        const indexOfFriend1 = userObject.friendList.findIndex(e => e.with === req.body.WITH);

        userObject.friendList.splice(indexOfFriend1, 1);

        const indexOfMessagesWithFriend1 = userObject.messages.findIndex(e => e.message.with === req.body.WITH);

        if (indexOfMessagesWithFriend1 !== -1) userObject.messages.splice(indexOfMessagesWithFriend1, 1);

        const indexOfFriend2 = withContactObject.friendList.findIndex(e => e.with === req.cookies.logined);

        withContactObject.friendList.splice(indexOfFriend2, 1);

        const indexOfMessagesWithFriend2 = withContactObject.messages.findIndex(e => e.message.with === req.cookies.logined);

        if (indexOfMessagesWithFriend2 !== -1) withContactObject.messages.splice(indexOfMessagesWithFriend2, 1);

        await User.findOneAndUpdate({
            _id: req.cookies.logined,
        }, {
            friendList: userObject.friendList,
            messages: userObject.messages,
        })

        await User.findOneAndUpdate({
            _id: req.body.WITH,
        }, {
            friendList: withContactObject.friendList,
            messages: withContactObject.messages,
        })

        return res.json({
            sent: true
        })
    } catch (error) {
        res.status(400).send("An error occured");
    }
})

router.post('/addFriend', async (req, res) => {
    try {
        const user = await User.findOne({
            _id: req.cookies.logined
        });

        if (!user) return res.status(400).send("An error occured");

        const userObject = user.toObject();

        let withContact = await User.findOne({
            _id: req.body.id
        })

        if (!withContact) return res.status(400).send("An error occured");

        let withContactObject = withContact.toObject();

        userObject.friendList.push({
            with: req.body.id,
            isAccepted: false,
            inviteSent: true,
            inComingInvite: false,
            isRead: true,
        })

        withContactObject.friendList.push({
            with: req.cookies.logined,
            isAccepted: false,
            inviteSent: false,
            inComingInvite: true,
            isRead: false,
        })

        await User.findOneAndUpdate({
            _id: req.cookies.logined
        }, {
            friendList: userObject.friendList
        })

        await User.findOneAndUpdate({
            _id: req.body.id
        }, {
            friendList: withContactObject.friendList,
        })

        return res.json({
            sent: true
        })
    } catch (error) {
        res.status(400).send("An error occured");
    }
})

router.post('/transferFriendList', async (req, res) => {
    try {
        let user = await User.findOne({
            _id: req.cookies.logined
        });

        if (!user) return res.status(400).send("An error occured");

        let userObject = user.toObject();

        let friendList = [];

        const inputSearch = req.body.inputText.toLowerCase().trim();

        for (const el of userObject.friendList) {
            let userWith = await User.findOne({
                _id: el.with,
            });

            if (!userWith) return res.status(400).send("An error occured");

            if (!userWith.Name.toLowerCase().search(inputSearch) || !userWith.Surname.toLowerCase().search(inputSearch) || !`${userWith.Name.toLowerCase()} ${userWith.Surname.toLowerCase()}`.search(inputSearch)) {
                friendList.push({
                    with: el.with,
                    withName: userWith.Name,
                    withSurname: userWith.Surname,
                    withAvatar: userWith.Avatar,
                    isAccepted: el.isAccepted,
                    inviteSent: el.inviteSent,
                    inComingInvite: el.inComingInvite,
                })
            }
        }

        return res.json({
            friendList,
        })
    } catch (error) {
        res.status(400).send("An error occured");
    }
})

router.post('/transferMessages', async (req, res) => {
    try {
        let user = await User.findOne({
            _id: req.cookies.logined
        });

        if (!user) return res.status(400).send("An error occured");

        let userObject = user.toObject();

        let messages = [];

        const inputSearch = req.body.inputText.toLowerCase().trim();

        for (const el of userObject.messages) {
            if (el.message.messages.length < 1) break;
            let userWith = await User.findOne({
                _id: el.message.with,
            });

            if (!userWith) return res.status(400).send("An error occured");

            if (!userWith.Name.toLowerCase().search(inputSearch) || !userWith.Surname.toLowerCase().search(inputSearch) || !`${userWith.Name.toLowerCase()} ${userWith.Surname.toLowerCase()}`.search(inputSearch)) {
                const dateOfMessage = new Date(el.message.messages[el.message.messages.length - 1].date).getTime();
                messages.push({
                    with: el.message.with,
                    withName: userWith.Name,
                    withSurname: userWith.Surname,
                    withAvatar: userWith.Avatar,
                    lastmessage: el.message.messages[el.message.messages.length - 1].message.text,
                    dateOfLastMessage: dateOfMessage,
                    isNewMessageCounter: el.message.isNewMessageCounter,
                })
            }
        }

        messages.sort((a, b) => b.dateOfLastMessage - a.dateOfLastMessage);

        return res.json({
            messages,
        })
    } catch (error) {
        res.status(400).send("An error occured");
    }
})

router.get('/transferMenuInformation', async (req, res) => {
    try {
        let user = await User.findOne({
            _id: req.cookies.logined
        });

        if (!user) return res.status(400).send("An error occured");

        let userObject = user.toObject();

        let isNewMessage = false;
        let isNewInvite = false;

        for (const el of userObject.messages) {
            if (el.message.isNewMessageCounter) {
                isNewMessage = true;
                break;
            }
        }
        for (const el of userObject.friendList) {
            if (!el.isRead) {
                isNewInvite = true;
                break;
            }
        }

        return res.json({
            avatar: user.Avatar,
            panel: {
                isNewMessage: isNewMessage,
                isNewInvite: isNewInvite,
            }
        })
    } catch (error) {
        res.status(400).send("An error occured");
    }
})

router.patch("/updateMenuInformation", async (req, res) => {
    try {
        let user = await User.findOne({
            _id: req.cookies.logined
        });

        if (!user) return res.status(400).send("An error occured");

        const userObject = user.toObject();

        for (const el of userObject.friendList) {
            if (!el.isRead) {
                el.isRead = true;
            }
        }

        await User.findByIdAndUpdate({
            _id: req.cookies.logined
        }, {
            friendList: userObject.friendList
        })

        return res.end();
    } catch (error) {
        res.status(400).send("An error occured");
    }
})

router.patch("/updateCounterOfNewMessages", async (req, res) => {
    try {
        let user = await User.findOne({
            _id: req.cookies.logined
        });

        if (!user) return res.status(400).send("An error occured");

        const userObject = user.toObject();

        for (const el of userObject.messages) {
            if (el.message.with === req.body.with) {
                el.message.isNewMessageCounter = 0;
            }
        }

        await User.findByIdAndUpdate({
            _id: req.cookies.logined
        }, {
            messages: userObject.messages,
        })

        return res.json({
            done: true
        })
    } catch (error) {
        res.status(400).send("An error occured");
    }
})

router.post('/transferUser', async (req, res) => {
    try {
        if (req.cookies.logined) {
            const ObjectID = mongodb.ObjectID;

            if (!ObjectID.isValid(req.cookies.logined)) {
                return res.status(400).send("An error occured");
            }

            let user = await User.findOne({
                _id: req.cookies.logined,
            });

            let searchUser = await User.findOne({
                _id: req.body.idUserForChat
            });

            if (!searchUser) return res.status(400).send("An error occured");

            if (!user) return res.status(400).send("An error occured");

            const userObject = user.toObject();

            let isFriend = null
            let isAccepted = null;
            let isIncomingInvite = null;

            for (const el of userObject.friendList) {
                if (el.with === req.body.idUserForChat) {
                    if (el.isAccepted) {
                        isFriend = true;
                    } else {
                        isFriend = false;
                        isAccepted = false;
                        isIncomingInvite = el.inComingInvite;
                    }
                }
            }

            if (isFriend === null && isAccepted === null) {
                isFriend = false;
            }

            if (req.body.idUserForChat === req.cookies.logined) {
                isFriend = null
                isAccepted = null;
                isIncomingInvite = null;
            }

            return res.json({
                Name: searchUser.Name,
                Surname: searchUser.Surname,
                Avatar: searchUser.Avatar,
                isFriend: isFriend,
                isAccepted: isAccepted,
                isIncomingInvite: isIncomingInvite,
            })
        } else {
            res.status(400).send("An error occured");
        }
    } catch (error) {
        res.status(400).send("An error occured");
    }
})

router.post('/transferProfile', async (req, res) => {
    try {
        if (req.cookies.logined) {
            const ObjectID = mongodb.ObjectID;

            if (!ObjectID.isValid(req.cookies.logined)) {
                return res.status(400).send("An error occured");
            }

            let user = await User.findOne({
                _id: req.cookies.logined,
            });

            if (!user) return res.status(400).send("An error occured");

            const userObject = user.toObject();

            return res.json({
                Name: user.Name,
                Surname: user.Surname,
                Email: user.Email,
                Avatar: user.Avatar,
            })
        } else {
            res.status(400).send("An error occured");
        }
    } catch (error) {
        res.status(400).send("An error occured");
    }
})

router.patch('/updateChanges', async (req, res) => {
    try {
        const {
            error
        } = validate({
            Name: req.body.name,
            Surname: req.body.surname
        });

        if (error) return res.json({
            info: error.details[0].message
        })

        const ObjectID = mongodb.ObjectID;

        if (!ObjectID.isValid(req.cookies.logined)) {
            return res.status(400).send("An error occured");
        }

        let user = await User.findOne({
            _id: req.cookies.logined,
        });

        if (!user) return res.status(400).send("An error occured");

        await User.findOneAndUpdate({
            _id: req.cookies.logined,
        }, {
            Name: req.body.name,
            Surname: req.body.surname,
        })

        return res.json({
            done: true
        })
    } catch (error) {
        res.status(400).send("An error occured");
    }
})

router.get('/transferMessagesFromGlobalChat', async (req, res) => {
    try {
        const messagesObject = await globalChat
            .find()
            .limit(40);

        const messages = [];

        for (const el of messagesObject) {
            const user = await User.findOne({
                _id: el.message.from.ObjectID
            });
            messages.push({
                date: el.date,
                message: {
                    from: {
                        ObjectID: el.message.from.ObjectID,
                        withName: user.Name,
                        withSurname: user.Surname,
                        withAvatar: user.Avatar,
                    },
                    text: el.message.text,
                }
            })
        }

        return res.json({
            messages,
        })
    } catch (error) {
        res.status(400).send("An error occured");
    }
})

router.post('/transferMessagesFromChat', async (req, res) => {
    try {
        let user = await User.findOne({
            _id: req.cookies.logined
        });

        if (!user) return res.status(400).send("An error occured");

        let userObject = user.toObject();

        let withContact = await User.findOne({
            _id: req.body.objectIDFromMessage,
        })

        if (!withContact) return res.status(400).send("An error occured");

        let withContactObject = withContact.toObject();

        const messages = [];

        for (const el of userObject.messages) {
            if (el.message.with === req.body.objectIDFromMessage) {
                for (const element of el.message.messages) {
                    messages.push({
                        date: element.date,
                        message: {
                            from: {
                                ObjectID: element.message.from.ObjectID,
                                withName: element.message.from.ObjectID === req.cookies.logined ? user.Name : withContact.Name,
                                withSurname: element.message.from.ObjectID === req.cookies.logined ? user.Surname : withContact.Surname,
                                withAvatar: element.message.from.ObjectID === req.cookies.logined ? user.Avatar : withContact.Avatar,
                            },
                            text: element.message.text,
                        }
                    })
                }
                return res.json({
                    messages: messages,
                })
            }
        }

        userObject.messages.push({
            message: {
                with: req.body.objectIDFromMessage,
                isNewMessageCounter: 0,
                messages: [],
            }
        })

        withContactObject.messages.push({
            message: {
                with: req.cookies.logined,
                isNewMessageCounter: 0,
                messages: [],
            }
        })

        await User.findOneAndUpdate({
            _id: req.cookies.logined
        }, {
            messages: userObject.messages,
        })

        await User.findOneAndUpdate({
            _id: req.body.objectIDFromMessage
        }, {
            messages: withContactObject.messages
        })

        return res.json({
            messages: [],
        })
    } catch (error) {
        res.status(400).send("An error occured");
    }
})

router.post('/sendMessageToGlobalChat', async (req, res) => {
    const limitOfMessages = 40;
    try {
        if (req.cookies.logined) {
            const ObjectID = mongodb.ObjectID;

            if (!ObjectID.isValid(req.cookies.logined)) {
                return res.status(400).send("An error occured");
            }

            let user = await User.findOne({
                _id: req.cookies.logined
            });

            if (!user) return res.status(400).send("An error occured");

            let userObject = user.toObject();

            const counterOfMessages = await globalChat.countDocuments();

            if (counterOfMessages >= limitOfMessages) {
                await globalChat.findOneAndRemove({}).sort({
                    date: 1,
                })
            }

            await new globalChat({
                message: {
                    from: {
                        ObjectID: req.cookies.logined,
                    },
                    text: req.body.inputText,
                },
                date: req.body.date,
            }).save();

            return res.json({
                sent: true,
            })
        } else {
            res.status(400).send("An error occured");
        }
    } catch (error) {
        res.status(400).send("An error occured");
    }
})

router.post('/sendMessageToChat', async (req, res) => {
    const limitOfMessages = 80;
    try {
        if (req.cookies.logined) {
            const ObjectID = mongodb.ObjectID;

            if (!ObjectID.isValid(req.cookies.logined)) {
                return res.status(400).send("An error occured");
            }

            let user = await User.findOne({
                _id: req.cookies.logined
            });

            if (!user) return res.status(400).send("An error occured");

            let userObject = user.toObject();

            let withContact = await User.findOne({
                _id: req.body.objectIDFromMessage,
            })

            if (!withContact) return res.status(400).send("An error occured");

            let withContactObject = withContact.toObject();

            for (const el of userObject.messages) {
                if (el.message.with === req.body.objectIDFromMessage) {
                    if (el.message.messages.length >= limitOfMessages) {
                        el.message.messages.splice(0, 1);
                    }
                    el.message.messages.push({
                        message: {
                            from: {
                                ObjectID: req.cookies.logined,
                            },
                            text: req.body.inputText,
                        },
                        date: req.body.date,
                    })
                }
            }

            for (const el of withContactObject.messages) {
                if (el.message.with === req.cookies.logined) {
                    if (el.message.messages.length >= limitOfMessages) {
                        el.message.messages.splice(0, 1);
                    }

                    el.message.isNewMessageCounter = el.message.isNewMessageCounter + 1;

                    el.message.messages.push({
                        message: {
                            from: {
                                ObjectID: req.cookies.logined,
                            },
                            text: req.body.inputText,
                        },
                        date: req.body.date,
                    })
                }
            }

            await User.findOneAndUpdate({
                _id: req.cookies.logined
            }, {
                messages: userObject.messages,
            });

            await User.findOneAndUpdate({
                _id: req.body.objectIDFromMessage
            }, {
                messages: withContactObject.messages,
            });

            return res.json({
                sent: true
            })
        }
    } catch (error) {
        res.status(400).send("An error occured");
    }
})

export {
    router as HomePageRoute
}