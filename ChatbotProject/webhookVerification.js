module.exports = function verifyWebhook(req, res) {
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "gato";

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
};
