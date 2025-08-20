const express = require("express");
const handleIncomingMessage = require("./messageHandling");
const { enviarMensajeTexto } = require("./whatsappTemplates");

const app = express();
const PORT = process.env.PORT || 3010;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "gato";

app.use(express.json());

app.get("/health", (_req, res) => res.status(200).send("ok"));

app.get("/webhook", (req, res) => {
  try {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    }
    return res.sendStatus(403);
  } catch (err) {
    console.error("Error en GET /webhook:", err);
    return res.sendStatus(500);
  }
});

// Recepción de eventos (POST)
app.post("/webhook", (req, res) => {
  res.sendStatus(200);

  (async () => {
    try {
      const payload = req.body;

      // Conecta con la función real de envío
      const sendMessage = async (to, message) => {
        await enviarMensajeTexto(to, message);
      };

      await handleIncomingMessage(payload, sendMessage);
    } catch (err) {
      console.error("Error en POST /webhook:", err?.response?.data || err);
    }
  })();
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
  console.log(`VERIFY_TOKEN: ${VERIFY_TOKEN}`);
});

enviarMensajeTexto("5216181177004", "Mensaje de prueba desde el servidor")
  .then(() => console.log("Mensaje enviado correctamente"))
  .catch(err => console.error("Error al enviar mensaje:", err));
