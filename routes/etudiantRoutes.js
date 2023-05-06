const express = require('express');
const multer = require('multer');
global.atob = require("atob");
global.Blob = require('node-blob');

const { verifyToken } = require('../middlewares/verifyToken');


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

const etudiantController=require('../controllers/etudiantController')

router.post('/', upload.any('image'), etudiantController.createEtudiant);

router.post('/login', etudiantController.login);

router.get('/:id',verifyToken, etudiantController.getEtudiantById);

router.put('/updatephoto/:id', upload.any('image'), etudiantController.updatephoto);

router.get('/',verifyToken, etudiantController.GetAllEtudiants);

router.get('/getbygender/:genre',verifyToken, etudiantController.getbygender);

router.put('/:id',verifyToken, etudiantController.updatedetudiant);

router.delete('/:id', verifyToken, etudiantController.deleteById);

router.get('/lockunlock/:id', verifyToken, etudiantController.lockunlock);



module.exports = router;
