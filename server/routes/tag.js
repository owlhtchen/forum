const TagController = require('../controllers/tag');
const express = require('express');
const router = express.Router();

router.get('/all-tags', TagController.getAllTags);
router.post('/add-tag', TagController.addTag);
router.get('/tag-by-id/:tagID', TagController.getTagByID);
router.get('/get-tag-name-with-prefix/:prefix?', TagController.getTagNameWithPrefix);

module.exports = router;