class Sells
    constructor : () ->
        @sellsModel = require '../models/sellsModel'

    #
    # Retourne un JSON des ventes machine par rapport à une station et une période
    getPeriodicalAutomateSells : (stationName, firstDay, lastDay, callback) ->

         # WARNING : Mongoose décale les jours d'une journée. Il faut remédié à ça.
        query = @sellsModel.automate.find null
        query.where 'gare', stationName
        query.where('date').gte(new Date firstDay.getTime()+86400000).lte(new Date lastDay.getTime()+86400000)
        query.exec (err, sells) ->
            if err
                callback err
                return
            err = "Il n'y a pas de données sur les ventes machines pour cette gare." if sells.length == 0

            # WARNING : Mongoose décale les jours d'une journée. Il faut remédié à ça.
            for sell in sells
                sell.date.setDate sell.date.getDate()-1

            callback err, sells

    getPeriodicalTicketWindowSells : (stationName, firstDay, lastDay, callback) ->

         # WARNING : Mongoose décale les jours d'une journée. Il faut remédié à ça.
        query = @sellsModel.ticketWindow.find null
        query.where 'gare', stationName
        query.where('date').gte(new Date firstDay.getTime()+86400000).lte(new Date lastDay.getTime()+86400000)
        query.exec (err, sells) ->
            if err
                callback err
                return
            err = "Il n'y a pas de données sur les ventes en guichet pour cette gare." if sells.length == 0

            # WARNING : Mongoose décale les jours d'une journée. Il faut remédié à ça.
            for sell in sells
                sell.date.setDate sell.date.getDate()-1

            callback err, sells



module.exports = Sells