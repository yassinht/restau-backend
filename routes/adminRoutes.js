const express = require('express');
const multer = require('multer');
global.atob = require("atob");
global.Blob = require('node-blob');
const router = express.Router();



let filename1 = [];


const storage = multer.diskStorage(
  {
    destination: './upload',
    filename: function (req, file, cb) {
      date = Date.now();
      cb(null, date + '.' + file.mimetype.split('/')[1]);
      let fl = date + '.' + file.mimetype.split('/')[1];
      filename1.push(fl);
    },
  }
);

const upload = multer({ storage: storage });


const adminController=require('../controllers/adminController')



router.post('/', upload.any('image'), adminController.createAdmin);

router.post('/login', upload.any('image'), adminController.login);

module.exports = router;