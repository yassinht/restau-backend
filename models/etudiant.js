const mongoose = require('mongoose');

const EtudiantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    photo: { type: String, required: true },
    codeInscrit: { type: String },
    tel: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    gender: { type: String, required: true },
    role: { type: Number, required: true },
})
let Etudiant = mongoose.model('etudiant', EtudiantSchema);

module.exports = { Etudiant };