mongoose = require 'mongoose'

crowdsSchema = mongoose.Schema
	"station" : String,
	"date" : Date,
	"crowd" : Number

Crowds = mongoose.model 'Crowds', crowdsSchema, 'crowds'

module.exports = Crowds