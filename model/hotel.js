const { query } = require('./../db.js'); // Replace with your actual path to db.js

class Hotel {

  static async createHotel( employeeID, hotelName, numOfRooms, location) {
    try {
      const [result] = await query('INSERT INTO hotel (EMPLOYEE_ID, HOTEL_NAME, NUM_ROOMS, LOCATION) VALUES (?, ?, ?, ?) ', [ employeeID, hotelName, numOfRooms, location]
      );
      return result.insertId;
    } catch (error) {
      console.error('Error creating hotel:', error);
      throw error;
    }
  }

  
  static async getHotels() {
    try {
      const [rows] = await query('SELECT * FROM hotel');
      console.log(rows)
      return rows;
    } catch (error) {
      console.error('Error retrieving hotels:', error);
      throw error;
    }
  }


static async getHotelByName(hotelName) {
  try {
    const [rows] = await query(
      'SELECT * FROM hotel WHERE HOTEL_NAME = ?',
      [hotelName]
    );
    return rows[0]; // Return the first hotel found or null if none found
  } catch (error) {
    console.error('Error retrieving hotel by name:', error);
    throw error;
  }
}

static async getHotelsAndRooms() {
  try {
    const hotels = await query(
      'SELECT h.hotel_name, h.location, r.room_type, r.price FROM hotel h LEFT JOIN room r ON h.hotel_name = r.hotel limit 6'
    );
    return hotels[0];
  } catch (error) {
    console.error('Error retrieving hotels and rooms:', error);
    throw error;
  }
};

static async deleteHotel(name){
  try{
    const deleted = await query(
      "DELETE FROM HOTEL WHERE HOTEL_NAME = ?", [name]
    );
    return deleted;
  }catch (error){
    console.error("Error deleting hotel: ", error);
  }
}

static async findHotels(filter,search){
  try{
    let [hotels] = await query('SELECT h.hotel_name, h.location, r.room_type, r.price FROM hotel h LEFT JOIN room r ON h.hotel_name = r.hotel WHERE '+ filter+ "= ?", [search]);
    return hotels;
  }
  catch(err){
    console.log("Error finding hotels: ", err)
  }
}

}

module.exports = Hotel;
