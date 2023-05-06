const mongoose = require('mongoose');

const ChefSchema = new mongoose.Schema({
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    photo: { type: String, required: true },
    tel: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    status: { type: Boolean, required: true },
    role: { type: Number, required: true },
})
let Chef = mongoose.model('chef', ChefSchema);

module.exports = { Chef };