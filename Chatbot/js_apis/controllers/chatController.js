const { saveUser } = require('../models/userModel');

let session = {};

exports.handleStep = async (req, res) => {
  const { step, answer } = req.body;
  try {
    switch(step) {
      case 'ask_name':
        return res.json({ ok: true, question: '¿Cuál es tu nombre?' });

      case 'ask_age':
        session.name = answer;
        return res.json({ ok: true, question: '¿Cuál es tu edad?' });

      case 'check_age':
        const age = parseInt(answer, 10);
        if (age < 22) return res.json({ ok:false, message:'Edad mínima 22 años.' });
        session.age = age;
        return res.json({ ok:true, question:'¿Tienes casa propia a tu nombre? (si/no)' });

      case 'check_home':
        if (answer !== 'si') return res.json({ ok:false, message:'Requisito: casa propia.' });
        session.owns_home = 1;
        return res.json({ ok:true, question:'¿Sabes manejar auto estándar? (si/no)' });

      case 'check_manual':
        if (answer !== 'si') return res.json({ ok:false, message:'Requisito: manejo estándar.' });
        session.knows_manual = 1;
        return res.json({ ok:true, question:'¿Puedes cubrir depósito de $3000 MXN? (si/no)' });

      case 'check_deposit':
        if (answer !== 'si') return res.json({ ok:false, message:'Depósito inicial no cubierto.' });
        session.can_deposit = 1;
        return res.json({ ok:true, question:'¿Tienes cochera propia techada? (si/no)' });

      case 'check_garage':
        if (answer !== 'si') return res.json({ ok:false, message:'Se requiere cochera techada.' });
        session.has_garage = 1;
        return res.json({ ok:true, message:'Agendemos tu entrevista: L-V 18:00-21:00.', ready_schedule:true });

      case 'schedule':
        session.interview_time = answer;
        const id = await saveUser(session);
        session = {};
        return res.json({ ok:true, message:`Entrevista agendada para ${answer}. ID:${id}` });

      default:
        return res.status(400).json({ ok:false, message:'Paso inválido.' });
    }
  } catch(err) {
    console.error(err);
    return res.status(500).json({ ok:false, message:'Error interno.' });
  }
};