# MODEL QUI RECUPERE ET TRAITE LES DONNEES DU SERVEUR
mongoose = require 'mongoose'

stationSchema = mongoose.Schema {
    "Gare" : String,
    "Code Resarail" : String,
    "Nb Equipement" : Number,
    "Ligne" : Number,
    "Zone" : Number,
    "Région" : Number
}

Station = mongoose.model 'Stations', stationSchema, 'stations'

module.exports = Station