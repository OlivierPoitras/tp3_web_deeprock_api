"use strict";

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const User = require('../models/mineur');

exports.login = (req, res, next) => {
  const email = req.body.email;
  const motdepasse = req.body.motdepasse;

  let loadedUser;
  User.findOne({email: email})
  .then(user =>{
    if (!user) {
      const error = new Error('Utilisateur non trouvée');
      error.statusCode = 404;
      throw error;
    }
    loadedUser = user;
    return bcrypt.compare(motdepasse, user.motdepasse);
  })
  .then(isEqual => {
    if (!isEqual) {
      const error = new Error('Mauvais mot de passe !');
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign(
      {
        email: loadedUser.email,
        nom: loadedUser.nom,
        userId: loadedUser._id.toString(),
        niveau: loadedUser.niveau
      },
      process.env.SECRET_JWT,
      { expiresIn: '1h' }
    );
    res.status(200).json({ token: token });
  })
  .catch(err =>{
    if (!err.statusCode) err.statusCode = 500;
    console.log(err);
    res.status(err.statusCode).json({ message: err.message, statusCode: err.statusCode });
  })
};

function validation(email, name, password){
  const regexEmail = new RegExp("^([a-zA-Z0-9_.+-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$")
  const regexName = new RegExp("^[a-zA-Z0-9àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ.,'!& ]*$")
  const regexPassword = new RegExp("^[*a-zA-Z0-9!@#$%^&(){}[]:;<>,.?/~_+-=|]*]*$")

  const errors = {}

  if(email.trim() === ""){
      errors.email = "Veuillez entrer un courriel"
  } else if (!regexEmail.test(email)){
      errors.email = "L'adresse courriel est invalide"
  }

  if(name.trim() === ""){
      errors.name = "Veuillez entrer un nom"
  } else if (!regexName.test(name)){
      errors.name = "Le nom contient des caractères inconnus"
  }

  if(password.trim() === ""){
      errors.password = "Veuillez entrer un mot de passe"
  } else if(!regexPassword.test(password)){
      errors.password = "Votre mot de passe contient des espaces ou des caractères inconnus"
  } else if (password.length < 6 || password.length > 40){
      errors.password = "Votre mot de passe doit contenir entre 6 et 40 caractères"
  }
  return errors;
}

exports.signup = (req, res, next) => {
  const email = req.body.email;
  const nom = req.body.nom;
  const motdepasse = req.body.motdepasse;
  const niveau = req.body.niveau;

  User.findOne({email: email})
  .then(user => {
    const errors = validation(email, nom, motdepasse);
    if(user){
      errors.email = "Ce courriel est déjà utilisé";
    }

    if(Object.keys(errors).length !== 0){
      res.status(400).json({errors:errors});
    }
    else {
      bcrypt
      .hash(motdepasse, 12)
      .then((hashedPassword) => {
        const user = new User({
          email: email,
          nom: nom,
          motdepasse: hashedPassword,
          niveau: niveau
        });
        return user.save();
      })
      .then(result => {
        res.status(201).json({message: "Utilisateur créé !", userId: result.id});
      })
      .catch(err => {
        next(err);
      });
    }
  });
};

