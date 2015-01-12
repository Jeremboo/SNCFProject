# MODEL QUI RECUPERE ET TRAITE LES DONNEES DU SERVEUR
mongoose = require 'mongoose'

problemSchema = mongoose.Schema
    "catProblem" : String,
    "date" : Date,
    "codeTool" : String,
    "SNCFZone" : String

DirsPrbl = mongoose.model 'Dirsproblem', problemSchema, 'dirsproblem'

module.exports = DirsPrbl