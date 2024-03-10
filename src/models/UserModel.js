const {Schema, model} = require("mongoose");

const DataSchema = new Schema({
    email: {type: String, unique: true},
    firstName: {type: String},
    lastName: {type: String},
    mobile: {type: String},
    password: {type: String},
    photo: {type: String},
}, {timestamps: true, versionKey: false});

const UserModel = model("users", DataSchema);

module.exports = UserModel;