'use_strict';

var Gauge = require('js/gauge');
var PretentiveMissions = ('js/preventiveMissions');
var content = require('js/content');

function Dashboard(content, today){
	this.DOMWrapper = content;
	this.today = new Date(today);
	this.days = [];
	this.gauges = [];
	this.gaugeTodayNbr = -1;
	this.openGauge = false;
	this.DOMGauges = false;
	this.DOMDates = false;
}

/*
 * Ajoute au DOM les gauges avec les données nessessaires sans les afiché et les activés. 
 */ 
Dashboard.prototype.createDashboard = function(data){

	var DOMBoard = "";
	var todayTimeStamp = this.today.getTime();

	this.days = data.datasByDays;
	console.log(this.days);

	//pour chaque jour, créer gauge et chercher les missions
	for( var i = 0, j = this.days.length ; i < j ; i++){
		var that = this;
		var gauge = new Gauge(data.maxCrowds, data.maxSells, this.days[i]);

		if(new Date(that.days[i].day).getTime() > todayTimeStamp){
			gauge.getStateOfGauge(true, false);
		} else if( new Date(that.days[i].day).getTime() < todayTimeStamp) {
			gauge.getStateOfGauge(false, false);
		} else {
			that.gaugeTodayNbr = i;
			gauge.getStateOfGauge(true, true);
		}

		this.searchPreventiveMissions(gauge);	
		this.gauges.push(gauge);
	}

	//créer le dom des gauges
	for( var i = 0, j = this.gauges.length ; i < j ; i++){
		DOMBoard += this.gauges[i].createGauge();
	}

	this.DOMWrapper.innerHTML += DOMBoard;
	this.DOMGauges = document.getElementsByClassName('Gauge-wrapper');
	this.DOMDates = document.getElementsByClassName('Date');
};

/*
 * Crée l'animation pour afficher les gauges et ajoute les écouteurs nessessaires au gauges actives.
 */
Dashboard.prototype.showDashboard = function(nbrRemaining){
	var that = this;

	nbrRemaining = nbrRemaining || 0;

	// Définition de la fonction qui serra éxécutée lors d'un click.
	this.gauges[nbrRemaining].addEvents(this.DOMGauges[nbrRemaining].parentNode,function(gaugeOpened){
		if(that.openGauge)
			that.openGauge.close();
		that.openGauge = gaugeOpened;
	});

	//Affiche les gauges avec une animation
	this.DOMGauges[nbrRemaining].className += " fadeInUp animated";
	this.DOMDates[nbrRemaining].className += " fadeInUp animated";

	// Gestion de la recursivitée pour la saccade.
	if(nbrRemaining === this.gauges.length-1){
		this.openGaugeForToday();
		//TODO : n'activer les rollOver et les click qu'a ce moment la.
		return
	}
	nbrRemaining++;
	setTimeout(function(){
		that.showDashboard(nbrRemaining);
	},50);
};


/* ##########
	PRIVATE
   ########## */

/*
 * Recherche les actions possibles sur la gauge donnée et ajoute ces actions aux gauges concernées ainsi qu'a la gauge active 
 */
