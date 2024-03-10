const jwt = require("jsonwebtoken");

module.exports = async(req, res, next) => {
    const token = req.headers.token;
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if(err) res.status(401).json({status: "unathurized"})
        else{
            req.headers.email = decoded.data;
            next()
        }
    });
}