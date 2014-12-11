# MODEL QUI RECUPERE ET TRAITE LES DONNEES DU SERVEUR
mongoose = require 'mongoose'

sellsSchema = mongoose.Schema {
    "gare" : String,
    "lineName" : String,
    "date" : Date,
    "sum" : Number
}

Automate = mongoose.model 'Automatesells', sellsSchema, 'automatesells'
TicketWindow = mongoose.model 'Ticketwindowsells', sellsSchema, 'ticketwindowsells'

module.exports = {
	automate : Automate,
	ticketWindow : TicketWindow
}