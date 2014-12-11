# MODEL QUI RECUPERE ET TRAITE LES DONNEES DU SERVEUR
mongoose = require 'mongoose'

problemSchema = mongoose.Schema
    "Dossier" : Number,
    "Créé le" : Date,
    "Date de Fermeture" : Date,
    "Nom Outil" : String,
    "Code et Type Machine" : String,
    "Région SNCF" : String,
    "Région administrative" : Number,
    "Enoncé Problème" : String,
    "categorisationTheme" : String,
    "categorisationTypologie" : String,
    "categorisationCause" : String,
    "Solution" : String,
    "Statut" : String,
    "Numéro Incident+" : String,
    "Numéro Anomalie" : String

DirsPrbl = mongoose.model 'Dirsproblem', problemSchema, 'dirsproblem'

module.exports = DirsPrbl