# CONTROLLEUR DES DONNEES GLOBALES 

_ = require 'underscore'

class GlobalDatas
    constructor : () ->
        @DirsProblems = require '../controllers/dirsProblem'
        @Sells = require '../controllers/sells'
        @Crowds = require '../controllers/crowds'
        @period = 30
        @daysShowedBefore = 5
        @dashBoard = null
        @firstDayAnalysed = null
        @dirsProblemsData = [] 
        @automateSellsData = []
        @ticketWindowSellsData = []
        @crowdsPeriodData = []

    #
    # Retourne un JSON regroupant l'enssemble des données nessessaires à la génération du dashboard.
    ### Schéma du JSON :


    ###
    getGlobalDatas : (date, stationDetails, callback) ->

        @firstDayAnalysed = new Date date.getTime() - (@daysShowedBefore*86400000)
        lastDayAnalysed = new Date @firstDayAnalysed.getTime() + (@period*86400000)

        dirsProblems = new @DirsProblems
        sells = new @Sells
        crowds = new @Crowds

        @dashBoard = {
            dateNow : date,
            maxSells : -1,
            datasByDays : []
        }

        # TODO : refaire la récupération des données en asincrone & sans tout les if else 
        dirsProblems.getPeriodicalPrblmsStation stationDetails['Code Resarail'], @firstDayAnalysed, lastDayAnalysed, (err, dirsProblems) =>
            if err
                callback err
                return

            console.log dirsProblems.length+" dirsProblems loaded..."
            @dirsProblemsData = dirsProblems

            sells.getPeriodicalAutomateSells stationDetails.Gare, @firstDayAnalysed, lastDayAnalysed, (err, automateSells) =>
                if err
                    callback err
                    return
                
                console.log "automateSells loaded..."
                @automateSellsData = automateSells

                sells.getPeriodicalTicketWindowSells stationDetails.Gare, @firstDayAnalysed, lastDayAnalysed, (err, ticketWindowSells) =>
                    if err
                        callback err
                        return

                    console.log "TicketWindowSells loaded..."
                    @ticketWindowSellsData = ticketWindowSells

                    crowds.getPeriodicalCrowds stationDetails.Gare, @firstDayAnalysed, @period, (err, crowdsPeriod) =>
                        if err
                            callback err
                            return

                        console.log "crowdsPeriod loaded..."+crowdsPeriod
                        @crowdsPeriodData = crowdsPeriod

                        console.log "Construction of Dashboard"
                        @aggregateForPeriod (board) ->
                            callback "", board

    #
    # Crée un json regroupant toutes les données des 3 BDD par jour
    aggregateForPeriod : (callback) ->
        # Pour chaque jour, créer un json :
        console.log ""

        for i in [0...@period]
            dayInPeriod = new Date @firstDayAnalysed.getTime() + (86400000*i)
            dayToDateString = dayInPeriod.toDateString();

            dirsProblemsOfDay = _.filter @dirsProblemsData, (dir) ->
                date = new Date dir['Créé le']
                return date.toDateString() == dayToDateString

            automateSells = _.find @automateSellsData, (dir) ->
                date = new Date dir.date
                return date.toDateString() == dayToDateString

            ticketWindowSells = _.find @ticketWindowSellsData, (dir) ->
                date = new Date dir.date
                return date.toDateString() == dayToDateString

            crowdsData = _.find @crowdsPeriodData, (data) ->
                date = new Date data.date
                return date.toDateString() == dayToDateString


            automateSells = { sum : -1 } if !automateSells
            ticketWindowSells = { sum : -1 } if !ticketWindowSells
            crowdsData = { crowds : -1 } if !crowdsData


            # prix de vente max
            totalSells = automateSells.sum+ticketWindowSells.sum
            @dashBoard.maxSells = totalSells if totalSells > @dashBoard.maxSells


            json = {
                day : dayInPeriod,
                dirsProblems : dirsProblemsOfDay,
                automateSells : Math.round(automateSells.sum),
                ticketWindowSells : Math.round(ticketWindowSells.sum),
                crowds : crowdsData.crowds
            }

            @dashBoard.datasByDays.push json

            console.log dayInPeriod.toDateString()+" : "+automateSells.sum+" automateSells, "+
            ticketWindowSells.sum+" ticketWindowSells, "+dirsProblemsOfDay.length+" dirs pbrlm, "+
            crowdsData.crowds+ " persons"

        callback @dashBoard


module.exports = GlobalDatas