'use_strict';

var content = require('js/content');
var Header = require('js/header');
var Mission = require('js/mission');
var EventHandling = require('js/eventHandling');

function Gauge(gaugeMax, sellsMax, datas){
	this.gaugeMax = gaugeMax;
	this.gaugeSellMax = sellsMax;
	this.day = new Date(datas.day);
	this.eventHandling = new EventHandling();
	this.header = new Header();
	this.crowds = datas.crowds;
	this.automateSells = datas.automateSells;
	this.ticketWindowSells = datas.ticketWindowSells;
	this.dirsProblems = datas.dirsProblems;
	this.DOMGauge = "";
	this.DOMMissions = "";
	this.typeGauge = false;
	this.opened = false;
	this.preventiveMissions = [];
	this.missionsToDo = [];
	this.missionsShowed = [];
	this.nbrOfMissions = "";
	this.nameOfMissions = "";
};

/*
 * Créer les balises d'une gauge avec les valeurs intégrées en fonction du type de Gauge (UNACTIVE/TODAY/ACTIVE)
 */ 
Gauge.prototype.createGauge = function(type){
	this.typeGauge = type;
	var hold = "";
	var today = "";
	var level = "";
	var DOMMissionsPres = "";
	var totalSells = this.automateSells+this.ticketWindowSells; 
	var sizeCrowds = (this.crowds/this.gaugeMax)*100;
	var sizeSells = (totalSells/this.gaugeSellMax)*100;

	if(sizeCrowds < 0.5)
		sizeCrowds = 0.5;
	if(sizeSells < 0.5)
		sizeSells = 0.5;
	
	switch(this.typeGauge){
		case content.cst.UNACTIVE :
			hold = " hold";
			//TODO : nbrOfMissions deviens les missions qui ont été réaliser pour améliorer les jours actifs.
			//TODO : mettre les logos des missions réalisée.
			this.nbrOfMissions = this.missionsToDo.length+"/"+this.missionsToDo.length;
			this.nameOfMissions = "MISSIONS REALISEES";
			this.missionsShowed = this.missionsToDo;
			break;
		case content.cst.TODAY :
			today = " today";
			//TODO : mettre les logos des missions réalisée.
			this.nbrOfMissions = this.missionsToDo.length;
			this.nameOfMissions = "MISSIONS A FAIRE";
			this.missionsShowed = this.missionsToDo;
			break;
		case content.cst.ACTIVE :
			this.nbrOfMissions = this.preventiveMissions.length;
			this.nameOfMissions = "MISSIONS POSSIBLES";
			this.missionsShowed = this.preventiveMissions;
			break;
		default :
			console.log("error");
			break
	}

	if(this.nbrOfMissions < 5){
		level = " level-"+this.nbrOfMissions;
	} else {
		level = " level-max"
	}

	for (var i = 0; i < this.missionsShowed.length; i++) {
		DOMMissionsPres += this.missionsShowed[i].createMission();
	};

	//TODO : faire une séparation pour les mois
	return '<div class="Dashboard-gauge Gauge'+hold+'">'+
		'<div class="Gauge-wrapper">'+
			'<div class="Gauge-gaugeSells'+level+'" style="height:'+sizeSells+'%"></div>'+
			'<!--<div class="Gauge-gaugeCrowds" style="height:'+sizeCrowds+'%"></div>-->'+
		'</div>'+
		'<div class="Gauge-infos Infos">'+
			'<div class="Infos-hover animated">'+
				'<div class="Infos-wrapper">'+
					'<div class="Infos-number">'+new Intl.NumberFormat().format(totalSells)+'</div>'+
					'<div class="Infos-text">EUROS DE VENTES</div>'+
				'</div>'+
				'<div class="Infos-wrapper">'+
					'<div class="Infos-number">'+new Intl.NumberFormat().format(this.crowds)+'</div>'+
					'<div class="Infos-text">VOYAGEURS</div>'+
				'</div>'+
				'<div class="Infos-wrapper">'+
					'<div class="Infos-number'+level+'">'+this.nbrOfMissions+'</div>'+
					'<div class="Infos-text">'+this.nameOfMissions+'</div>'+
				'</div>'+
			'</div>'+
			'<div class="Infos-click hide animated">'+
				'<div class="Infos-wrapper">'+
					'<div class="Infos-number">'+this.nbrOfMissions+'</div>'+
					'<div class="Infos-text">'+this.nameOfMissions+'</div>'+
				'</div>'+
				'<div class="Infos-wrapper">'+
					DOMMissionsPres+
				'</div>'+
			'</div>'+
		'</div>'+
		'<div class="Gauge-date Date'+today+'">'+
			'<div class="Date-day">'+this.selectDateName(this.day.getDay())+'</div>'+
			'<div class="Date-number">'+this.day.getDate()+'</div>'+
		'</div>'+
	'</div>';
};

