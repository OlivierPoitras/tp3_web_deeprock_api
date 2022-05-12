"use strict";

const express = require('express');
const mongoose = require('mongoose');
var hateoasLinker = require('express-hateoas-links');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

// Déclaration d'un parser pour analyser "le corps (body)" d'une 'requête entrante avec POST  
// Permet donc d'analyser

// parse application/json
app.use(express.json());  

// remplace le res.json standard avec la nouvelle version
// qui prend en charge les liens HATEOAS
app.use(hateoasLinker); 

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use((req, res, next) => {
  let authToken = req.headers['authorization'];
  if(authToken) {
    authToken = authToken.split(' ')[1];
    try {
      const decoded = jwt.verify(authToken, process.env.SECRET_JWT)
      req.user = decoded;
      next()
    } catch(e) {
      req.user = null;
      next();
    }
    
  } else {
    req.user = null;
    next();
  }
});

const errorController = require('./controllers/error');

// Importe les routes
const searchRoutes = require('./routes/search');
const authRoutes = require('./routes/auth');
const planeteRoutes = require('./routes/planete');
const mineurRoutes = require('./routes/mineur');
const contratRoutes = require('./routes/contrat');
const reservationRoutes = require('./routes/reservation');

// Utilisation des routes en tant que middleware
app.use('/auth', authRoutes);
app.use(searchRoutes);
app.use(planeteRoutes);
app.use(mineurRoutes);
app.use(contratRoutes);
app.use(reservationRoutes);


app.use(errorController.get404);

// Gestion des erreurs
// "Attrappe" les erreurs envoyé par "throw"
app.use(function (err, req, res, next) {
  console.log('err', err);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).json({ message: err.message, statusCode: err.statusCode });
});


const PORT = process.env.PORT || 3000;
mongoose
.connect(process.env.DATABASE_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log('Node.js est à l\'écoute sur le port %s ', PORT);
    });
  })
  .catch(err => console.log(err));

