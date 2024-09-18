const express=require("express");
const router=express.Router();
const hotel=require('../../hotel.json');
const jwt=require("jsonwebtoken");
const cookieparser=require("cookie-parser");
const errorHandler = require("../../guestErrHandler");
const Employee = require("../../model/employee");
const Hotel = require("./../../model/hotel");
const Room = require("./../../model/room");
router.use(express.json());
router.use(express.urlencoded({extended:true}));
router.use(cookieparser());
router.use(errorHandler);

router.get("/", (req,res)=>{
    res.redirect("/admin/login");
})

router.get("/login", (req,res)=>{
    res.render("employee/login");
});

router.get("/signup", (req,res)=>{
    res.render("employee/signup")
});

router.post('/signup', async (req, res) => {
    try {
      const { first_name, last_name, phone, password } = req.body;
      if (!first_name || !last_name || !phone || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
      }  
    Employee.createUser(first_name, last_name, phone, password)
    .then(()=>{
        console.log(first_name, last_name, phone, password);
        res.status(201).json({ message: 'Employee created successfully' });
    });
    } catch (error) {
        console.log(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  router.post('/login', async (req, res, next) => {
    try {
      const { phone, password } = req.body; 
      if (!phone || !password) {
        return res.status(400).json({ error: 'Missing required fields: phone or password' });
      }  
      const employee = await Employee.findByPhoneAndPassword(phone, password); // Replace with actual method
      if (!employee) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      const token = jwt.sign({ empId: employee.EMPLOYEE_ID }, "your_secret_key", { expiresIn: '3h' });  
      // Set the token cookie with HttpOnly flag for security
      res.cookie('admin', token, { httpOnly: true });
      // Redirect to dashboard (replace with appropriate action)
      res.redirect('/admin/dashboard');  // Assuming a separate admin dashboard route
    } catch (error) {
      console.error('Error logging in employee:', error);
      res.status(500).json({ error: 'Internal server error' });
      next(error);
    }
  });

  router.get('/dashboard', async (req, res, next) => {
    try {
      const {filter, search} = req.query;
      let hotels=[];
      if(filter && search){
         hotels = await Hotel.findHotels(filter, search);
      }
      else{
         hotels = await Hotel.getHotelsAndRooms();
      }
        res.render('employee/dashboard', { user:req.employee, hotels });        
    } catch (error) {
      next(error)
    }
  });

  router.post('/create_hotel',   async (req, res) => {
  try {
    const { hotelName, location, roomPrice, roomTypes, roomNumStart, roomNumEnd } = req.body;
    console.log("employee",req.employee)
    const employeeId = req.employee.EMPLOYEE_ID;

    // Calculate total rooms
    const rooms = [];
    for (let i = 0; i < roomNumStart.length; i++) {
      rooms.push(roomNumEnd[i] - roomNumStart[i] + 1);
    }
    const totalRooms = rooms.reduce((acc, cur) => acc + cur, 0);

    // Create the hotel
    const hotel = await Hotel.createHotel(employeeId, hotelName, totalRooms,location );

    // Create rooms
    let room;
    for (let i = 0; i < roomTypes.length; i++) {
      let roomNumStr = [];
      for (let j = parseInt(roomNumStart[i]); j <= parseInt(roomNumEnd[i]); j++) {
        roomNumStr.push(j);
      }
      roomNumStr = JSON.stringify(roomNumStr);
       room = await Room.createRoom(  roomTypes[i], roomPrice[i],roomNumStr,hotelName );

    }
    if(room){
    res.status(200).json({ message: 'Hotel created successfully' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to create hotel' });
  }
});

router.delete("/delete-hotel/:name", async(req,res)=>{
  await Hotel.deleteHotel(req.params.name);
  console.log("Successfully deleted");
  res.status(200).end("done");
});

module.exports = router;
