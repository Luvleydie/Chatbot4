const router = require('express').Router();
const { handleStep } = require('../controllers/chatController');

router.post('/', handleStep);

module.exports = router;