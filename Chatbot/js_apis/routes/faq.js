const router = require('express').Router();
const { getFaq } = require('../controllers/faqController');
router.get('/', getFaq);
module.exports = router;