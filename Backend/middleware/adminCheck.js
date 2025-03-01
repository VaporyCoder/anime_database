// backend/middleware/adminCheck.js
const adminCheck = (req, res, next) => {
    if (!req.user?.isAdmin) {
      return res.status(403).json({ 
        success: false,
        error: "Access denied. Admin privileges required."
      });
    }
    next();
  };
  
  module.exports = adminCheck;