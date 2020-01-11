const multer = require('multer');
const express = require('express');
const router = express.Router();
const path = require('path');
const uuidv4 = require('uuid/v4');
const User = require('../models/user');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/avatars')
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + path.extname(file.originalname))
  }
})

var upload = multer({ storage: storage });

router.post('/avatar', upload.single('userAvatar'), async (req, res, next) => {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
  // console.log(req.file.filename);
  await User.updateMany({
    _id: req.body.userID
  }, {
    avatarFile: req.file.filename
  });
  res.end();
})


module.exports = router;