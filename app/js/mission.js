'use_strict';

function Mission(missionType, gaugeType, howManyDays){
	this.missionType = missionType;
	this.gaugeType = gaugeType;
	this.howManyDays = howManyDays;
	this.done = false;
	this.DOMMission = "";
}

/*
 * Ecrit dans le DOM une mission de prévention possible pour le jour
 */
Mission.prototype.createMission = function(){

	//TODO : en fonction du type de gauge et de l'mission prévue, créee du contenu DOM.


	return '<div class="Mission">'+
		'<button class="Mission-name">'+this.missionType+'</button>'+
		//'<svg class="Mission-target"></svg>'+
	'</div>';

};

Mission.prototype.addEvents = function(DOMMission){
	this.DOMMission = DOMMission;
	this.DOMMission.addEventListener('click',this.open);
}


Mission.prototype.open = function(e) {
	console.log("TODO");
	//TODO : donner cette méthode au header pour qui s'ouvre dans ses boutons.
	//TODO : appeller this.header.setValuesMissions()
};


Mission.prototype.close = function() {
	//this.DOMMission.removeEventListener('click',this.open);
};

Mission.prototype.addMission = function (type, ManyDaysBefore){

	//TODO : ajouter une mission possible a la gauge concernée par ManyDaysBefore si cette gauge n'a pas déjà une mission du même type.

	//TODO : ajouter une mission a faire sur la gauge actuelle. 
}

module.exports = Mission;