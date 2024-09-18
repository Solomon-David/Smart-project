const path=require("path");
const express = require("express");
const app=express();
const employee=require("./view/employee/employeeRouter.js");
const general=require("./view/guestRouter.js");
const cookieParser = require("cookie-parser");
const {adminAuth, guestAuth} = require("./authHandler.js");

// for testing database connection
require("./db.js").testConn();

//views
app.use(express.static(path.join(__dirname, "view")))
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "view"));
app.use(cookieParser());

app.use("/admin",[adminAuth,employee]);
app.use("/",[guestAuth, general]);

console.log("Views set");
app.listen(3000, ()=>{
    console.log("Server started")
}) 