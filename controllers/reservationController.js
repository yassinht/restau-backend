const Reservation = require('../models/reservation');
const Menu = require('../models/menu');
const { Etudiant } = require('../models/etudiant');

exports.addReservation = async (req, res) => {
  try {
    const { etudiantId, menuId } = req.body;
    const [etudiant, menu] = await Promise.all([
      Etudiant.findById(etudiantId),
      Menu.findById(menuId),
    ]);
    if (!etudiant || !menu) {
      return res.status(404).json({ message: 'Etudiant or Menu not found' });
    }
    const reservation = await Reservation.create({
      etudiant: etudiant._id,
      menu: menu._id,
    });
    res.json({ reservation });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate('etudiant')
      .populate('menu');
    res.json({ reservations });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findByIdAndDelete(id);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    res.json({ message: 'Reservation deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



exports.getReservationsByStudentId = async (req, res) => {
    try {
      const { id } = req.params;
      const reservations = await Reservation.find({ etudiant: id })
        .populate('etudiant')
        .populate('menu');
      res.json({ reservations });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
  exports.getReservationsByMenuId = async (req, res) => {
    try {
      const { id } = req.params;
      const reservations = await Reservation.find({ menu: id })
        .populate('etudiant')
        .populate('menu');
      res.json({ reservations });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  