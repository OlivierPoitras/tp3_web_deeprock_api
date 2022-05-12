"use strict";

const express = require('express');

const router = express.Router();

const mineursController = require('../controllers/mineursController');
const isAuth = require('../middleware/is-auth');

// /mineurs/ => GET
router.get('/mineurs/', mineursController.getMineurs);

// /mineurs/ => POST
//isAuth
router.post('/mineurs/', mineursController.createMineur);

// /mineurs/mineurId => GET
router.get('/mineurs/:mineurId', mineursController.getMineur);

// /mineurs/mineurId => PUT
router.put('/mineurs/:mineurId', isAuth, mineursController.updateMineur);

// /mineurs/:mineur => DELETE
router.delete('/mineurs/:mineurId', isAuth, mineursController.deleteMineur);

// /mineur/whoami => GET
router.get('/mineur/whoami', isAuth, mineursController.whoAmI);

module.exports = router;

