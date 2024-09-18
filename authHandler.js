const jwt = require("jsonwebtoken");
const Guest = require("./model/guest");
const Employee = require("./model/employee");

const AuthHandler = {
  adminAuth: async (req, res, next) => {
    try {
      
      if (/\.\*$/.test(req.originalUrl) || ['/admin', '/admin/login', '/admin/signup'].includes(req.originalUrl)) {
        return next(); 
      }
       const token = req.cookies.admin;
      if (!token) {
        return res.redirect("/admin/login");
      }
      const decoded = jwt.verify(token, 'your_secret_key');
      const userId = decoded.empId;
      const employee = await Employee.findById(userId);
      if (!employee) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      req.employee = employee;

      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return res.redirect("/admin/login");
      }

      return res.status(500).json({ message: 'Internal server error' });
  }
  },

  guestAuth: async (req, res, next) => {
    try {
      if (/\.\*$/.test(req.path) || ['/', '/login', '/signup'].includes(req.path)) {
        return next(); 
      }
      const token = req.cookies.user;
      if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
            const decoded = jwt.verify(token, 'your_secret_key');
      const userId = decoded.userId;
      const guest = await Guest.findById(userId);
      if (!guest) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      req.user = guest;
      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        console.log("Token expired. Please log in again.");
        return res.redirect("/login");
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
}
};

module.exports = AuthHandler;