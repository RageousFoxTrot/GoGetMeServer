"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.UserModel = mongoose_1.model('User', new mongoose_1.Schema({
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
