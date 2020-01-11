const multer = require('multer');
const express = require('express');
const router = express.Router();
const path = require('path');
const uuidv4 = require('uuid/v4');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/avatars')
  },
  filename: function (req, file, cb) {
    console.log(file);
    cb(null, uuidv4() + path.extname(file.originalname))
  }
})

var upload = multer({ storage: storage });

router.post('/avatar', upload.single('userAvatar'), function (req, res, next) {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
  console.log(req.file);
  console.log(req.file.name);
})


module.exports = router;