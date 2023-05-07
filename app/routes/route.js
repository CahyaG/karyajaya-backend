const router = require('express').Router();
const { product, category, brand, user, refreshToken, peminjaman } = require('../controllers');
const verifyToken = require("../middlewares/verifyToken.js");

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

// AUTH ROUTES
router.post('/login', user.login);
router.post('/register', user.register);
router.delete('/logout', user.logout);
router.get('/token', refreshToken.refreshToken);

// PEMINJAMAN ROUTES (need auth)
router.get('/peminjaman', peminjaman.findAll);
router.get('/peminjaman/:id', peminjaman.findOne);
router.post('/peminjaman', peminjaman.create);
router.delete('/peminjaman/:id', peminjaman.delete);
router.put('/peminjaman/:id', peminjaman.update);


module.exports = router;