const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
global.atob = require("atob");
global.Blob = require('node-blob');
const { Chef } = require('../models/chef');
const { Etudiant } = require('../models/etudiant');
const { isValidObjectId } = require('mongoose');


let filename1 = [];
///secret key
const JWT_SECRET = "htkspp678H5LLM09876BVG34HJ";







exports.createChef=  async (req, res) => {
    try {
      let obj = req.body;
      let chef = new Chef(obj);
  
  
      let findEmailInEtudiant = await Etudiant.findOne({ email: chef.email })
      let findEmailInChef = await Chef.findOne({ email: chef.email })
  
  
      if (!findEmailInEtudiant && !findEmailInChef) {
  
        try {
          const salt = bcrypt.genSaltSync(10);
          // now we set user password to hashed password
          chef.password = bcrypt.hashSync(chef.password, salt);
  
          filename1[0] ? chef.photo = filename1[0] : chef.photo = 'default.png';
          chef.account_state = true;
          chef.archived = false;
          chef.added_date = new Date();
  
  
          let savedchef = await chef.save()
          filename1 = []
  
          if (!savedchef) {
            res.status(404).send('not found')
          } else {
            res.status(200).send(savedchef);
          }
        } catch (error) {
          console.log(error);
          res.status(400).send({ message: "Erreur", error });
        }
  
  
      } else {
        res.status(404).send('email invalid')
      }
  
  
    } catch (error) {
      res.status(400).send({ message: "Erreur", error });
    }
  };

  exports.login =  async (req, res) => {
    try {
      let chefData = req.body
  
      let chef = await Chef.findOne({ email: chefData.email })
      console.log('chef.status:', chef.status);

      if (!chef) {
        res.status(401).send('Invalid Email')
      }
      else if (!chef.status) {
        res.status(404).send('Compte blocké')
      }
      else {
        const validPassword = bcrypt.compareSync(chefData.password, chef.password);
        if (!validPassword) {
          res.status(401).send('Invalid Password')
        } else {
          let payload = { subject: chef }
          let token = jwt.sign(payload, 'secretKey')
          res.status(200).send({ token })
        }
      }
  
    } catch (error) {
      res.status(400).send({ message: "Erreur", error });
    }
  };

  exports.getVerifyToken = async (req, res) => {
    try {
      let id = req.params.id;
      if (!isValidObjectId(id)) {
        return res.status(404).send('not found')
      }
      let chef = await Chef.findOne({ _id: id, archived: false })
      if (!chef) {
        return res.status(404).send({ message: "Not found" })
      }
      else {
        res.status(200).send(chef);
      }
    } catch (error) {
      res.status(400).send({ message: "Erreur", error });
    }
  }


  exports.AllVerifyToken = async (req, res) => {
    try {
      let chefs = await Chef.find({ archived: false })
      res.status(200).send(chefs);
    } catch (error) {
      res.status(400).send({ message: "Erreur", error });
    }
  };
  

  exports.getbygender =  async (req, res) => {
    try {
  
      let genre = req.params.genre;
  
      let chefs = await Chef.find({ archived: false, gender: genre })
      res.status(200).send(chefs);
    } catch (error) {
      console.log(error);
      res.status(400).send({ message: "Erreur", error });
    }
  };


  exports.updatedchef = async (req, res) => {
    try {
      let id = req.params.id;
      let data = req.body
  
      data.password ? data.password = bcrypt.hashSync(data.password, bcrypt.genSaltSync(10)) : delete data.password
  
      let updatedchef = await Chef.findByIdAndUpdate({ _id: id }, data, { new: true })
  
      if (!updatedchef) {
        return res.status(404).send({ message: "Not found" })
      } else {
        let payload = { subject: updatedchef }
        let token = jwt.sign(payload, 'secretKey')
        return res.status(200).send({ token });
      }
  
    } catch (error) {
      console.log(error);
      res.status(400).send({ message: "Erreur", error });
    }
  };

  exports.updatephoto =  async (req, res) => {

    try {
      let id = req.params.id;
  
      let updated = await Chef.findByIdAndUpdate({ _id: id }, { $set: { photo: filename1[0] } })
  
      if (!updated) {
        res.status(404).send('Admin not found')
      } else {
        filename1 = [];
        res.status(200).send(updated);
      }
  
    } catch (error) {
      res.status(400).send({ message: "Erreur", error });
    }
  };

  exports.deleteById =  async (req, res) => {
    try {
      let id = req.params.id;
  
      let chef = await Chef.findByIdAndDelete({ _id: id })
      if (!chef) {
        res.status(404).send({ message: "Not found" })
      }
      else {
        res.status(200).send(chef);
      }
    } catch (error) {
      res.status(400).send({ message: "Erreur", error });
    }
  };






  exports.lockunlock = async (req, res) => {
    try {
      let id = req.params.id;
      let lock = req.body;
  
      let updatedForms = await Chef
        .findByIdAndUpdate({ _id: id }, { $set: { account_state: lock.lock } })
      if (!updatedForms) {
        res.status(404).send({ message: "Not found" })
      } else {
        res.status(200).send(updatedForms);
      }
    } catch (error) {
      res.status(400).send({ message: "Erreur", error });
    }
  };





