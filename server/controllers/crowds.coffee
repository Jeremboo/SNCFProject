http = require 'http'


class Crowds
    constructor : () ->
        @crowdsModel = require '../models/crowdsModel'
        # @stationId = ""
        # @firstDay = -1;
        # @period = -1
        # @crowdsPeriodData = []

    #
    # Retourne un JSON des affluences par rapport à l'id d'une station et d'une période
    getPeriodicalCrowds : (stationId, firstDay, lastDay, callback) ->

        # WARNING : Mongoose décale les jours d'une journée. Il faut remédié à ça.
        query = @crowdsModel.find null
        query.where 'station', stationId
        query.where('date').gte(new Date firstDay.getTime()+86400000).lte(new Date lastDay.getTime()+86400000)
        query.exec (err, crowds) ->
            if err
                callback err
                return
            err = "Il n'y a pas de données sur l'affluence pour cette gare." if crowds.length == 0

            # WARNING : Mongoose décale les jours d'une journée. Il faut remédié à ça.
            for crowd in crowds
                crowd.date.setDate crowd.date.getDate()-1

            callback err, crowds
        
    ###getPeriodicalCrowds : (stationId, firstDay, period, callback) ->

        @stationId = stationId
        @firstDay = firstDay
        @period = period

        console.log "Waiting to crowdsData load with Rayan's API..."
        @getCrowdsData 0, (err, data) ->
            if err
                callback err
                return
            callback "", data


    getCrowdsData : (nbrRemaining, callback) ->

        dayInPeriod = new Date @firstDay.getTime() + (86400000*nbrRemaining)
        year = dayInPeriod.getFullYear()
        month = dayInPeriod.getMonth() + 1
        month = "0" + month if month < 10
        day = dayInPeriod.getDate()
        day = "0" + day if day < 10

        date = ""+year+month+day

        console.log "http://anarchy.rayanmestiri.com/ecs/"+@stationId+"/"+date

        http.get("http://anarchy.rayanmestiri.com/ecs/"+@stationId+"/"+date, (res) =>
            # console.log "Got response: " + res.statusCode
            body = ""

            res.on "data", (chunk) =>
                body += chunk
            
            res.on 'end', () =>
                resParsed = JSON.parse body
            
                @crowdsPeriodData.push {
                    date : dayInPeriod,
                    crowds : resParsed
                }

                nbrRemaining++

                if nbrRemaining >= @period
                    callback null, @crowdsPeriodData
                    return

                @getCrowdsData nbrRemaining, callback

        ).on 'error', (e) ->
          callback e.message###
   
module.exports = Crowds
