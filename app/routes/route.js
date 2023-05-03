const router = require('express').Router();
const { product, category, brand } = require('../controllers');

// PRODUCT ROIUTES
router.get('/products', product.findAll);
router.get('/products/page/:page', product.findAllPaginate);
router.get('/products/:id', product.findOne);
// need auth admin
router.post('/products', product.create);
router.delete('/products/:id', product.delete);
// need auth user or admin
router.put('/products/:id', product.update);

// CATEGORY ROUTES
router.get('/categories', category.findAll);
router.get('/categories/:id', category.findOne);
// need auth admin
router.post('/categories', category.create);
router.delete('/categories/:id', category.delete);
// need auth user or admin
router.put('/categories/:id', category.update);

// BRAND ROUTES
router.get('/brands', brand.findAll);
router.get('/brands/:id', brand.findOne);
// need auth admin
router.post('/brands', brand.create);
router.delete('/brands/:id', brand.delete);
// need auth user or admin
router.put('/brands/:id', brand.update);

module.exports = router;