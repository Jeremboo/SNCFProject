var content = require("js/content");
var AjaxRequest = require('js/ajaxRequest');
var Popup = require('js/popUp');
var Dashboard = require('js/dashboard');


/* CONST */

var URL = "http://localhost:3333/";
var URL_API_PROJECT_A = "http://anarchy.rayanmestiri.com:9009/ecs/";
var _GLOBALDATASFORTODAY = "api/globalDatasForToday";
var _STATIONS = "api/stations";


/* INIT */

var today = new Date(2014, 2, 6); //On triche avec une date de mars pour être conforme au données.
var board = [];
var request = new AjaxRequest();
var autoCpltrStation = new AutoCompltr(content.autocompleZone);
var popUpConnexion = new Popup(content.popupConnexion);
var dashboard = new Dashboard(content.dashboardWrapper, today);

/* Recupération de la liste des gares */
request.post({url : URL+_STATIONS}, function(err, datas){

	showGlobalDatas("CHELLES GOURNAY");

	/*if(datas){

		popUpConnexion.showPopUp();

		autoCpltrStation.setSuggestionsList(datas);

		document.querySelector("#popup-connexion button").addEventListener('click',showDashboard,false);
		autoCpltrStation.onEnter(showDashboard);

	} else {
		console.log(err);
	}*/
});

/*
 * Activée lors d'une validation (click ou entrer) du choix d'un nom de gare.
 */
function showDashboard(e){
	//TODO : faire la récupération du nom d'agent et le connecter.
	var v = autoCpltrStation.getValue();

	if(v){
		showGlobalDatas(autoCpltrStation.getValue());
	} else {
		//TODO : afficher un message d'erreur quelque part
		console.log("No values");
	}
}

/*
 * Recupération des données du jour par rapport a une station
 */
function showGlobalDatas(station){

	request.post({url : URL+_GLOBALDATASFORTODAY, datas : {station : station, date : today} }, function(err, datas){
		if(datas){
	
			console.log(datas);

			//ajouter les détails de la jauge (ne fonctionne qu'avant l'insertion des gauges)
			content.maxSells.innerHTML = datas.board.maxSells;
			content.taux.className += " fadeInUp animated"; 

			//Création des jauges et mise en place dans le Dom 'invisible'
			dashboard.insertGauges(datas.board);

			dashboard.showDashboard();


			// 
			//content.nbrEquipement.innerHTML = datas.stationDetails['Nb Equipement'];

			//Animation
			popUpConnexion.hidePopUp(function(){

				//WARNING : fonction éxcuté deux fois !


				//ajouter les détails de la jauge
				content.maxSells.innerHTML = datas.board.maxSells;
				content.taux.className += " fadeInUp animated";

				//Affichage des jauges
				dashboard.showDashboard();

				//Ouverture de la jauge de la journée



			});

			

		

			

			

		} else {
			console.log(err);
		}		
	});
}
