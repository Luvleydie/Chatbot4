const axios = require("axios");
const fs = require("fs");
const path = require("path");

const accessToken = "EAARGRzmBFC8BPGw1V9tgXwmgXmNKMueR4etoLzTBINs2ly9zvfbuk0ZAUnX60pRK1ZA3T1fUiZC8jg1HO1gTOZCUtEAiIZCyuegOMRWp8GniSZBME43NnWwGlEOlzY3sxJDqG91G7EA9oyzzoYfqdYEPMZCkAZAsvZCdKWhTWMe3QCE1JJVelGX9InQksfkYhaCpCMOMI9ZA8pHQrvZCjZAFufXHz2tcWU4YZAVRLiw8o3MSBqQZDZD";
const phoneNumberId = "704649766063308"; 

function ensureLogsDir() {
  const logsDir = path.join(__dirname, "logs");
  if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });
  return path.join(logsDir, "message_log.txt");
}

function procesarNumero(to) {
  if (!to) throw new Error("Número de destinatario no válido");
  let n = String(to).trim();
  n = n.replace(/[^\d]/g, "");
  if (n.startsWith("521")) n = n.replace(/^521/, "52");
  return n;
}

function logExitoso(payload, responseData) {
  const logPath = ensureLogsDir();
  const logMessage = `${new Date().toISOString()} - Enviado: ${JSON.stringify(payload)}\nRespuesta: ${JSON.stringify(responseData)}\n`;
  fs.appendFileSync(logPath, logMessage);
  console.log("Mensaje enviado exitosamente:", responseData);
}

function logError(payload, error) {
  const logPath = ensureLogsDir();
  const errorData = error?.response?.data || { message: error?.message || String(error) };
  const logMessage = `${new Date().toISOString()} - Error enviando: ${JSON.stringify(payload)}\nError: ${JSON.stringify(errorData)}\n`;
  fs.appendFileSync(logPath, logMessage);
  console.error("Error enviando mensaje:", errorData);
}

function slugifyId(s, i) {
  return (
    String(s || `btn_${i + 1}`)
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "") || `btn_${i + 1}`
  ).slice(0, 256);
}

function normalizeButtons(input) {
  const arr = Array.isArray(input) ? input : [];
  const norm = arr
    .map((b, i) => {
      const titleRaw = b?.title ?? b?.body ?? "";
      const title = String(titleRaw).trim().slice(0, 20); // WhatsApp: máx 20 chars
      if (!title) return null;
      const id = String(b?.id ?? slugifyId(title, i));
      return { id, title };
    })
    .filter(Boolean);

  return norm.slice(0, 3);
}

async function enviarMensajeTexto(to, text) {
  const body = String(text ?? "").trim();
  if (!body) {
    console.error("El mensaje de texto está vacío. No se puede enviar.");
    return;
  }

  const url = `https://graph.facebook.com/v22.0/${phoneNumberId}/messages`;
  const payload = {
    messaging_product: "whatsapp",
    to: procesarNumero(to),
    type: "text",
    text: { body },
  };
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };

  try {
    const response = await axios.post(url, payload, { headers });
    logExitoso(payload, response.data);
    return response.data;
  } catch (error) {
    logError(payload, error);
    throw error;
  }
}

async function enviarMensajeConBotones(to, text, buttonsFromDB) {
  const buttons = normalizeButtons(buttonsFromDB);
  if (buttons.length === 0) {
    return enviarMensajeTexto(to, text);
  }

  const url = `https://graph.facebook.com/v22.0/${phoneNumberId}/messages`;
  const payload = {
    messaging_product: "whatsapp",
    to: procesarNumero(to),
    type: "interactive",
    interactive: {
      type: "button",
      body: { text: String(text ?? "").slice(0, 1024) }, // máx 1024 chars
      action: {
        buttons: buttons.map((b) => ({
          type: "reply",
          reply: { id: b.id, title: b.title }, // <- obligatorio
        })),
      },
    },
  };
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };

  console.log("PAYLOAD INTERACTIVE:", JSON.stringify(payload, null, 2));

  try {
    const response = await axios.post(url, payload, { headers });
    logExitoso(payload, response.data);
    return response.data;
  } catch (error) {
    logError(payload, error);
    throw error;
  }
}

if (require.main === module) {
  const mensaje = "Hola, este es un mensaje de prueba.";
  if (!mensaje || mensaje.trim() === "") {
    console.error("El mensaje está vacío.");
  } else {
    enviarMensajeTexto("5216181177004", mensaje).catch(() => {});
  }
}

module.exports = {
  enviarMensajeTexto,
  enviarMensajeConBotones,
};
