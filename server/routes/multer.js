const multer = require('multer');
const express = require('express');
const router = express.Router();
const path = require('path');
// const uuidv4 = require('uuid/v4');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const fs = require('fs');
const User = require('../models/user');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if(process.env.NODE_ENV === "dev") {
            cb(null, './client/public/avatars');
        } else {
            cb(null, '../client/public/avatars');
        }
    },
    filename: function (req, file, cb) {
        // cb(null, uuidv4() + path.extname(file.originalname))
        cb(null, "IMAGE_" + Date.now() + "_" + file.originalname);
    }
})

var upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
}).single('userAvatar');

router.post('/avatar', upload, async (req, res, next) => {
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
    const avatarName = uuidv4() + path.extname(req.file.originalname);
    const { userID } = req.body;
    const user = await User.findById(userID);
    if(user && user.avatarFile && !user.avatarFile.startsWith("default_")) {
        fs.unlinkSync(path.resolve(req.file.destination, user.avatarFile));
    }
    await sharp(req.file.path)
        .resize(300, 300)
        .toFile(
            path.resolve(req.file.destination, avatarName)
        );
    fs.unlinkSync(req.file.path);
    await User.updateMany({
        _id: userID
    }, {
        avatarFile: avatarName
    });
    res.end();
})


module.exports = router;