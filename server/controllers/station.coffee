class Station
	constructor : () ->
		@stationModel = require '../models/stationModel'

	#
	# Retourne un Tableau avec le nom de toutes les stations
	getTblStationName : (callback) ->
		stationTbl = []
		@stationModel.find null, (err, stations) ->
			# err = "No stations Find" if stations.length == 0
			if err
				callback err
				return

			for station in stations
				stationTbl.push station.Gare
			callback "", stationTbl

	#
	# Retourne les données détaillées d'une stations & une erreur si la station n'existe pas
	getStationDetails : (stationName, callback) ->
		@stationModel.find { Gare : stationName }, (err, stationDetail) ->
			if err
				callback err
				return

			if stationDetail.length < 1
				err = "Aucune données liés au nom de Gare que vous avez indiqué"

			callback  err, stationDetail[0]
			
module.exports = Station
