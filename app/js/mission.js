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

	//TODO : faire le SVG.

	return '<div class="Mission">'+
		'<button class="Mission-name">'+this.title+'</button>'+
		//'<svg class="Mission-target"></svg>'+
	'</div>';

};

Mission.prototype.addEvents = function(DOMMission){
	var that = this;
	this.DOMMission = DOMMission;
	this.DOMMission.addEventListener('click',function(){

		that.header.setMissionsValues(that.title, that.titleDescription, that.description, that.parameters);
		that.header.showMissionsValues();
	});
}


Mission.prototype.open = function(e) {
	console.log(this);
	this.header.showMissionsValues();
	//TODO : donner cette méthode au header pour qui s'ouvre dans ses boutons.
	//TODO : appeller this.header.setValuesMissions()
};

Mission.prototype.close = function() {
	//this.DOMMission.removeEventListener('click',this.open);
};


module.exports = Mission;