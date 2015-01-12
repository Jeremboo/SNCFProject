_ = require 'underscore'

class DirsProblem
    constructor : () ->
        @dirsProblemModel = require '../models/dirsProblemModel'

    #
    # Retourne un JSON des problèmes par rapport a un code de gare & une période données
    getPeriodicalPrblmsStation : (stationCode, firstDay, lastDay, callback) ->

         # WARNING : Mongoose décale les jours d'une journée. Il faut remédié à ça.
        query = @dirsProblemModel.find null
        query.where('date').gte(new Date firstDay.getTime()+86400000).lte(new Date lastDay.getTime()+86400000)
        # TODO : refaire le filtre par station dans la requete
        query.exec (err, dirs) ->
            if err
                callback err
                return

            dirs = _.filter dirs, (dir) ->
                return (dir.codeTool.indexOf(stationCode) >= 0)

            # WARNING : Mongoose décale les jours d'une journée. Il faut remédié à ça.
            for dir in dirs
                dir.date.setDate dir.date.getDate()-1

            callback null, dirs

module.exports = DirsProblem

