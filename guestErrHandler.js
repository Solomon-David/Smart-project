const { TokenExpiredError } = require("jsonwebtoken");

const errorHandler = (err, req, res, next) => {
    if(err instanceof TokenExpiredError){
        console.log("Token error. You need to log in again")
        res.redirect("/login");
    }
    else{
        console.log("error found")
        console.log(err.stack)
    }
    
  };
  
  module.exports = errorHandler;