const router = require('express').Router();
const { product, category, brand, user, refreshToken, peminjaman, penjualan } = require('../controllers');
const verifyToken = require("../middlewares/verifyToken.js");

// PRODUCT ROIUTES
router.get('/products', product.findAll);
router.get('/products/page/:page', product.findAllPaginate);
router.get('/products/:id', product.findOne);
// need auth admin
router.post('/products', verifyToken.verifyToken, product.create);
router.delete('/products/:id', verifyToken.verifyToken, product.delete);
router.put('/products/:id', verifyToken.verifyToken, product.update);
router.post('/products/:id/images', verifyToken.verifyToken, product.createImage);
router.delete('/products/:id/images/:image_id', verifyToken.verifyToken, product.deleteImage);

// CATEGORY ROUTES
router.get('/categories', category.findAll);
router.get('/categories/page/:page', category.findAllPaginate);
router.get('/categories/:id', category.findOne);
// need auth admin
router.post('/categories', verifyToken.verifyToken, category.create);
router.delete('/categories/:id', verifyToken.verifyToken, category.delete);
router.put('/categories/:id', verifyToken.verifyToken, category.update);

// BRAND ROUTES
router.get('/brands', brand.findAll);
router.get('/brands/page/:page', brand.findAllPaginate);
router.get('/brands/:id', brand.findOne);
// need auth admin
router.post('/brands', verifyToken.verifyToken, brand.create);
router.delete('/brands/:id', verifyToken.verifyToken, brand.delete);
router.put('/brands/:id', verifyToken.verifyToken, brand.update);

// PENJUALAN ROUTES
router.get('/penjualan', penjualan.findAll);
router.get('/penjualan/page/:page', penjualan.findAllPaginate);
router.get('/penjualan/:id', penjualan.findOne);
// need auth admin
router.post('/penjualan', verifyToken.verifyToken, penjualan.create);
router.delete('/penjualan/:id', verifyToken.verifyToken, penjualan.delete);
router.put('/penjualan/:id', verifyToken.verifyToken, penjualan.update);

// // AUTH ROUTES
router.post('/login', user.login);
router.post('/register', user.register);
router.delete('/logout', user.logout);
router.get('/token', refreshToken.refreshToken);

// PEMINJAMAN ROUTES (need auth)
router.get('/peminjaman', peminjaman.findAll);
router.get('/peminjaman/:id', peminjaman.findOne);
router.post('/peminjaman', verifyToken.verifyToken, peminjaman.create);
router.delete('/peminjaman/:id', verifyToken.verifyToken, peminjaman.delete);
router.put('/peminjaman/:id', verifyToken.verifyToken, peminjaman.update);

router.get('/verify', verifyToken.verifyToken, user.verifyUser);

router.get('/test', product.test);

module.exports = router;