const CategoryController = require('../controllers/category');
const express = require('express');
const router = express.Router();

router.get('/get-category-with-prefix/:prefix', CategoryController.getCategoryWithPrefix);

module.exports = router;