Dashboard.prototype.searchPreventiveMissions = function(gauge){

	var dirsProblems = gauge.getDirsProblems();

	//TODO : Mettre les missions dans une BDD et faire autrement
	var dataOfMission = {
		id : "",
		howManyDaysAfter : -1,
		title : "",
		icon : "",
		titleDescription : "",
		desciption : "",
		parameters : [
			{
				title : "",
				desciption : ""
			},
			{
				title : "",
				desciption : ""
			},
			{
				title : "",
				desciption : ""
			}
		]
	};

	//TODO : faire les autres missions possibles (beaucoup de vente, pics de trafic)
	
	if(dirsProblems.length > 0){
		for (var i = dirsProblems.length - 1; i >= 0; i--) {

			//console.log(dirsProblems[i]);
			//console.log(dirsProblems[i].categorisationTheme+" : "+dirsProblems[i]['Enoncé Problème']);

			switch(dirsProblems[i].categorisationTheme){
				case 'Vente' :
				/* Brief d'équipe sur les ventes : 
				Des problèmes vont surrement subvenir pour les ventes
				pendant ces jours en guiget et machine. Un bon brief et une bonne préparation 
				permetrait à l'équipe d'être plus efficace.
				*/
					dataOfMission.id = "";
					dataOfMission.howManyDaysAfter = 5;
					dataOfMission.title = "Vente";
					dataOfMission.icon = "";
					dataOfMission.titleDescription = "";
					dataOfMission.description = "";
					dataOfMission.parameters[0].title = "";
					dataOfMission.parameters[0].descrition = "";
					dataOfMission.parameters[1].title = "";
					dataOfMission.parameters[1].descrition = "";
					dataOfMission.parameters[2].title = "";
					dataOfMission.parameters[2].descrition = "";
					break;
				case 'Matériel' :
					dataOfMission.id = "";
					dataOfMission.howManyDaysAfter = 5;
					dataOfMission.title = "Matériel";
					dataOfMission.icon = "";
					dataOfMission.titleDescription = "";
					dataOfMission.description = "";
					dataOfMission.parameters[0].title = "";
					dataOfMission.parameters[0].descrition = "";
					dataOfMission.parameters[1].title = "";
					dataOfMission.parameters[1].descrition = "";
					dataOfMission.parameters[2].title = "";
					dataOfMission.parameters[2].descrition = "";
					break;
				case 'Applicatif' :
					dataOfMission.id = "";
					dataOfMission.howManyDaysAfter = 5;
					dataOfMission.title = "Applicatif";
					dataOfMission.icon = "";
					dataOfMission.titleDescription = "";
					dataOfMission.description = "";
					dataOfMission.parameters[0].title = "";
					dataOfMission.parameters[0].descrition = "";
					dataOfMission.parameters[1].title = "";
					dataOfMission.parameters[1].descrition = "";
					dataOfMission.parameters[2].title = "";
					dataOfMission.parameters[2].descrition = "";
					break;
				case 'Après-vente' :
					dataOfMission.id = "";
					dataOfMission.howManyDaysAfter = 5;
					dataOfMission.title = "Apres vente";
					dataOfMission.icon = "";
					dataOfMission.titleDescription = "";
					dataOfMission.description = "";
					dataOfMission.parameters[0].title = "";
					dataOfMission.parameters[0].descrition = "";
					dataOfMission.parameters[1].title = "";
					dataOfMission.parameters[1].descrition = "";
					dataOfMission.parameters[2].title = "";
					dataOfMission.parameters[2].descrition = "";
					break;
				default :
					dataOfMission.id = "";
					dataOfMission.howManyDaysAfter = 5;
					dataOfMission.title = "Defaut";
					dataOfMission.icon = "";
					dataOfMission.titleDescription = "";
					dataOfMission.description = "";
					dataOfMission.parameters[0].title = "";
					dataOfMission.parameters[0].descrition = "";
					dataOfMission.parameters[1].title = "";
					dataOfMission.parameters[1].descrition = "";
					dataOfMission.parameters[2].title = "";
					dataOfMission.parameters[2].descrition = "";	
					break;
			}
			this.addMission(dataOfMission);
		};
	}
};

Dashboard.prototype.addMission = function(data){

	//TODO : faire aussi un test si cette Mission n'est pas déjà créées
	if(this.gauges.length > data.howManyDaysAfter){
		this.gauges[this.gauges.length - data.howManyDaysAfter].addMission(data);
	}
}

/*
 * Ouvre automatiquement la gauge correspondant au jour actuel.
 */
Dashboard.prototype.openGaugeForToday = function(){

	var that = this;

	this.gauges[this.gaugeTodayNbr].open(function(openGauge){
		that.openGauge = openGauge;
	});
};




module.exports = Dashboard;