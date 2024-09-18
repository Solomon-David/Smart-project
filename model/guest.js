const { query } = require('../db.js'); // Replace with your actual path to db.js
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

class Guest {
  static async createUser(first_name, last_name, phone, address, email, password) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      
      console.log(first_name,last_name,phone,address,email,password);
      const result = await query('INSERT INTO GUEST(first_name, last_name, phone, address, email, password) VALUES (?, ?, ?, ?, ?, ?);', [first_name, last_name, phone, address, email, hashedPassword]);
  
      // Check for duplicate email (you can add a unique constraint on the email column in the database for better performance)
      if (result.affectedRows === 0) {
        throw new Error('Email already exists');
      }

      return result.insertId;
    } catch (error) {
      console.error('Error creating guest:', error);
      throw error;
    }
  }

  static async findByEmailAndPassword(email, password) {
  try {
    // this part is broken 
    let user = await query('SELECT * FROM GUEST WHERE email = ? limit 1;', [email]);
    user = user[0][0];
    
    if (!user || !(await bcrypt.compare(password, user.PASSWORD))) {
       return null;
    }
    return user;
  } catch (error) {
    console.error('Error finding guest by email and password:', error);
    throw error;
  }
}


  static async updateGuest(guestId, updatedData) {
    try {
      const fieldsToUpdate = [];
      const values = [];
      let i = 1;
      for (const key in updatedData) {
        fieldsToUpdate.push(`${key} = ?`);
        values.push(updatedData[key]);
      }
      values.push(guestId); // For the WHERE clause

      const updateQuery = `UPDATE GUEST SET ${fieldsToUpdate.join(', ')} WHERE id = ?`;
      const [result] = await query(updateQuery, values);

      if (result.affectedRows === 0) {
        throw new Error('Guest not found');
      }

      return result.affectedRows;
    } catch (error) {
      console.error('Error updating guest:', error);
      throw error;
    }
  }

  static async findById(id) {
    try {
      const [rows] = await query('SELECT * FROM GUEST WHERE guest_id = ?', [id]);
      return rows[0];
    } catch (error) {
      console.error('Error finding guest by id:', error);
      throw error;
    }
  }


}
module.exports = Guest;
