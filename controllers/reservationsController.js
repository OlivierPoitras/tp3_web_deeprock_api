"use strict";

const Reservation = require('../models/reservation');

const dotenv = require('dotenv');
dotenv.config();
const url_base = process.env.URL.slice(0, -1);

exports.getReservations = (req, res, next) => {
    res.setHeader('content-type', 'application/json');
    Reservation.find()
    .then(reservations => {
      let reservationsWithLink = reservations.map(reservation => {
        let links = [{
          self: {
            method: "GET",
            href: url_base + "/reservations/" + reservation._id.toString()
            }
          }
        ];
        reservation = reservation.toJSON();
        reservation.links = links;
        return reservation;
      });
      res.status(200).json({
        reservations: reservationsWithLink
      });
    })
    .catch(err => {
      next(err);
    });
};

exports.getReservation = (req, res, next) => {
    res.setHeader('content-type', 'application/json');
    const reservationId = req.params.reservationId;
    Reservation.findById(reservationId)
        .then(reservation => {
        if (reservation) {
            let links = [
                {
                    self: {
                        method: "GET",
                        href: url_base + "/reservations/" + reservation._id.toString()
                    }
                },
                {
                    update: {
                        method: "PUT",
                        href: url_base + "/reservations/" + reservation._id.toString()
                    }
                },
                {
                    delete: {
                        method: "DELETE",
                        href: url_base + "/reservations/" + reservation._id.toString()
                    }
                },
                {
                    contrat: {
                        method: "GET",
                        href: url_base + "/contrats/" + reservation.contratId.toString()
                    }
                }
            ];
            reservation = reservation.toJSON();
            reservation.links = links;
            res.status(200).json({
                reservation: reservation
            });
        }
        else {
            res.status(404).json({
                message: "Cette réservation n'existe pas"
            });
        }
        })
        .catch(err => {
            next(err);
        });
};

exports.createReservation = (req, res, next) => {
    req.headers['content-type'] = 'application/json';
    res.setHeader('content-type', 'application/json');
    new Reservation({
        mineurId: req.params.mineurId,
        contratId: req.params.contratId,
        estTermine: false
    }).save()
        .then( reservation => {
            let links = [{
                self: {
                    method: "GET",
                    href: url_base + "/reservations/" + reservation._id.toString()
                    }
                }
            ];
            reservation = reservation.toJSON();
            reservation.links = links;
            res.status(201).json({
                reservation: reservation
            });
        })
        .catch(err => {
            next(err);
        });
};

exports.deleteReservation = (req, res, next) => {
    if (!req.user || req.user.niveau !== 2) {
        const error = new Error("Vous ne pouvez pas...");
        error.statusCode = 401;
        throw error;
    }
    Reservation.findByIdAndRemove(req.params.reservationId)
    .then( () => {
        res.status(204).send();
    })
    .catch(err => {
        next(err);
    });
};

exports.updateReservation = (req, res, next) => {
    if (!req.user || req.user.niveau !== 2) {
        const error = new Error("Vous ne pouvez pas...");
        error.statusCode = 401;
        throw error;
    }
    req.headers['content-type'] = 'application/json';
    res.setHeader('content-type', 'application/json');
    Reservation.findById(req.params.reservationId)
        .then(reservation => {
            if(!reservation){
                res.status(404).send("Ressource non trouvée");
            }
            console.log(reservation);
            reservation.mineurId = req.body.mineurId;
            reservation.contratId = req.body.contratId;
            reservation.estTermine = req.body.estTermine;
            return reservation.save();
        })
        .then( reservation => {
            let links = [{
                self: {
                    method: "GET",
                    href: url_base + "/reservations/" + reservation._id.toString()
                    }
                }
            ];
            reservation = reservation.toJSON();
            reservation.links = links;
            res.status(200).json({
                reservation: reservation
            });
        })
        .catch(err => {
            next(err);
        });
};