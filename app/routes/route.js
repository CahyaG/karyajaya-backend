const router = require('express').Router();
const { product } = require('../controllers');

router.get('/products', product.findAll);
router.get('/products/page/:page', product.findAllPaginate);
router.get('/products/:id', product.findOne);
// need auth admin
router.post('/products', product.create);
router.delete('/products/:id', product.delete);
// need auth user or admin
router.put('/products/:id', product.update);

module.exports = router;