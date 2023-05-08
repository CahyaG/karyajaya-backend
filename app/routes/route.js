const router = require('express').Router();
const { product, category, brand, user, refreshToken, penjualan } = require('../controllers');
const { verifyToken } = require("../middlewares/verifyToken.js");

// PRODUCT ROIUTES
router.get('/products', product.findAll);
router.get('/products/page/:page', product.findAllPaginate);
router.get('/products/:id', product.findOne);
// need auth admin
router.post('/products', verifyToken, product.create);
router.delete('/products/:id', verifyToken, product.delete);
router.put('/products/:id', verifyToken, product.update);
router.post('/products/:id/images', verifyToken, product.createImage);
router.delete('/products/:id/images/:image_id', verifyToken, product.deleteImage);

// CATEGORY ROUTES
router.get('/categories', category.findAll);
router.get('/categories/page/:page', category.findAllPaginate);
router.get('/categories/:id', category.findOne);
// need auth admin
router.post('/categories', verifyToken, category.create);
router.delete('/categories/:id', verifyToken, category.delete);
router.put('/categories/:id', verifyToken, category.update);

// BRAND ROUTES
router.get('/brands', brand.findAll);
router.get('/brands/page/:page', brand.findAllPaginate);
router.get('/brands/:id', brand.findOne);
// need auth admin
router.post('/brands', verifyToken, brand.create);
router.delete('/brands/:id', verifyToken, brand.delete);
router.put('/brands/:id', verifyToken, brand.update);

// PENJUALAN ROUTES
router.get('/penjualan', penjualan.findAll);
router.get('/penjualan/page/:page', penjualan.findAllPaginate);
router.get('/penjualan/:id', penjualan.findOne);
// need auth admin
router.post('/penjualan', verifyToken, penjualan.create);
router.delete('/penjualan/:id', verifyToken, penjualan.delete);
router.put('/penjualan/:id', verifyToken, penjualan.update);

// AUTH ROUTES
router.post('/login', user.login);
router.post('/register', user.register);
router.delete('/logout', user.logout);
router.get('/token', refreshToken.refreshToken);

module.exports = router;