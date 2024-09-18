const Guest = require('../model/guest'); // Replace with your model path
const Reservation = require("../model/reservation");
const Hotel = require("../model/hotel");
const Room = require("../model/room");
const express=require("express");
const router=express.Router();
const hotelInfo=require('../hotel.json');
const jwt=require("jsonwebtoken");
const cookieparser=require("cookie-parser");
const errorHandler = require("./../guestErrHandler");


router.use(express.json());
router.use(express.urlencoded({extended:true}));
router.use(cookieparser());
router.use(errorHandler);


router.get("/", (req,res)=>{
    res.render("home");
});

router.get("/signup", (req,res)=>{
    res.render("signup");
});



router.post('/signup', async (req, res) => {
  try {
    console.log(req.body);
    const { first_name, last_name, phone, address, email, password } = req.body;

    const newGuest = await Guest.createUser(first_name, last_name, phone, address, email, password);
    res.status(201).json({ message: 'Guest created successfully', guestId: newGuest });
  } catch (error) {
    console.error('Error creating guest:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get("/login", (req,res)=>{
    res.render("login");
});

router.post('/login', async (req, res,next) => {
    try {
      const { email, password } = req.body;
      const user = await Guest.findByEmailAndPassword(email, password);
  
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      const token = jwt.sign({ userId: user.GUEST_ID }, 'your_secret_key', { expiresIn:   
   '3h' });
        console.log("user.GUEST_ID ",user.GUEST_ID )
        console.log("token",token)
      res.cookie('user',   
   token, { httpOnly: true });
  
      res.redirect('/dashboard');
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ error: 'Internal server error' });
      next(error)
      
    }
  });



router.get('/dashboard', async (req, res,next) => {
    try {
      
  
      const reservations = await Reservation.findByGuestId(req.user.GUEST_ID); // Assuming a findByGuestId method in Reservation model
      console.log(reservations);
      res.render('dashboard', { user:req.user, reservations });
    } catch (error) {
      next(error)
    }
  });


router.get("/booking", async (req,res,next)=>{
  try{
    const hotels = await Hotel.getHotels();

    const hotelNames = hotels.map(hotel => hotel.HOTEL_NAME)
    
    res.render("booking", {
        name: `${req.user.FIRST_NAME} ${req.user.LAST_NAME}`,
      hotels: hotelNames,
      rooms:undefined,
      chosen:undefined
    }
    )
    }
    catch(error){
      next(error)
    }
});

router.post("/booking/:hotel", async (req, res, next) => {
  try {
    const chosen = await Hotel.getHotelByName(req.params.hotel);
    const rooms = await Room.getRoomsByHotelName(chosen.HOTEL_NAME);
    const hotels = await Hotel.getHotels();

    const hotelNames = hotels.map(hotel => hotel.HOTEL_NAME)
    
    res.render("booking", {
      name: `${req.user.FIRST_NAME} ${req.user.LAST_NAME}`,
      hotels: hotelNames, // Hotels from the database query
      rooms, // Rooms from the database query
      chosen: chosen// Pass the chosen hotel to the template
    });
  } catch (error) {
    next(error); // Pass any errors to the error-handling middleware
  }
});

router.post("/book", async (req,res)=>{
  const {roomnum, type, code, checkIn, checkOut} = req.body;
  const guestid = req.user.GUEST_ID;
  
  let reservation = await Reservation.createReservation(guestid, roomnum, type, code, checkIn, checkOut);

  res.status(200).json({message: reservation});

})

router.delete("/reservation/:id", async(req,res)=>{
  await Reservation.deleteReservation(req.params.id);
  console.log("Successfully deleted");
  res.status(200).end("done");
})

 
module.exports = router;