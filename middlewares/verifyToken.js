
const { Admin } =  require('../models/admin');
const { Etudiant } = require("../models/etudiant");
const { Chef } = require("../models/chef");

const jwtDecode = (token) => {
    if (token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } else return null
}
const getUserData = (token) => {
    let decoded = jwtDecode(token);
    if (decoded) {
        return decoded.subject;
    } else return null
}
module.exports = {
    getUserData,
    verifyToken: async (req, res, next) => {
        if (!req.headers.authorization) {
            return res.status(401).send('Unauthorized request')
        }
        let token = req.headers.authorization.split(' ')[1]
        if (!token) {
            return res.status(401).send('Unauthorized request')
        }
        let userData = getUserData(token);
        if (userData) {
            let etudiant = await Etudiant.findOne({ _id: userData._id, email: userData.email, password: userData.password });
            let chef = await Chef.findOne({ _id: userData._id, email: userData.email, password: userData.password });
            let admin = await Admin.findOne({ _id: userData._id, email: userData.email, password: userData.password });
            if (!etudiant && !chef && !admin) {
                res.status(401).send('Unauthorized request')
            } else {
                next()
            }
        } else {
            res.status(401).send('Unauthorized request')
        }
    },
    verifyAdminToken: async (req, res, next) => {
        try {
            let admin;
            if (!req.headers.authorization) {
                console.log(1);
                return res.status(401).send('Unauthorized request')
            }
            let token = req.headers.authorization.split(' ')[1]
            if (!token) {
                console.log(2);
                return res.status(401).send('Unauthorized request')
            }
            let userData = getUserData(token);
            if (userData) {
                admin = await Admin.findOne({ _id: userData._id, email: userData.email, password: userData.password });
                if (!admin) {
                    console.log(2);
                    res.status(401).send('Unauthorized request')
                } else {
                    next()
                }
            } else {
                console.log(3);
                res.status(401).send('Unauthorized request')
            }
        } catch (error) {
            console.log(error);
            res.status(401).send('Unauthorized request')
        }
    },
  
    
}