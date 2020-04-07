import { model, Schema } from 'mongoose';

export const UserModel = model('User', new Schema({
    name: String,
    birthday: Date,
    description: String,
    creationdate: {
        type: Date,
        default: Date.now
    },
    uid: String,
    pwd: String
}));