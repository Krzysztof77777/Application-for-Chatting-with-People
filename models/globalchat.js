import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const globalchatSchema = new Schema({
    message: {
        type: Object,
        required: true,
    },
    date: {
        type: Date,
    }
});

const globalChat = mongoose.model("globalchat", globalchatSchema);

export {
    globalChat,
}