/*
 * Apellée une fois la gauge dans le DOM, elle permet d'y ajouter mes écouteurs d'évènements propre à celle-ci (gauge, missions...)
 */ 
Gauge.prototype.addEvents = function(DOMGauge, callbackGaugeOpened){

	this.DOMGauge = DOMGauge;

	var that = this;
	var DOMMissions = this.DOMGauge.getElementsByClassName('Mission');

	this.DOMGauge.addEventListener('click',function(e){
		if(!that.opened)
			that.open(callbackGaugeOpened);
	});

	//Ecouteur sur les boutons missions
	for (var i = 0; i < DOMMissions.length; i++) {
		this.missionsShowed[i].addEvents(DOMMissions[i]);
	};
};

/*
 * Lorsque l'on clique sur la gauge, missionne la methode du dashboard en callback qui affiche les données du header.
 */ 
Gauge.prototype.open = function(callbackGaugeOpened){
	this.opened = true;
	var that = this;
	var DOMInfo = this.DOMGauge.querySelector('.Infos');
	
	//Infos sur gauge
	this.DOMGauge.classList.add('opened');
	DOMInfo.classList.add('opened');
	DOMInfo.querySelector('.Infos-hover').classList.add('fadeOutLeft');
	DOMInfo.querySelector('.Infos-click').classList.remove('hide');
	DOMInfo.querySelector('.Infos-click').classList.add('fadeInRight');

	// Affiche les valeurs dans le Header
	this.header.hideGaugeValues();
	//WARNING : résoudre bug d'asyncronisme (le dernié a toujours animated)
	setTimeout(function(){

		//nbrMissions, missionName, nbrTicketWindowSells, nbrAutomateSells, nbrCrowds, dateSelected
		that.header.setValuesGauge(that.nbrOfMissions, that.nameOfMissions, that.ticketWindowSells, that.automateSells, that.crowds, that.decodeDate(that.day));
		that.header.showGaugeValues();
	},50);
	
	//Callback pour la gestion de la gauge déjà ouverte
	callbackGaugeOpened(this);
};

/*
 * Applellée par le DashBoard quand une autre gauge est ouverte.
 */
Gauge.prototype.close = function(){
	var that = this;
	var DOMInfo = this.DOMGauge.querySelector('.Infos');
	this.opened = false;
	this.DOMGauge.classList.remove('opened');
	DOMInfo.classList.remove('opened');
	this.eventHandling.addTransitionendEvent(DOMInfo, function(e){

		DOMInfo.querySelector('.Infos-hover').classList.remove('fadeOutLeft');
		DOMInfo.querySelector('.Infos-click').classList.remove('fadeInRight');
		DOMInfo.querySelector('.Infos-click').classList.add('hide');

	}, true);		
}

/*
 * Ajouter à la guage une mission préventive (celle qui est prévue pour améliorée ce jour)
 * WARNING : puet être inutile. 
 */
Gauge.prototype.addPreventionMission = function(type, manyDaysBefore) {
	this.preventiveMissions.push(new Mission(type, "PreventiveMission", manyDaysBefore));
};

/*
 * Applellée par le DashBoard quand une autre gauge est ouverte.
 */
Gauge.prototype.addMissionToDo = function(type, manyDaysAfter) {
	this.missionsToDo.push(new Mission(type, "missionToDo", manyDaysAfter));
};

/* ####################
	GETTERS & SETTERS
   #################### */

/*
 * Retourne les dossiers de problèmes de la gauge.
 */
Gauge.prototype.getDirsProblems = function() {
	return this.dirsProblems;
};

/* ###########
	PRIVATE 
   ########### */

/*
 * Retourne une date bien formatée.
 */
Gauge.prototype.decodeDate = function(day){
    year = day.getFullYear();

    month = day.getMonth() + 1;
    if(month < 10) {
		month = "0" + month ;
    }

    day = day.getDate()
    if(day < 10){
    	day = "0" + day;
    }

    return day+"/"+month+"/"+year;
}

/*
 * Retourne un diminutif du jour de la semaine.
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