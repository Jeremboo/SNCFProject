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

	if(gauge.isPeakSellsDay()){
		// Alarming
		dataOfMission.id = "MONNAYEUR";
		dataOfMission.howManyDaysAfter = 0;
		dataOfMission.title = "Vérifier les monnayeurs";
		dataOfMission.icon = "";
		dataOfMission.titleDescription = "Risque de saturation des monnayeurs";
		dataOfMission.description = "Des problèmes avec les monnayeurs risque de survenir à cause des jours de pointes.";
		dataOfMission.parameters[0].title = "-10mins";
		dataOfMission.parameters[0].descrition = "de fil d'attente";
		dataOfMission.parameters[1].title = "+5%";
		dataOfMission.parameters[1].descrition = "de ventes";
		dataOfMission.parameters[2].title = "+50%";
		dataOfMission.parameters[2].descrition = "de sourires chez les voyageurs";
		this.addMission(dataOfMission);

		// ANNONCE
		dataOfMission.id = "ANNONCE";
		dataOfMission.howManyDaysAfter = 5;
		dataOfMission.title = "Annonce préventive";
		dataOfMission.icon = "";
		dataOfMission.titleDescription = "faire une annonce préventive";
		dataOfMission.description = "Un pic d'affluence est à venir, faire une annonce pour prévenir les usagers d'anticiper leur rechargement.";
		dataOfMission.parameters[0].title = "-30mins";
		dataOfMission.parameters[0].descrition = "d'attente en jour de pointe";
		dataOfMission.parameters[1].title = "+5%";
		dataOfMission.parameters[1].descrition = "de ventes";
		dataOfMission.parameters[2].title = "+50%";
		dataOfMission.parameters[2].descrition = "de sourires chez les voyageurs";
		this.addMission(dataOfMission);
	}

	if(gauge.isPeakCrowdsDay()){
		// ORIENTATION
		dataOfMission.id = "ORIENTATION";
		dataOfMission.howManyDaysAfter = 0;
		dataOfMission.title = "Orienter les voyageurs";
		dataOfMission.icon = "";
		dataOfMission.titleDescription = "Dédier un agent pour orienter les voyageurs";
		dataOfMission.description = "Un pic d'affluence en gare est à venir, de nombreux voyageurs circuleront. Afin de fluidifier le passage, un agent serait nécessaire.";
		dataOfMission.parameters[0].title = "-30mins";
		dataOfMission.parameters[0].descrition = "d'attente en gare";
		dataOfMission.parameters[1].title = "-30%";
		dataOfMission.parameters[1].descrition = "de foules";
		dataOfMission.parameters[2].title = "+20%";
		dataOfMission.parameters[2].descrition = "de satisfaction";
		this.addMission(dataOfMission);
	}
	
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
					dataOfMission.id = "BRIEFEQUIPE";
					dataOfMission.howManyDaysAfter = 1;
					dataOfMission.title = "Briefer l'équipe";
					dataOfMission.icon = "";
					dataOfMission.titleDescription = "Des problèmes de ventes vont survenir";
					dataOfMission.description = "Briefer l'équipe permettrait d'anticiper les problèmes liés aux ventes qui vont potentiellement survenir dû à la forte afflucence.";
					dataOfMission.parameters[0].title = "-10mins";
					dataOfMission.parameters[0].descrition = "de files d'attente";
					dataOfMission.parameters[1].title = "+10%";
					dataOfMission.parameters[1].descrition = "de ventes";
					dataOfMission.parameters[2].title = "-20%";
					dataOfMission.parameters[2].descrition = "de stress";
					break;
				case 'Matériel' :
					dataOfMission.id = "";
					dataOfMission.howManyDaysAfter = 2;
					dataOfMission.title = "Vérifier les bornes";
					dataOfMission.icon = "";
					dataOfMission.titleDescription = "Vérifier l'état des bornes";
					dataOfMission.description = "Vérifier l'état des machines en gare afin d'anticiper les problèmes possibles et l'affluence des voyageurs aux points de vente.";
					dataOfMission.parameters[0].title = "-20mins";
					dataOfMission.parameters[0].descrition = "de files d'attente";
					dataOfMission.parameters[1].title = "+20%";
					dataOfMission.parameters[1].descrition = "de ventes";
					dataOfMission.parameters[2].title = "+70%";
					dataOfMission.parameters[2].descrition = "de satisfaction chez les voyageurs";
					break;
				case 'Applicatif' :
					dataOfMission.id = "";
					dataOfMission.howManyDaysAfter = 1;
					dataOfMission.title = "Préparer une équipe";
					dataOfMission.icon = "";
					dataOfMission.titleDescription = "Préparer une équipe à l'aide des voyageurs";
					dataOfMission.description = "Une personne devra être dédiée à l'aide aux voyageurs lors de l'utilisation des bornes en cas d'erreur afin de faciliter le flux de vente.";
					dataOfMission.parameters[0].title = "-10mins";
					dataOfMission.parameters[0].descrition = "de files d'attente";
					dataOfMission.parameters[1].title = "+5%";
					dataOfMission.parameters[1].descrition = "de ventes";
					dataOfMission.parameters[2].title = "+75%";
					dataOfMission.parameters[2].descrition = "de sourires chez les voyageurs";
					break;
				case 'Après-vente' :
					dataOfMission.id = "BRIEFEQUIPE";
					dataOfMission.howManyDaysAfter = 1;
					dataOfMission.title = "Briefer l'équipe";
					dataOfMission.icon = "";
					dataOfMission.titleDescription = "Le service après-vente sera solicité";
					dataOfMission.description = "Prévenir l'équipe permettrait aux agents d'être plus coopératif et à l'écoute des voyageurs.";
					dataOfMission.parameters[0].title = "-10mins";
					dataOfMission.parameters[0].descrition = "de conflits";
					dataOfMission.parameters[1].title = "+30%";
					dataOfMission.parameters[1].descrition = "de satisfaction";
					dataOfMission.parameters[2].title = "+50%";
					dataOfMission.parameters[2].descrition = "de sourires chez les voyageurs";
				case 'Alarming' :
					dataOfMission.id = "";
					dataOfMission.howManyDaysAfter = 1;
					dataOfMission.title = "Préparer une équipe";
					dataOfMission.icon = "";
					dataOfMission.titleDescription = "Préparer une équipe à l'aide des voyageurs";
					dataOfMission.description = "Une personne devra être dédiée à l'aide aux voyageurs lors de l'utilisation des bornes en cas d'erreur afin de faciliter le flux de vente.";
					dataOfMission.parameters[0].title = "-10mins";
					dataOfMission.parameters[0].descrition = "de files d'attente";
					dataOfMission.parameters[1].title = "+5%";
					dataOfMission.parameters[1].descrition = "de ventes";
					dataOfMission.parameters[2].title = "+75%";
					dataOfMission.parameters[2].descrition = "de sourires chez les voyageurs";	
					break;
				default :
					dataOfMission.id = "";
					dataOfMission.howManyDaysAfter = 3;
					dataOfMission.title = "Vérifier les bornes";
					dataOfMission.icon = "";
					dataOfMission.titleDescription = "Vérifier l'état des bornes";
					dataOfMission.description = "Vérifier l'état des machines en gare afin d'anticiper les problèmes possibles et l'affluence des voyageurs aux points de vente.";
					dataOfMission.parameters[0].title = "-20mins";
					dataOfMission.parameters[0].descrition = "de files d'attente";
					dataOfMission.parameters[1].title = "+20%";
					dataOfMission.parameters[1].descrition = "de ventes";
					dataOfMission.parameters[2].title = "+70%";
					dataOfMission.parameters[2].descrition = "de satisfaction chez les voyageurs";	
					break;
			}
			this.addMission(dataOfMission);
		};
	}
};

Dashboard.prototype.addMission = function(data){

	//TODO : faire aussi un test si cette Mission n'est pas déjà créées
	if(this.gauges.length > data.howManyDaysAfter){
		this.gauges[this.gauges.length - data.howManyDaysAfter -1].addMission(data);
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