"use strict";

const Mineur = require('../models/mineur');

const dotenv = require('dotenv');
dotenv.config();
const url_base = process.env.URL;

exports.getMineurs = (req, res, next) => {
    res.setHeader('content-type', 'application/json');
    Mineur.find()
    .then(mineurs => {
      let mineursWithLink = mineurs.map(mineur => {
        let links = [{
          self: {
            method: "GET",
            href: url_base + "/mineurs/" + mineur._id.toString()
            }
          }
        ];
        mineur = mineur.toJSON();
        mineur.links = links;
        return mineur;
      });
      res.status(200).json({
        mineurs: mineursWithLink
      });
    })
    .catch(err => {
      next(err);
    });
};

exports.getMineur = (req, res, next) => {
    res.setHeader('content-type', 'application/json');
    const mineurId = req.params.mineurId;
    Mineur.findById(mineurId)
        .then(mineur => {
        if (mineur) {
            mineur.links = links;
            res.status(200).json({
                mineur: mineur
            });
        }
        else {
            const error = new Error('Le mineur n\'existe pas.');
            error.statusCode = 404;
            throw error;
        }
        })
        .catch(err => {
            next(err);
        });
};

exports.createMineur = (req, res, next) => {
    if (!req.user || req.user.niveau !== 2) {
        const error = new Error("Vous ne pouvez pas...");
        error.statusCode = 401;
        throw error;
    }
    req.headers['content-type'] = 'application/json';
    res.setHeader('content-type', 'application/json');
    new Mineur({
        email: req.body.email,
        nom: req.body.nom,
        motdepasse: req.body.motdepasse,
        niveau: req.body.niveau
    }).save()
        .then( mineur => {
            let links = [{
                self: {
                    method: "GET",
                    href: url_base + "/mineurs/" + mineur._id.toString()
                    }
                }
            ];
            mineur = mineur.toJSON();
            mineur.links = links;
            res.status(201).json({
                mineur: mineur
            });
        })
        .catch(err => {
            next(err);
        });
};

exports.deleteMineur = (req, res, next) => {
    Mineur.findByIdAndRemove(req.params.mineurId)
    .then( () => {
        res.status(204).json({
            message: "Le mineur a été supprimé.",
        });
    })
    .catch(err => {
        next(err);
    });
};

exports.whoAmI = (req, res, next) => {
    res.status(200).json({
        user: req.user
    });
}

exports.updateMineur = (req, res, next) => {
    if (!req.user || req.user.niveau !== 2) {
        const error = new Error("Vous ne pouvez pas...");
        error.statusCode = 401;
        throw error;
    }
    res.setHeader('content-type', 'application/json');
    Mineur.findById(req.params.mineurId)
        .then(mineur => {
            mineur.email = req.body.email;
            mineur.nom = req.body.nom;
            mineur.motdepasse = req.body.motdepasse;
            mineur.niveau = req.body.niveau;
            return mineur.save();
        })
        .then( mineur => {
            let links = [{
                self: {
                    method: "GET",
                    href: url_base + "/mineurs/" + mineur._id.toString()
                    }
                },
                {
                    update: {
                    method: "PUT",
                    href: url_base + "/mineurs/" + mineur._id.toString()
                    }
                },
                {
                    delete: {
                    method: "DELETE",
                    href: url_base + "/mineurs/" + mineur._id.toString()
                    }
                }
            ];
            mineur = mineur.toJSON();
            mineur.links = links;
            res.status(200).json({
                mineur: mineur
            });
        })
        .catch(err => {
            next(err);
        });
};


