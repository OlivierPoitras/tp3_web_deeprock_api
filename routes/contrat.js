"use strict";

const express = require('express');

const router = express.Router();

const contratsController = require('../controllers/contratsController');
const isAuth = require('../middleware/is-auth');

// /contrat/ => GET
router.get('/contrats/', contratsController.getContrats);

// /contrat/contratId => GET
router.get('/contrats/:contratId', contratsController.getContrat);

// /contrat/ => POST
router.post('/contrats/', isAuth, contratsController.createContrat);

// /contrat/contratId => PUT
router.put('/contrats/:contratId', isAuth, contratsController.updateContrat);

// /contrat/:contratId => DELETE
router.delete('/contrats/:contratId', isAuth, contratsController.deleteContrat);

module.exports = router;

