const express = require('express');
const multer = require('multer');

global.atob = require("atob");
global.Blob = require('node-blob');

const { verifyToken } = require('../middlewares/verifyToken');
const chefController=require('../controllers/chefController')


let filename1 = [];
///secret key

const router = express.Router();

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


router.post('/', upload.any('image'), chefController.createChef);

router.post('/login', chefController.login);

router.get('/:id',verifyToken, chefController.getVerifyToken);

router.get('/',verifyToken, chefController.AllVerifyToken);

router.put('/:id',verifyToken, chefController.updatedchef);

router.put('/updatephoto/:id', upload.any('image'), chefController.updatephoto);

router.delete('/:id', verifyToken, chefController.deleteById);

router.put('/lockunlock/:id', verifyToken, chefController.lockunlock);




module.exports = router;