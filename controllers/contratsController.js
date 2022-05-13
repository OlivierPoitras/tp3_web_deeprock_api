"use strict";

const Contrat = require('../models/contrat');

const dotenv = require('dotenv');
dotenv.config();
const url_base = process.env.URL;

exports.getContrats = (req, res, next) => {
    res.setHeader('content-type', 'application/json');
    Contrat.find()
    .then(contrats => {
      let contratsWithLink = contrats.map(contrat => {
        let links = [{
          self: {
            method: "GET",
            href: url_base + "/contrats/" + contrat._id.toString()
            }
          },
          {
            update: {
              method: "PUT",
              href: url_base + "/contrats/" + contrat._id.toString()
            }
          },
          {
            delete: {
              method: "DELETE",
              href: url_base + "/contrats/" + contrat._id.toString()
            }
          }
        ];
        contrat = contrat.toJSON();
        contrat.links = links;
        return contrat;
      });
      res.status(200).json({
        contrats: contratsWithLink
      });
    })
    .catch(err => {
      next(err);
    });
};

exports.getContrat = (req, res, next) => {
    res.setHeader('content-type', 'application/json');
    Contrat.findById(req.params.contratId)
        .then(contrat => {
        if (contrat) {
            let links = [
                {
                    self: {
                        method: "GET",
                        href: url_base + "/contrats/" + contrat._id.toString()
                    }
                },
                {
                    update: {
                        method: "PUT",
                        href: url_base + "/contrats/" + contrat._id.toString()
                    }
                },
                {
                    delete: {
                        method: "DELETE",
                        href: url_base + "/contrats/" + contrat._id.toString()
                    }
                },
                {
                    planete: {
                        method: "GET",
                        href: url_base + "/planetes/" + contrat.planeteId.toString()
                    } 
                }
            ];
            contrat = contrat.toJSON();
            contrat.links = links;
            res.status(200).json({
                contrat: contrat
            });
        }
        else {
            res.status(404).json({
                message: "Ce contrat n'existe pas"
            });
        }
        })
        .catch(err => {
            next(err);
        });
};

exports.createContrat = (req, res, next) => {
    if (!req.user || req.user.niveau !== 2) {
        const error = new Error("Vous ne pouvez pas...");
        error.statusCode = 401;
        throw error;
    }
    req.headers['content-type'] = 'application/json';
    res.setHeader('content-type', 'application/json');
    new Contrat({
        planeteId:req.body.planeteId,
        prime:req.body.prime,
        danger:req.body.danger,
        ressource:req.body.ressource,
        quantiteRessource:req.body.quantiteRessource,
        dateExpiration:req.body.dateExpiration
    }).save()
        .then(contrat => {
            res.status(201).json({
                contrat: contrat
            });
        })
        .catch(err => {
            next(err);
        });
};

exports.deleteContrat = (req, res, next) => {
    if (!req.user || req.user.niveau !== 2) {
        const error = new Error("Vous ne pouvez pas...");
        error.statusCode = 401;
        throw error;
    }
    Contrat.findByIdAndRemove(req.params.contratId)
    .then(() => {
        res.status(204).json({
            message: "Le contrat a été supprimé.",
        });
    })
    .catch(err => {
        next(err);
    });
};

exports.updateContrat = (req, res, next) => {
    if (!req.user || req.user.niveau !== 2) {
        const error = new Error("Vous ne pouvez pas...");
        error.statusCode = 401;
        throw error;
    }
    req.headers['content-type'] = 'application/json';
    res.setHeader('content-type', 'application/json');
    Contrat.findByIdAndUpdate(req.params.mineurId,{
        planeteId:req.body.planeteId,
        prime:req.body.prime,
        danger:req.body.danger,
        ressource:req.body.ressource,
        quantiteRessource:req.body.quantiteRessource,
        dateExpiration:req.body.dateExpiration
    },{
        new: true
      })
    .then(contrat =>{
        let links = [{
            self: {
                method: "GET",
                href: url_base + "/contrats/" + contrat._id.toString()
                }
            },
            {
                update: {
                method: "PUT",
                href: url_base + "/contrats/" + contrat._id.toString()
                }
            },
            {
                delete: {
                method: "DELETE",
                href: url_base + "/contrats/" + contrat._id.toString()
                }
            }
        ];
        contrat = contrat.toJSON();
        contrat.links = links;
        res.status(200).json({
            contrat: contrat
        });
    })
    .catch(err => {
        next(err);
    });
}


