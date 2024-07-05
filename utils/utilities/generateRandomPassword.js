const bcrypt = require('bcryptjs');
const crypto = require('crypto');

async function generateRandomPassword() {
  // Generate a random password
  const randomPassword = crypto.randomBytes(8).toString('hex'); // 16 characters long

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(randomPassword, salt);

  return { randomPassword, hashedPassword };
}

module.exports = generateRandomPassword;
