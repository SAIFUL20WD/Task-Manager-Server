const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const TaskController = require("../controllers/TaskController");
const AuthVerify = require("../middlewares/AuthVerify");

router.post("/registration", UserController.registration);
router.post("/login", UserController.login);
router.post("/profileUpdate", AuthVerify, UserController.profileUpdate);
router.get("/profileDetails", AuthVerify, UserController.profileDetails);

router.get("/RecoverVerifyEmail/:email", UserController.RecoverVerifyEmail);
router.get("/RecoverVerifyOTP/:email/:otp", UserController.RecoverVerifyOTP);
router.post("/RecoverResetPass", UserController.RecoverResetPass);

router.post("/createTask", AuthVerify, TaskController.createTask);
router.delete("/deleteTask/:id", AuthVerify, TaskController.deleteTask);
router.post("/updateTaskStatus/:id/:status", AuthVerify, TaskController.updateTask);
router.get("/listTaskByStatus/:status", AuthVerify, TaskController.listTaskByStatus);
router.get("/taskStatusCount/", AuthVerify, TaskController.taskStatusCount);


module.exports = router;