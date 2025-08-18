const router = require('express').Router();
const { getFeatures } = require('../controllers/featuresController');
router.get('/', getFeatures);
module.exports = router;