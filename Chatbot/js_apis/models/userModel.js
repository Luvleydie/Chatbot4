const db = require('../config/db');

async function saveUser(data) {
  const sql = `INSERT INTO users 
    (name, age, owns_home, knows_manual, can_deposit, has_garage, interview_time)
    VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const params = [data.name, data.age, data.owns_home, data.knows_manual, data.can_deposit, data.has_garage, data.interview_time];
  const [result] = await db.execute(sql, params);
  return result.insertId;
}

module.exports = { saveUser };