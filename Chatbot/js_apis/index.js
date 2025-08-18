const express = require('express');
const bodyParser = require('body-parser');
const chatRoutes     = require('./routes/chat');
const featuresRoutes = require('./routes/features');
const faqRoutes      = require('./routes/faq');
const contactRoutes  = require('./routes/contact');

const app = express();
app.use(bodyParser.json());
app.use('/api/chat', chatRoutes);
app.use('/api/features', featuresRoutes);
app.use('/api/faq', faqRoutes);
app.use('/api/contact', contactRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API Node corriendo en puerto ${PORT}`));