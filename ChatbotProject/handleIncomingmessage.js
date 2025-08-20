const axios = require("axios");
const { enviarMensajeConBotones, enviarMensajeTexto } = require("./whatsappTemplates");

const API_URL = "http://localhost/ChatbotProject/ajax/Apis/candidate.php";

async function getFlowFromDatabase(keyword) {
  try {
    const params = new URLSearchParams({
      action: "getFlow",
      keyword: String(keyword || "").toLowerCase(),
    });

    const response = await axios.post(API_URL, params.toString(), {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      timeout: 8000,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error al obtener flujo desde la base de datos:",
      error?.response?.data || error?.message || String(error)
    );
    return null;
  }
}

// Extrae el texto que escribió el usuario (texto o botón)
function extractIncomingText(message) {
  if (!message) return "";

  // Caso 1: texto normal
  if (message.type === "text") {
    return String(message.text?.body || "").trim();
  }

  // Caso 2: interactive button reply
  if (message.type === "interactive") {
    const t = message.interactive?.type;
    if (t === "button") {
      const title = message.interactive?.button_reply?.title;
      if (title) return String(title).trim();
    }
    // si algún día usas listas:
    if (t === "list") {
      const title = message.interactive?.list_reply?.title;
      if (title) return String(title).trim();
    }
  }

  // Caso 3 (algunos proveedores reportan "button")
  if (message.type === "button") {
    return String(message.button?.text || "").trim();
  }

  return "";
}

async function handleIncomingMessage(payload /*, sendMessage no se usa */) {
  const firstEntry = payload?.entry?.[0];
  const firstChange = firstEntry?.changes?.[0];
  const firstMessage = firstChange?.value?.messages?.[0];
  if (!firstMessage) return;

  const from = firstMessage.from;
  const bodyRaw = extractIncomingText(firstMessage);
  const body = bodyRaw.toLowerCase();

  console.log("Mensaje recibido:", bodyRaw);

  const flow = await getFlowFromDatabase(body);
  console.log("Flujo obtenido:", flow);

  if (!flow || !flow.respuesta || !String(flow.respuesta).trim()) {
    await enviarMensajeTexto(from, "No entendí tu mensaje. Por favor, responde usando las opciones.");
    return;
  }

  const tipo = String(flow.tipo_respuesta || "texto").toLowerCase();

  if (tipo === "botones") {
    let buttons = [];
    try {
      const parsed = JSON.parse(flow.botones || "[]");
      buttons = Array.isArray(parsed) ? parsed : [];
    } catch {
      buttons = [];
    }

    // Nota: tu BD puede tener botones como [{id,title}] o [{body}]
    // enviarMensajeConBotones normaliza ambos formatos.
    await enviarMensajeConBotones(from, flow.respuesta, buttons);
  } else {
    await enviarMensajeTexto(from, flow.respuesta);
  }
}

module.exports = handleIncomingMessage;
