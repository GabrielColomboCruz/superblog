//Version 1.0.3
const mysql = require('mysql2/promise');
const envConfig = require('../config/envConfig');
envConfig(); 

const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

async function operator(operation, username, newUsername, password, money, email) {
  // Operation-specific validation
  if (['update'].includes(operation) && !newUsername) {
    throw new Error('New username must be provided for create and update operations.');
  }
  
  try {
    const sqlMap = {
      create: "INSERT INTO `player` (`username`, `password`, `money`, `email`) VALUES (?, ?, ?, ?);",
      read: "SELECT * FROM `player` WHERE `username` = ?;",
      update: "UPDATE `player` SET `username` = ?, `password` = ?, `money` = ?, `email` = ? WHERE `username` = ?;",
      delete: "DELETE FROM `player` WHERE `username` = ?;"
    };

    if (!sqlMap[operation]) throw new Error('Invalid operation type');
    
    let sql = sqlMap[operation];
    let values;

    // Replace undefined values with null
    const sanitizeValue = (value) => (value === undefined ? null : value);

    switch (operation) {
      case 'create':
        values = [
          sanitizeValue(username),
          sanitizeValue(password),
          sanitizeValue(money),
          sanitizeValue(email)
        ];
        break;
      case 'read':
        values = [sanitizeValue(username)];
        break;
      case 'update':
        values = [
          sanitizeValue(newUsername),
          sanitizeValue(password),
          sanitizeValue(money),
          sanitizeValue(email),
          sanitizeValue(username)
        ];
        break;
      case 'delete':
        values = [sanitizeValue(username)];
        break;
    }

    // Execute query
    const [result] = await pool.execute(sql, values);
    console.log(`${operation} operation successful.`);
    return result;
  } catch (error) {
    console.error(`Error executing ${operation} operation:`, error.message);
    throw error;
  } 
}

module.exports = operator;
