var content = require("js/content");
var AjaxRequest = require('js/ajaxRequest');
var Popup = require('js/popUp');
var Dashboard = require('js/dashboard');
var Header = require('js/header');


/* CONST */

var URL = "http://localhost:3333/";
var URL_API_PROJECT_A = "http://anarchy.rayanmestiri.com:9009/ecs/";
var _GLOBALDATASFORTODAY = "api/globalDatasForToday";
var _STATIONS = "api/stations";


/* INIT */

var today = new Date(2014, 1, 26); //On triche avec une date de mars pour être conforme au données.
var board = [];
var stationName = null;
var request = new AjaxRequest();
var autoCpltrStation = new AutoCompltr(content.autocompleZone);
var popUpConnexion = new Popup(content.popupConnexion);
var dashboard = new Dashboard(content.dashboardWrapper, today);
var header = new Header();

/* Events */
header.addEvent(); // ajoute les futurs évènements

/* Recupération de la liste des gares */
request.post({url : URL+_STATIONS}, function(err, datas){

	if(datas){

		popUpConnexion.showPopUp();

		autoCpltrStation.setSuggestionsList(datas);

		document.querySelector("#popup-connexion button").addEventListener('click',showDashboard,false);
		autoCpltrStation.onEnter(showDashboard);

	} else {
		console.log(err);
	}
});

/*
 * Activée lors d'une validation (click ou entrer) du choix d'un nom de gare.
 */
function showDashboard(e){

	stationName = autoCpltrStation.getValue();

	if(stationName){
		content.errorConnexion.innerHTML = "";
		content.loader.className += "fadeInUp animated";
		showGlobalDatas();
	} else {
		//TODO : afficher un message d'erreur quelque part
		content.errorConnexion.innerHTML = "Donnez le nom d'une gare";
	}
}

/*
 * Recupération des données du jour par rapport a une station
 */
function showGlobalDatas(){

	request.post({url : URL+_GLOBALDATASFORTODAY, datas : {station : stationName, date : today} }, function(err, datas){
		if(datas){
	
			console.log(datas);

			//ajouter les détails de la jauge (ne fonctionne qu'avant l'insertion des gauges)
			//content.maxCrowds.innerHTML = new Intl.NumberFormat().format(datas.board.maxCrowds);
			content.maxSells.innerHTML = new Intl.NumberFormat().format(datas.board.maxSells);
			content.taux.className += " fadeInUp animated"; 

			//Création des jauges et mise en place dans le Dom 'invisible'
			dashboard.createDashboard(datas.board);

			//Animation
			//WARNING : fonction éxcuté deux fois !
			popUpConnexion.hidePopUp(function(){

				header.showTitle(stationName);
				//Affichage des jauges & ouverture de la première gauge
				dashboard.showDashboard();
			});
		} else {
			content.loader.classList.remove("fadeInUp");
			content.loader.classList.remove("animated");
			content.errorConnexion.innerHTML = err;
		}		
	});
}

