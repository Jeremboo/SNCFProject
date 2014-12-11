express = require 'express'
bodyParser = require 'body-parser'
http = require 'http'
socketio = require 'socket.io'
mongoose = require 'mongoose'

GlobalDatasCtrl = require './server/controllers/globalDatas'
StationCtrl = require './server/controllers/station'

exports.startServer = (port, path, callback) ->

    app = express()
    server = http.createServer app
    io = socketio.listen server

    station = new StationCtrl
    globalDatas = new GlobalDatasCtrl

    mongoose.connect 'mongodb://localhost/SNCF', (err) ->
        throw err if err

    app.use express.static "#{__dirname}/public"
    app.use bodyParser.json()


    app.get '/', (request, response) ->
        response.sendFile 'public/index.html'

    #
    # Retourne un Array avec l'enssemble des noms de stations.
    app.post '/api/stations', (request, response) ->
        console.log "load Stations..."
        station.getTblStationName (err, datas) ->
            console.log "Stations received !"
            response.send { err : err, datas : datas || false }

    #
    # Retourne l'enssemble des information du dashboard
    app.post '/api/globalDatasForToday', (request, response) ->

        console.log "load globalDatasForToday..."

        stationName = request.body.station
        date = new Date request.body.date

        returnedDatas = {
            stationDetails : {}
            board : {}
        }

        station.getStationDetails stationName, (err, datas) ->

            if err
                response.send { err : err }
                return

            returnedDatas.stationDetails = datas;

            # Recupération des données gloabales
            globalDatas.getGlobalDatas date, datas, (err, board) ->
                console.log "Datas received !"
                if err
                    console.log 'But : '+err
                    response.send { err : err }
                    return

                returnedDatas.board = board
                response.send { datas : returnedDatas }




    server.listen port, ->
        console.log("listenir on port #{port}_")
        callback()