const { query } = require('./../db.js'); // Replace with your actual path to db.js

class Reservation {
  static async createReservation(guestId, roomNum, roomType, hotelCode, checkIn, checkOut) {
    try {
      const [result] = await query('INSERT INTO reservation (guest_id, room_num, room_type, hotel_code, checkIn, checkOut) VALUES (?, ?, ?, ?, ?, ?)',
       [guestId, roomNum, roomType, hotelCode, checkIn, checkOut]);
      return result;
    } catch (error) {
      console.error('Error creating reservation:', error);
      throw error;
    }
  }

  static async findByGuestId(guestId) {
    try {
      const [rows] = await query('SELECT r.*, h.hotel_name FROM reservation r INNER JOIN hotel h ON r.hotel_code = h.hotel_code WHERE r.guest_id = ?', [guestId]);
      return rows;
    } catch (error) {
      console.error('Error finding reservation by guest ID:', error);
      throw error;
    }
  }

  static async updateReservation(reservationId, updatedData) {
    try {
      const fieldsToUpdate = [];
      const values = [];
      let i = 1;
      for (const key in updatedData) {
        fieldsToUpdate.push(`${key} = ?`);
        values.push(updatedData[key]);
      }
      values.push(reservationId); // For the WHERE clause

      const updateQuery = `UPDATE reservation SET ${fieldsToUpdate.join(', ')} WHERE id = ?`;
      const [result] = await query(updateQuery, values);

      if (result.affectedRows === 0) {
        throw new Error('Reservation not found');
      }

      return result.affectedRows;
    } catch (error) {
      console.error('Error updating reservation:', error);
      throw error;
    }
  }

  static async deleteReservation(reservationId) {
    try {
      const [result] = await query('DELETE FROM reservation WHERE RES_NR = ?', [reservationId]);
      if (result.affectedRows === 0) {
        throw new Error('Reservation not found');
      }
      return true;
    } catch (error) {
      console.error('Error deleting reservation:', error);
      throw error;
    }
  }

  static async findByReservationId(reservationId) {
    try {
      const [rows] = await query('SELECT * FROM reservation WHERE id = ?', [reservationId]);
      return rows[0];
    } catch (error) {
      console.error('Error finding reservation by ID:', error);
      throw error;
    }
  }
}

module.exports = Reservation;
