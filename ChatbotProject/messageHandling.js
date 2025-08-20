const mysql = require("mysql2/promise");
const { enviarMensajeConBotones, enviarMensajeTexto } = require("./whatsappTemplates");

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "chatbot2",
  port: 2302,
};

const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function getFlowFromDatabase(keyword) {
  const kw = String(keyword || "").trim().toLowerCase();
  if (!kw) return null;

  const sql1 = `
    SELECT tipo_respuesta, respuesta, botones
    FROM flows
    WHERE LOWER(keyword) = ?
    LIMIT 1
  `;
  const [rows1] = await pool.query(sql1, [kw]);
  if (rows1.length > 0) return rows1[0];

  // 2) Fallback: LIKE por si mandas frases más largas (ej. "hola buenos días")
  const sql2 = `
    SELECT tipo_respuesta, respuesta, botones
    FROM flows
    WHERE ? LIKE CONCAT('%', LOWER(keyword), '%')
    ORDER BY CHAR_LENGTH(keyword) DESC
    LIMIT 1
  `;
  const [rows2] = await pool.query(sql2, [kw]);
  if (rows2.length > 0) return rows2[0];

  return null;
}

// === Handler principal ===
async function handleIncomingMessage(payload, sendMessage) {
  const firstEntry = payload.entry?.[0];
  const firstChange = firstEntry?.changes?.[0];
  const firstMessage = firstChange?.value?.messages?.[0];
  if (!firstMessage) return;

  const from = firstMessage.from;
  let body = "";

  if (firstMessage.type === "text") {
    body = firstMessage.text?.body?.toLowerCase() || "";
  } else if (firstMessage.type === "button" || firstMessage.type === "interactive") {
    body =
      firstMessage.button?.text ||
      firstMessage.interactive?.button_reply?.title ||
      "";
  }

  console.log("Mensaje recibido:", body);

  let flow = null;
  try {
    flow = await getFlowFromDatabase(body);
    console.log("Flujo obtenido:", flow);
  } catch (e) {
    console.error("Error DB getFlow:", e);
  }

  // Si no hay flujo o la respuesta está vacía
  if (!flow || !flow.respuesta || !String(flow.respuesta).trim()) {
    await sendMessage(
      from,
      "No entendí tu mensaje. Por favor, responde usando las opciones."
    );
    return;
  }

  // Enviar según tipo
  if (String(flow.tipo_respuesta).toLowerCase() === "botones") {
    let buttons = [];
    try {
      buttons = JSON.parse(flow.botones || "[]");
      if (!Array.isArray(buttons)) buttons = [];
    } catch {
      buttons = [];
    }

    if (buttons.length === 0) {
      // Si la DB dijo "botones" pero no hay botones válidos
      await enviarMensajeTexto(from, flow.respuesta);
    } else {
      await enviarMensajeConBotones(from, flow.respuesta, buttons);
    }
  } else {
    await enviarMensajeTexto(from, flow.respuesta);
  }
}

module.exports = handleIncomingMessage;
