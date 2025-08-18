const db = require('../config/db');

exports.saveContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) return res.status(400).json({ ok:false, message:'Campos incompletos.' });
    const sql = 'INSERT INTO contacts (name,email,message) VALUES(?,?,?)';
    await db.execute(sql, [name,email,message]);
    res.json({ ok:true, message:'Mensaje recibido, gracias por contactarnos.' });
  } catch(err) {
    console.error(err);
    res.status(500).json({ ok:false, message:'Error guardando contacto.' });
  }
};