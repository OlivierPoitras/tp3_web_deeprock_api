"use strict";

const express = require('express');

const router = express.Router();

const searchController = require('../controllers/searchController');

// /search/ => GET
router.get('/search', searchController.createSearch);

module.exports = router;

