"use strict";

const Contrat = require('../models/contrat');

const dotenv = require('dotenv');
dotenv.config();
const url_base = process.env.URL.slice(0, -1);

exports.createSearch = (req, res, next) => {
  res.setHeader('content-type', 'application/json');
  let filters = {};
  const danger = req.query.danger;
  const minPrime = parseInt(req.query.minPrime);
  const maxPrime = parseInt(req.query.maxPrime);
  const planeteId = req.query.planeteId;
  const dateExpiration = req.query.dateExpiration;

  if (danger != -1) {
    filters.danger = req.query.danger;
  }

  if (planeteId != -1) {
    filters.planeteId = req.query.planeteId;
  }
  if (dateExpiration) {
    filters.dateExpiration = {};
    filters.dateExpiration.$lte = new Date(dateExpiration);
  }

  if ((minPrime && !isNaN(minPrime)) || (maxPrime && !isNaN(maxPrime))) {
    filters.prime = {};
  }

  if (minPrime && !isNaN(minPrime)) {
    filters.prime.$gte = minPrime;
  }
  if (maxPrime && !isNaN(maxPrime)) {
    filters.prime.$lte = maxPrime;
  }

  Contrat.find(filters)
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
          },
          {
            planete: {
              method: "GET",
              href: url_base + "/planetes/" + contrat.planeteId.toString()
            }
          },
          // {
          //   reserver: {
          //     method: "POST",
          //     href: url_base + "/reservations/" + contrat.planeteId.toString()
          //   }
          // }
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