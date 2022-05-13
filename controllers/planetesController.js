"use strict";

const Planete = require('../models/planete');

exports.getPlanetes = (req, res, next) => {
  Planete.find()
    .then(planetes => {
      res.json({
        planetes: planetes
      });
    })
    .catch(err => {
      next(err);
    });
};

exports.getPlanete = (req, res, next) => {
  const planeteId = req.params.planeteId;
  Planete.findById(planeteId)
    .then(planete => {
      if (!planete) {
        const error = new Error('La planete n\'existe pas.');
        error.statusCode = 404;
        throw error;
      }
      res.json({
        planete: planete
      });
    })
    .catch(err => {
      next(err);
    });
};

exports.createPlanete = (req, res, next) => {
  if (!req.user || req.user.niveau !== 2) {
    const error = new Error("Vous ne pouvez pas...");
    error.statusCode = 401;
    throw error;
  }

  const {
    nom,
    image
  } = req.body;

  const planete = new Planete({
    nom: nom,
    image: image
  });

  planete.save()
    .then(() => {
      res.status(201).json({
        message: "Planete créée",
        planete: planete
      });
    })
    .catch(err => {
      next(err);
    });
};

exports.deletePlanete = (req, res, next) => {
  if (!req.user || req.user.niveau !== 2) {
    const error = new Error("Vous ne pouvez pas...");
    error.statusCode = 401;
    throw error;
  }
  const planeteId = req.params.planeteId;
  Planete.findByIdAndRemove(planeteId)
    .then(() => {
      res.status(204).json({
        message: "Planete supprimée"
      });
    });

};

exports.updatePlanete = (req, res, next) => {
  if (!req.user || req.user.niveau !== 2) {
    const error = new Error("Vous ne pouvez pas...");
    error.statusCode = 401;
    throw error;
  }
  const planeteId = req.params.planeteId;
  const {nom,image} = req.body;

  Planete.findById(planeteId)
    .then(planete => {
      if (!planete) {
        const error = new Error('Le planete n\'existe pas.');
        error.statusCode = 404;
        throw error;
      }
      planete.nom = nom;
      planete.image = image;
      return planete.save();
    })
    .then(planete => {
      res.status(200).json({
        message: "Planete modifiée",
        planete: planete
      });
    })
    .catch(err => {
      next(err);
    });
};