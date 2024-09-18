const { query } = require('./../db.js'); // Replace with your actual path to db.js

class Room {
  // Adds a new room to the database
  static async createRoom(roomType, price, roomNr, hotel) {
    try {
      const [result] = await query(
        'INSERT INTO room (ROOM_TYPE, PRICE, ROOM_NR, HOTEL) VALUES (?, ?, ?, ?)',
        [roomType, price, JSON.stringify(roomNr), hotel]
      );
      return result.insertId;
    } catch (error) {
      console.error('Error creating room:', error);
      throw error;
    }
  }

  // Retrieves all rooms for a specific hotel
  static async getRoomsByHotelName(name) {
    try {
      const [rows] = await query(
        'SELECT * FROM room WHERE HOTEL = ?',
        [name]
      );
      rows.forEach(row => {
        
        row.ROOM_NR = JSON.parse(row.ROOM_NR);
      });
      return rows;
    } catch (error) {
      console.error('Error retrieving rooms:', error);
      throw error;
    }
  }

  // Retrieves all rooms in the database
  static async getAllRooms() {
    try {
      const [rows] = await query('SELECT * FROM room');
      rows.forEach(row => {
        
        row.ROOM_NR = JSON.parse(row.ROOM_NR);
      });
      return rows;
    } catch (error) {
      console.error('Error retrieving all rooms:', error);
      throw error;
    }
  }
}

module.exports = Room;