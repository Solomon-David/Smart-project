const Guest = require('../models/guest');
const jwt = require('jsonwebtoken');

exports.createUser = async (req, res) => {
  try {
    const { first_name, last_name, phone, address, email, password } = req.body;
    const newGuest = await Guest.createUser(first_name, last_name, phone, address, email, password);
    res.status(201).json({ message: 'Guest created successfully', guestId: newGuest });
  } catch (error) {
    console.error('Error creating guest:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateGuest = async (req, res) => {
  try {
    const { guestId } = req.params;
    const updatedData = req.body;
    const updatedRows = await Guest.updateGuest(guestId, updatedData);
    if (updatedRows === 0) {
      return res.status(404).json({ message: 'Guest not found' });
    }
    res.json({ message: 'Guest updated successfully' });
  } catch (error) {
    console.error('Error updating guest:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Guest.findByEmailAndPassword(email, password);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user.id }, 'your_secret_key', { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
