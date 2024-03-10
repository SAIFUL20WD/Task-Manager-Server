const TaskModel = require("../models/TaskModel");

exports.createTask = async(req, res) => {
    try{
        const email = req.headers.email;
        req.body.email = email;
        const result = await TaskModel.create(req.body);
        res.status(200).json({status: "success", data: result});
    }
    catch(error){
        res.status(400).json({status: "fail", data: error});
    }
}

exports.deleteTask = async(req, res) => {
    try{
        const id = req.params.id;
        const result = await TaskModel.deleteOne({_id: id});
        res.status(200).json({status: "success", data: "Task Deleted"});
    }
    catch(error){
        res.status(400).json({status: "fail", data: error});
    }
}

exports.updateTask = async(req, res) => {
    try{
        const id = req.params.id;
        const status = req.params.status;
        req.body.status = status
        const result = await TaskModel.updateOne({_id: id}, req.body);
        res.status(200).json({status: "success", data: "Task Status Updated"});
    }
    catch(error){
        res.status(400).json({status: "fail", data: error});
    }
}

exports.listTaskByStatus = async(req, res) => {
    try{
        const status = req.params.status;
        const email = req.headers.email;
        const result = await TaskModel.aggregate([
            {$match: {email: email, status: status}},
            {$project:{
                _id:1,title:1,description:1, status:1,
                createdDate:{
                    $dateToString:{
                        date:"$createdAt",
                        format:"%d-%m-%Y"
                    }
                }
            }}
        ]);
        res.status(200).json({status: "success", data: result});
    }
    catch(error){
        res.status(400).json({status: "fail", data: error});
    }
}

exports.taskStatusCount = async(req, res) => {
    try{
        const email = req.headers.email;
        const result = await TaskModel.aggregate([
            {$match: {email: email}},
            {$group: {_id: "$status", sum: {$count: {}}}}
            
        ]);
        res.status(200).json({status: "success", data: result});
    }
    catch(error){
        res.status(400).json({status: "fail", data: error});
    }
}