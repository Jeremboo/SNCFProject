http = require 'http'

class Crowds
    constructor: () ->
        @stationId = ""
        @firstDay = -1;
        @period = -1
        @crowdsPeriodData = []
        
    getPeriodicalCrowds : (stationId, firstDay, period, callback) ->

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

        http.get("http://anarchy.rayanmestiri.com:9009/ecs/"+@stationId+"/"+date, (res) =>
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
                    callback("", @crowdsPeriodData)
                    return

                @getCrowdsData nbrRemaining, callback

        ).on 'error', (e) ->
          callback e.message

    
module.exports = Crowds