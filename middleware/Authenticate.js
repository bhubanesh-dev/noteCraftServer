const jwt = require('jsonwebtoken');
const User=require("../models/User");


const Authenticate =async  (req, res, next) => {
    // Get the user from the jwt token and add id to req object
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({ error: "Please authenticate using a valid token" })
    }
 
    try {
        const data = jwt.verify(token,process.env.SECRET_KEY);
       console.log("token authenticated");
       req.verifyId = data.userLogin.id;
        next();
    } catch (error) {
        res.status(401).send({ error: "Please authenticate using a valid token" })
    }

}




module.exports = Authenticate;