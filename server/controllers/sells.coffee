class Sells
	constructor : () ->
		@sellsModel = require '../models/sellsModel'

	#
	# Retourne un JSON des ventes machine par rapport à une station et une période
	getPeriodicalAutomateSells : (stationName, firstDay, lastDay, callback) ->
		query = @sellsModel.automate.find null
		query.where 'gare', stationName
		query.where('date').gte(firstDay).lte(lastDay)
		query.exec (err, sells) ->
			callback err if err
			err = "Il n'y a pas de données sur les ventes machines pour cette gare." if sells.length == 0
			callback err, sells

	getPeriodicalTicketWindowSells : (stationName, firstDay, lastDay, callback) ->
		query = @sellsModel.ticketWindow.find null
		query.where 'gare', stationName
		query.where('date').gte(firstDay).lte(lastDay)
		query.exec (err, sells) ->
			callback err if err
			err = "Il n'y a pas de données sur les ventes en guichet pour cette gare." if sells.length == 0
			callback err, sells



module.exports = Sells