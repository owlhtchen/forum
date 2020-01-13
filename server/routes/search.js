const SearchController = require('../controllers/search');
const express = require('express')
const router = express.Router();

router.get('/:keyword?', SearchController.getSearchResultsWith);

module.exports = router;