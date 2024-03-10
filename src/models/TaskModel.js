const {Schema, model} = require("mongoose");

const DataSchema = new Schema({
    title: {type: String},
    description: {type: String},
    status: {type: String},
    email: {type: String}
}, {timestamps: true, versionKey: false});

const TaskModelModel = model("tasks", DataSchema);

module.exports = TaskModelModel;