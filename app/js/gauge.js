'use_strict';

var content = require('js/content');
var PreventiveActions = require('js/action');
var EventHandling = require('js/eventHandling');

function Gauge(gaugeMax, datas){
	this.gaugeMax = gaugeMax;
	this.day = new Date(datas.day);
	this.eventHandling = new EventHandling();
	this.crowd = -9999;
	this.automateSells = datas.automateSells;
	this.ticketWindowSells = datas.ticketWindowSells;
	this.dirsProblems = datas.dirsProblems;
	this.DOMGauge = "";
	this.DOMMissions = "";
	this.typeGauge = false;
	this.opened = false;
	this.preventiveActions = [];
	this.actionsToDo = [];
	this.missionsShowed = [];
	this.nbrOfMissions = "";
	this.nameOfMissions = "";
};

Gauge.prototype.createGauge = function(type){
	this.typeGauge = type;
	var hold = "";
	var today = "";
	var DOMMissionsPres = "";
	var totalSells = this.automateSells+this.ticketWindowSells;
	//TODO : afficher les gauges en fonction de l'affluence et non du prix. 
	var size = (totalSells/this.gaugeMax)*100;

	if(size < 0.5)
		size = 0.5;
	
	switch(this.typeGauge){
		case content.cst.UNACTIVE :
			hold = " hold";
			//TODO : nbrOfMissions deviens les actions qui ont été réaliser pour améliorer les jours actifs.
			//TODO : mettre les logos des actions réalisée.
			this.nbrOfMissions = this.actionsToDo.length+"/"+this.actionsToDo.length;
			this.nameOfMissions = "MISSIONS REALISEES";
			this.missionsShowed = this.actionsToDo;
			break;
		case content.cst.TODAY :
			today = " today";
			//TODO : mettre les logos des actions réalisée.
			this.nbrOfMissions = this.actionsToDo.length;
			this.nameOfMissions = "MISSIONS A FAIRE";
			this.missionsShowed = this.actionsToDo;
			break;
		case content.cst.ACTIVE :
			this.nbrOfMissions = this.preventiveActions.length;
			this.nameOfMissions = "MISSIONS POSSIBLES";
			this.missionsShowed = this.preventiveActions;
			break;
		default :
			console.log("error");
			break
	}

	for (var i = 0; i < this.missionsShowed.length; i++) {
		DOMMissionsPres += this.missionsShowed[i].createAction();
	};

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
				'<div class="Infos-number">'+this.nbrOfMissions+'</div>'+
				'<div class="Infos-text">'+this.nameOfMissions+'</div>'+
			'</div>'+
			'<div class="Infos-wrapper">'+
				DOMMissionsPres+
			'</div>'+
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

	this.DOMMissions = this.DOMGauge.getElementsByClassName('Mission');
	if(this.DOMMissions.length > 0){
		this.showMissions();
	}

	content.nbrCrowds.innerHTML = new Intl.NumberFormat().format(this.crowd);
	content.nbrAutomateSells.innerHTML = new Intl.NumberFormat().format(this.automateSells);
	content.nbrTicketWindowSells.innerHTML = new Intl.NumberFormat().format(this.ticketWindowSells);
	content.nbrMissions.innerHTML = this.nbrOfMissions;
	content.missionType.innerHTML = this.nameOfMissions;

	showDetailsFct(this);
};

Gauge.prototype.close = function(){
	var that = this;
	var DOMInfo = this.DOMGauge.querySelector('.Infos');
	this.opened = false;
	this.DOMGauge.classList.remove('opened');
	DOMInfo.classList.remove('opened');
	this.eventHandling.addTransitionendEvent(DOMInfo, function(e){
		DOMInfo.querySelector('.Infos-wrapper').classList.remove('hide');

		if(that.DOMMissions.length > 0){
			that.closeMissions();	
		}
	}, true);		
}

Gauge.prototype.addPreventionAction = function(type, manyDaysBefore) {
	this.preventiveActions.push(new PreventiveActions(type, "PreventiveAction", manyDaysBefore));
};

Gauge.prototype.addActionToDo = function(type, manyDaysAfter) {
	this.actionsToDo.push(new PreventiveActions(type, "actionToDo", manyDaysAfter));
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

Gauge.prototype.showMissions = function(nbrRemaining){
	var that = this;
	nbrRemaining = nbrRemaining || this.DOMMissions.length;
	nbrRemaining--;
	this.missionsShowed[nbrRemaining].showAction(this.DOMMissions[nbrRemaining]);
	if(nbrRemaining === 0)
		return
	setTimeout(function(){
		that.showMissions(nbrRemaining);
	},200);
};

Gauge.prototype.closeMissions = function() {
	for (var i = 0; i < this.missionsShowed.length; i++) {
		this.missionsShowed[i].close();
	};
};

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