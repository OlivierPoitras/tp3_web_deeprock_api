"use strict";

const express = require('express');

const router = express.Router();

const planetesController = require('../controllers/planetesController');
const isAuth = require('../middleware/is-auth');

// /planete/ => GET
router.get('/planetes/', planetesController.getPlanetes);

// /planete/ => POST
router.post('/planetes/', isAuth, planetesController.createPlanete);

// /planete/planeteId => GET
router.get('/planetes/:planeteId', planetesController.getPlanete);

// /planete/planeteId => PUT
router.put('/planetes/:planeteId', isAuth, planetesController.updatePlanete);

// /planete/:planeteId => DELETE
router.delete('/planetes/:planeteId', isAuth, planetesController.deletePlanete);

module.exports = router;

