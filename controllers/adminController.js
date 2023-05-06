const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
global.atob = require("atob");
global.Blob = require('node-blob');

const { Admin } = require('../models/admin');



exports.createAdmin = async (req, res) => {
  try {
    const obj = req.body;
    const admin = new Admin(obj);

    const findAdmin = await Admin.findOne({ email: admin.email });

    if (!findAdmin) {
      try {
        const salt = bcrypt.genSaltSync(10);
        // now we set admin password to hashed password
        admin.password = bcrypt.hashSync(admin.password, salt);

        admin.photo = req.files && req.files.length ? req.files[0].filename : 'default.png';
        admin.account_state = true;
        admin.archived = false;
        admin.role = 'admin';
        admin.added_date = new Date();

        const savedAdmin = await admin.save();

        if (!savedAdmin) {
          return res.status(404).send('not found');
        } else {
          return res.status(200).send(savedAdmin);
        }
      } catch (error) {
        return res.status(400).send({ message: 'Erreur', error });
      }
    } else {
      return res.status(404).send('email invalid');
    }
  } catch (error) {
    return res.status(400).send({ message: 'Erreur', error });
  }
};


  exports.login =async (req, res) => {

    try {
      let adminData = req.body
  
      let admin = await Admin.findOne({ email: adminData.email })
  
      if (!admin) {
        return res.status(404).send('Invalid Email')
      } else {
  
        const validPassword = bcrypt.compareSync(adminData.password, admin.password);
        console.log(validPassword)
  
        if (!validPassword) {
          res.status(404).send('Invalid Password')
          console.log(validPassword,adminData.password, admin.password)
        } else {
          let payload = { subject: admin }
          let token = jwt.sign(payload, 'secretKey')
          return res.status(200).send({ token })
        }
      }
  
    } catch (error) {
      res.status(400).send({ message: "Erreur", error });
    }
  
  };



