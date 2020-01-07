const CategoryController = require('../controllers/category');
const express = require('express');
const router = express.Router();

router.get('/all-categories', CategoryController.getAllCategories);
router.post('/add-category', CategoryController.addCategory);

module.exports = router;