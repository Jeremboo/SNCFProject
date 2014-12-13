'use_strict';

var content = require('js/content');
var PreventiveAction = require('js/preventiveAction');
var EventHandling = require('js/eventHandling');

function Gauge(gaugeMax, datas){
	this.gaugeMax = gaugeMax;
	this.day = new Date(datas.day);
	this.eventHandling = new EventHandling();
	this.preventiveAction = new PreventiveAction();
	this.crowd = -9999;
	this.automateSells = datas.automateSells;
	this.ticketWindowSells = datas.ticketWindowSells;
	this.dirsProblems = datas.dirsProblems;
	this.typeGauge = false;
	this.opened = false;
	this.preventionActions = [];
	this.actionsToDo = [];
};

Gauge.prototype.createGauge = function(type){
	this.typeGauge = type;
	var hold = "";
	var today = "";
	var nbrOfMissions = "";
	var nameOfMissions = "";
	var DOMMissionsPresentation = "";
	var totalSells = this.automateSells+this.ticketWindowSells;
	//TODO : afficher les gauges en fonction de l'affluence et non du prix. 
	var size = (totalSells/this.gaugeMax)*100;

	if(size < 0.5)
		size = 0.5;
	
	switch(this.typeGauge){
		case content.cst.UNACTIVE :
			hold = " hold";
			//TODO : nbrOfMissions deviens les actions qui ont été réaliser pour améliorer les jours actifs.
			nbrOfMissions = this.actionsToDo.length+"/"+this.actionsToDo.length;
			nameOfMissions = "MISSIONS REALISEES";
			//TODO : utiliser this.preventionAction pour ajouter du contenu au DOM.
			break;
		case content.cst.TODAY :
			today = " today";
			nbrOfMissions = this.actionsToDo.length;
			nameOfMissions = "MISSIONS A FAIRE";
			//TODO : utiliser this.preventionAction pour ajouter du contenu au DOM.
			break;
		case content.cst.ACTIVE :
			nbrOfMissions = this.preventionActions.length;
			nameOfMissions = "MISSIONS POSSIBLES";
			//TODO : utiliser this.preventionAction pour ajouter du contenu au DOM.
			break;
		default :
			console.log("error");
			break
	}

	//TODO : faire une séparation pour les mois
	return '<div class="Dashboard-gauge Gauge'+hold+'">'+
		'<div class="Gauge-wrapper">'+
			'<div class="Gauge-gauge" style="height:'+size+'%"></div>'+
		'</div>'+
		'<div class="Gauge-infos Infos">'+
			'<div class="Infos-wrapper">'+
				'<div class="Infos-number">'+new Intl.NumberFormat().format(totalSells)+'</div>'+
				'<div class="Infos-text">EUROS DE VENTES</div>'+
			'</div>'+
			'<div class="Infos-wrapper">'+
				'<div class="Infos-number">'+nbrOfMissions+'</div>'+
				'<div class="Infos-text">'+nameOfMissions+'</div>'+
			'</div>'+
			DOMMissionsPresentation+
		'</div>'+
		'<div class="Gauge-date Date'+today+'">'+
			'<div class="Date-day">'+this.selectDateName(this.day.getDay())+'</div>'+
			'<div class="Date-number">'+this.day.getDate()+'</div>'+
		'</div>'+
	'</div>';
}

Gauge.prototype.addEvents = function(DOMGauge, showDetailsFct){
	var that = this;
	this.DOMGauge = DOMGauge;
	DOMGauge.addEventListener('click',function(e){
		if(!that.opened)
			that.open(showDetailsFct);
	});
	//TODO bien faire la séparation de la gauge, si c'est une vieille ou une nouvelle pour ajouter les écouteurs.
};

Gauge.prototype.open = function(showDetailsFct){
	this.opened = true;
	this.DOMGauge.classList.add('opened');
	this.DOMGauge.querySelector('.Infos').classList.add('opened');
	this.DOMGauge.querySelector('.Infos-wrapper').classList.add('hide');

		//TODO : afficher la DIV du DOM qui contient les missions et leurs noms.

	content.nbrCrowds.innerHTML = new Intl.NumberFormat().format(this.crowd);
	content.nbrAutomateSells.innerHTML = new Intl.NumberFormat().format(this.automateSells);
	content.nbrTicketWindowSells.innerHTML = new Intl.NumberFormat().format(this.ticketWindowSells);

	content.nbrMissions.innerHTML = 5;
	content.missionType = "MISSIONS";

	showDetailsFct(this);
};


Gauge.prototype.close = function(){
	var DOMInfo = this.DOMGauge.querySelector('.Infos');
	this.opened = false;
	this.DOMGauge.classList.remove('opened');
	DOMInfo.classList.remove('opened');
	this.eventHandling.addTransitionendEvent(DOMInfo, function(e){
		DOMInfo.querySelector('.Infos-wrapper').classList.remove('hide');
	}, true);		
}

Gauge.prototype.addPreventionAction = function(type, manyDaysBefore) {
	console.log("PreventionActionAdded");
	//TODO : ajouter cette action dans un tableau qui permettra de voir les actions possibles les jours précédents pour améliorer celui-ci.
	this.preventionActions.push({
		actionType : type,
		manyDaysBefore : manyDaysBefore,
		done : false
	});
};

Gauge.prototype.addActionToDo = function(type,manyDaysAfter) {
	console.log("ActionToDoAdded");
	//TODO : Ajouter cette action dans un tableau qui permettra de voir les actions possibles a faire ce jours pour améliorer les jours suivants.
	this.actionsToDo.push({
		actionType : type,
		manyDaysAfter : manyDaysAfter,
		done : false
	});
};

/* 
	GETTERS & SETTERS
 */

Gauge.prototype.getDirsProblems = function() {
	return this.dirsProblems;
};

/*
	PRIVATE 
*/

Gauge.prototype.selectDateName = function(day){
	switch(day){
		case 0 :
			return "LUN";
		case 1 :
			return "MAR";
		case 2 :
			return "MER";
		case 3 :
			return "JEU";
		case 4 :
			return "VEN";
		case 5 :
			return "SAM";
		case 6 :
			return "DIM";
		default :
			return "NaN";
	}
}

module.exports = Gauge;