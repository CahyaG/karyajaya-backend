const router = require('express').Router();
const { catalog } = require('../controllers');

router.get('/', catalog.findAllProduct);

module.exports = router;