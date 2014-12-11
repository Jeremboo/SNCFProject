_ = require 'underscore'

class DirsProblem
    constructor : () ->
        @dirsProblemModel = require '../models/dirsProblemModel'

    #
    # Retourne un JSON des problèmes par rapport a un code de gare & une période données
    getPeriodicalPrblmsStation : (stationCode, firstDay, lastDay, callback) ->
        query = @dirsProblemModel.find null
        query.where('Créé le').gte(firstDay).lte(lastDay)
        # TODO : refaire le filtre par station dans la requete
        query.exec (err, dirs) ->
            if err
                callback err
                return

            dirs = _.filter dirs, (dir) ->
                return (dir['Nom Outil'].indexOf(stationCode) >= 0)

            callback "", dirs

module.exports = DirsProblem

