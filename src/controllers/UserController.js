const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel");
const OTPModel = require("../models/OTPModel");

exports.registration = async(req, res) => {
    try{
        const result = await UserModel.create(req.body);
        res.status(200).json({status: "success", data: result});
    }
    catch(error){
        res.status(400).json({status: "fail", data: error});
    }
}

exports.login = async(req, res) => {
    try{
        const result = await UserModel.aggregate([
            {$match: req.body},
            {$project: {_id: 0, email: 1, firstName: 1, lastName: 1, mobile: 1, photo: 1}}
        ]);
        if(result.length > 0){
            const token = jwt.sign({data: result[0].email}, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.status(200).json({status: "success", data: result[0], token: token});
        }
    }
    catch(error){
        res.status(400).json({status: "fail", data: error});
    }
}

exports.profileUpdate = async(req, res) => {
    try{
        const email = req.headers.email
        const result = await UserModel.updateOne({email: email}, req.body);
        res.status(200).json({status: "success", data: "Profile Updated"});
    }
    catch(error){
        res.status(400).json({status: "fail", data: error});
    }
}

exports.profileDetails = async(req,res)=>{
    try{
        const email= req.headers.email;
        const result = await UserModel.aggregate([
            {$match:{email:email}},
            {$project:{_id:1,email:1,firstName:1,lastName:1,mobile:1,photo:1,password:1}}
        ])
        res.status(200).json({status: "success", data: result});
    }
    catch(error){
        res.status(400).json({status: "fail", data: error});
    }
}

exports.RecoverVerifyEmail=async (req,res)=>{
    let email = req.params.email;
    let OTPCode = Math.floor(100000 + Math.random() * 900000)
    try {
        // Email Account Query
        let UserCount = (await UserModel.aggregate([{$match: {email: email}}, {$count: "total"}]))
        if(UserCount.length>0){
            // OTP Insert
            let CreateOTP = await OTPModel.create({email: email, otp: OTPCode})
            // Email Send
            let SendEmail = await SendEmailUtility(email,"Your PIN Code is= "+OTPCode,"Task Manager PIN Verification")
            res.status(200).json({status: "success", data: SendEmail})
        }
        else{
            res.status(200).json({status: "fail", data: "No User Found"})
        }

    }catch (e) {
        res.status(200).json({status: "fail", data:e})
    }

}




exports.RecoverVerifyOTP=async (req,res)=>{
    let email = req.params.email;
    let OTPCode = req.params.otp;
    let status=0;
    let statusUpdate=1;
    try {
        let OTPCount = await OTPModel.aggregate([{$match: {email: email, otp: OTPCode, status: status}}, {$count: "total"}])
        if (OTPCount.length>0) {
            let OTPUpdate = await OTPModel.updateOne({email: email, otp: OTPCode, status: status}, {
                email: email,
                otp: OTPCode,
                status: statusUpdate
            })
            res.status(200).json({status: "success", data: OTPUpdate})
        } else {
            res.status(200).json({status: "fail", data: "Invalid OTP Code"})
        }
    }
    catch (e) {
        res.status(200).json({status: "fail", data:e})
    }
}



exports.RecoverResetPass=async (req,res)=>{

    let email = req.body['email'];
    let OTPCode = req.body['OTP'];
    let NewPass =  req.body['password'];
    let statusUpdate=1;

    try {
        let OTPUsedCount = await OTPModel.aggregate([{$match: {email: email, otp: OTPCode, status: statusUpdate}}, {$count: "total"}])
        if (OTPUsedCount.length>0) {
            let PassUpdate = await UserModel.updateOne({email: email}, {
                password: NewPass
            })
            res.status(200).json({status: "success", data: PassUpdate})
        } else {
            res.status(200).json({status: "fail", data: "Invalid Request"})
        }
    }
    catch (e) {
        res.status(200).json({status: "fail", data:e})
    }
}