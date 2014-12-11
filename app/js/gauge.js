'use_strict';

var content = require('js/content');

function Gauge(gaugeMax, datas){
	this.gaugeMax = gaugeMax;
	this.day = new Date(datas.day);
	this.crowd = 
	this.automateSells = datas.automateSells;
	this.ticketWindowSells = datas.ticketWindowSells;
	this.dirsProblems = datas.dirsProblems;

	this.typeGauge = false;

};

Gauge.prototype.createGauge = function(type){
	this.typeGauge = type;
	var hold = "";
	var today = "";
	//TODO : afficher les gauges en fonction de l'affluence et non du prix. 
	var size = ((this.automateSells+this.ticketWindowSells)/this.gaugeMax)*100;

	if(size < 0.5)
		size = 0.5;
	
	switch(this.typeGauge){
		case content.cst.UNACTIVE :
			hold = " hold";
			break;
		case content.cst.TODAY :
			today = " today";
			break;
		case content.cst.ACTIVE :
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
		'<div class="Gauge-date Date'+today+'">'+
			'<div class="Date-day">'+this.selectDateName(this.day.getDay())+'</div>'+
			'<div class="Date-number">'+this.day.getDate()+'</div>'+
		'</div>'+
	'</div>';
}

Gauge.prototype.addEvents = function(DOMGauge, showDetailsFct){
	var that = this;
	this.DOMGauge = DOMGauge;
	DOMGauge.addEventListener('click',function(){
		that.open(showDetailsFct);
	});
	//TODO bien faire la séparation de la gauge, si c'est une vieille ou une nouvelle pur ajouter les écouteurs.
};

Gauge.prototype.open = function(showDetailsFct){
	this.DOMGauge.classList.add('opened');
	content.nbrCrowds.innerHTML = 1000;
	content.nbrAutomateSells.innerHTML = this.automateSells;
	content.nbrTicketWindowSells.innerHTML = this.ticketWindowSells;

	//TODO : faire la diff des gauges pour les différentes actions (passé,today,futur)
	content.nbrMissions.innerHTML = 5;
	content.missionType = "MISSIONS";

	showDetailsFct(this);
};


Gauge.prototype.close = function(){
	console.log("removing")
	this.DOMGauge.classList.remove('opened');
}


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