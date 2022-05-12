"use strict";

const express = require('express');

const router = express.Router();

const reservationsController = require('../controllers/reservationsController');
const isAuth = require('../middleware/is-auth');

// /reservation/ => GET
router.get('/reservation/', reservationsController.getReservations);

// /reservation/reservationId => GET
router.get('/reservations/:reservationId', reservationsController.getReservation);

// /reservation/ => POST
router.post('/reservations/:mineurId/:contratId', isAuth, reservationsController.createReservation);

// /reservation/reservationId => PUT
router.put('/reservations/:reservationId', isAuth, reservationsController.updateReservation);

// /reservation/:reservationId => DELETE
router.delete('/reservations/:reservationId', isAuth, reservationsController.deleteReservation);

module.exports = router;

