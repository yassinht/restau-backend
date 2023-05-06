
const asyncHandler = require('express-async-handler');

const bcrypt = require("bcrypt");
const multer = require('multer');
const jwt = require('jsonwebtoken');
global.atob = require("atob");
global.Blob = require('node-blob');
const { Etudiant } = require('../models/etudiant');
const { isValidObjectId } = require('mongoose');


let filename1 = [];
///secret key
const JWT_SECRET = "htkspp678H5LLM09876BVG34HJ";


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



exports.createEtudiant=   async (req, res) => {
    try {
      let obj = req.body;
      let etudiant = new Etudiant(obj);
  
  
      let findEmailInEtudiant = await Etudiant.findOne({ email: etudiant.email })
  
  
      if (!findEmailInEtudiant ) {
  
        try {
          const salt = bcrypt.genSaltSync(10);
          // now we set user password to hashed password
          etudiant.password = bcrypt.hashSync(etudiant.password, salt);
  
          filename1[0] ? etudiant.photo = filename1[0] : etudiant.photo = 'default.png';
  
  
          let savedetudiant = await etudiant.save()
          filename1 = []
  
          if (!savedetudiant) {
            return res.status(404).send('not found')
          } else {
            return res.status(200).send(savedetudiant);
          }
        } catch (error) {
          return res.status(400).send({ message: "Erreur", error });
        }
  
  
      } else {
        return res.status(404).send('email invalid')
      }
  
  
    } catch (error) {
      return res.status(400).send({ message: "Erreur", error });
    }
  };

  exports.login =async (req, res) => {

    try {
      let etudiantData = req.body
  
      let etudiant = await Etudiant.findOne({ email: etudiantData.email })
  
      if (!etudiant) {
        return res.status(404).send('Invalid Email')
      } else {
  
        const validPassword = bcrypt.compareSync(etudiantData.password, etudiant.password);
        console.log(validPassword)
  
        if (!validPassword) {
          res.status(404).send('Invalid Password')
          console.log(validPassword,etudiantData.password, etudiant.password)
        } else {
          let payload = { subject: etudiant }
          let token = jwt.sign(payload, 'secretKey')
          return res.status(200).send({ token })
        }
      }
  
    } catch (error) {
      res.status(400).send({ message: "Erreur", error });
    }
  
  };


  exports.getEtudiantById =  async (req, res) => {
    try {
      let id = req.params.id;
      if (!isValidObjectId(id)) {
        return res.status(404).send('not found')
      }
      let etudiant = await Etudiant.findOne({ _id: id, archived: false })
  
      if (!etudiant) {
        res.status(404).send('not found')
      } else {
        res.status(200).send(etudiant);
      }
    } catch (error) {
      res.status(400).send({ message: "Erreur", error });
    }
  };

  exports.updatephoto =  async (req, res) => {

    try {
      let id = req.params.id;
  
      let updated = await Etudiant.findByIdAndUpdate({ _id: id }, { $set: { photo: filename1[0] } })
  
      if (!updated) {
        res.status(404).send('Etudiant not found')
      } else {
        filename1 = [];
        res.status(200).send(updated);
      }
  
    } catch (error) {
      res.status(400).send({ message: "Erreur", error });
    }
  
  
  };

  exports.GetAllEtudiants = async (req, res) => {
    try {
      let etudiants = await Etudiant.find({ archived: false })
      res.status(200).send(etudiants);
    } catch (error) {
      res.status(400).send({ message: "Erreur", error });
    }
  };

  exports.getbygender =  async (req, res) => {
    try {
  
      let genre = req.params.genre;
  
      let etudiants = await Etudiant.find({ archived: false, gender: genre })
      res.status(200).send(etudiants);
    } catch (error) {
      console.log(error);
      res.status(400).send({ message: "Erreur", error });
    }
  };

  exports.updatedetudiant = async (req, res) => {
    try {
      let id = req.params.id;
      let data = req.body
  
      data.password ? data.password = bcrypt.hashSync(data.password, bcrypt.genSaltSync(10)) : delete data.password
  
      let updatedetudiant = await Etudiant.findByIdAndUpdate({ _id: id }, data, { new: true })
  
      if (!updatedetudiant) {
        res.status(404).send('not found')
      } else {
        let payload = { subject: updatedetudiant }
        let token = jwt.sign(payload, 'secretKey')
        res.status(200).send({ token });
      }
  
    } catch (error) {
      res.status(400).send({ message: "Erreur", error });
    }
  };

  exports.deleteById =   async (req, res) => {
    try {
      let id = req.params.id;
  
      let etudiant = await Etudiant.findByIdAndDelete({ _id: id })
  
      if (!etudiant) {
        res.status(404).send('not found')
      } else {
        res.status(200).send(etudiant);
      }
    } catch (error) {
      res.status(400).send({ message: "Erreur", error });
    }
  };
  
  exports.archivedById =  async (req, res) => {
    try {
      let id = req.params.id;
  
      let updatedForms = await Etudiant.findByIdAndUpdate({ _id: id }, { $set: { archived: true } })
  
      if (!updatedForms) {
        res.status(404).send('not found')
      } else {
        res.status(200).send(updatedForms);
      }
  
    } catch (error) {
      res.status(400).send({ message: "Erreur", error });
    }
  };

  exports.restorerById =  async (req, res) => {
    try {
      let id = req.params.id;
  
      let updatedForms = await Etudiant.findByIdAndUpdate({ _id: id }, { $set: { archived: false } })
  
      if (!updatedForms) {
        res.status(404).send('not found')
      } else {
        res.status(200).send(updatedForms);
      }
  
    } catch (error) {
      res.status(400).send({ message: "Erreur", error });
    }
  };



  exports.lockunlock =  async (req, res) => {

    try {
      let id = req.params.id;
      let lock = req.body;
  
      let updatedForms = await Etudiant.findByIdAndUpdate({ _id: id }, { $set: { account_state: lock.lock } })
  
      if (!updatedForms) {
        res.status(404).send('not found')
      } else {
        res.status(200).send(updatedForms);
      }
    } catch (error) {
      res.status(400).send({ message: "Erreur", error });
    }
  };



