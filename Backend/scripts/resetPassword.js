const bcrypt = require('bcrypt');

const plainPassword = "NewAdminPass123!";
const saltRounds = 10;

bcrypt.hash(plainPassword, saltRounds)
  .then(hash => {
    console.log("Generated hash:", hash);
    process.exit(0);
  })
  .catch(err => {
    console.error("Error generating hash:", err);
    process.exit(1);
  });