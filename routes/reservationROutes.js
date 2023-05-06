const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');

// Create a new reservation
router.post('/', reservationController.addReservation);

// Get all reservations
router.get('/', reservationController.getAllReservations);

// Delete a reservation by ID
router.delete('/:id', reservationController.deleteReservation);



// Get reservations by student ID
router.get('/student/:id', reservationController.getReservationsByStudentId);

// Get reservations by menu ID
router.get('/menu/:id', reservationController.getReservationsByMenuId);


module.exports = router;
