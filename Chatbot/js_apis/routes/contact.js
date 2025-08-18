const router = require('express').Router();
const { saveContact } = require('../controllers/contactController');
router.post('/', saveContact);
module.exports = router;