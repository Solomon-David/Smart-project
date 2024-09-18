const { query } = require('../db.js'); // Replace with your actual path to db.js
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

class Employee{
    static async createUser(first_name, last_name, phone, password) {
        try {
          const hashedPassword = await bcrypt.hash(password, 10);
          
          console.log(first_name,last_name,phone,password);
          const result = await query('INSERT INTO EMPLOYEE(first_name, last_name, phone, password) VALUES (?, ?, ?, ?);', [first_name, last_name, phone, hashedPassword]);
          console.log(result);
          return result.insertId;
        } catch (error) {
          console.error('Error creating employee:', error);
          throw error;
        }
      }

      static async findByPhoneAndPassword(phone, password) {
        try {
            // this part is broken 
            let user = await query('SELECT * FROM EMPLOYEE WHERE phone = ? limit 1;', [phone]);
            user = user[0][0];
            console.log(user);
            if (!user || !(await bcrypt.compare(password, user.PASSWORD))) {
               return null;
            }
            return user;
          } catch (error) {
          console.error('Error finding employee by phone and password:', error);
          throw error;
        } 
      }

      static async findById(id) {
        try {
          const [rows] = await query('SELECT * FROM EMPLOYEE WHERE employee_id = ?', [id]);
          return rows[0];
        } catch (error) {
          console.error('Error finding employee by id:', error);
          throw error;
        }
      }
}

module.exports = Employee;
