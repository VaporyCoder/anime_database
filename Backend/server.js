// Add this at the VERY TOP of server.js
require('dotenv').config();

const app = require('./app');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

  mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to:', 
      mongoose.connection.host,
      mongoose.connection.name
    );
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});