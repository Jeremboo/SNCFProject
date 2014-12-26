'use_strict';

var Header = require('js/header');

function Mission(data){

	this.header = new Header();

	this.data = data;

	this.missionType = data.id;
	this.howManyDaysAfter = data.howManyDaysAfter;
	this.title = data.title;
	this.icon = data.icon;
	this.titleDescription = data.titleDescription;
	this.description = data.description;
	this.parameters = data.parameters;

	this.done = false;
	this.DOMMission = "";
}

/*
 * Ecrit dans le DOM une mission de prévention possible pour le jour
 */
Mission.prototype.createMission = function(){

	return '<div class="Mission">'+
		'<button class="Mission-name">'+this.title+'</button>'+
	'</div>';

};

/*
 * Créer la partie SVG des missions (les flèches)
 */
Mission.prototype.createSVG = function() {
	var gaugeSize = document.getElementsByClassName('Gauge')[0].offsetWidth;
	var widthStoke = gaugeSize*this.howManyDaysAfter-(gaugeSize/2);
	var DOMSVG = '<svg class="Mission-target" height="'+gaugeSize*this.howManyDaysAfter+'" width="500">'+
		  '<line x1="7" y1="0" x2="'+widthStoke+'" y2="0" style="stroke:rgb(255,255,255);stroke-width:1" />'+
		  '<line x1="'+widthStoke+'" y1="0" x2="'+widthStoke+'" y2="30" style="stroke:rgb(255,255,255);stroke-width:1" />'+
		'</svg>';
	this.DOMMission.innerHTML += DOMSVG;
};

/*
 * Ajoute les évènements sur les missions
 */
Mission.prototype.addEvents = function(DOMMission){
	var that = this;
	this.DOMMission = DOMMission;
	this.createSVG(); //a replacer
	this.DOMMission.addEventListener('click',function(){
		that.header.setMissionsValues(that.title, that.icon, that.titleDescription, that.description, that.parameters);
		that.header.showMissionsValues();
	});
};


module.exports = Mission;