'use_strict';

function Action(actionType, gaugeType, howManyDays){
	this.actionType = actionType;
	this.gaugeType = gaugeType;
	this.howManyDays = howManyDays;
	this.done = false;
	this.DOMMission = "";
}

/*
 * Ecrit dans le DOM une action de prévention possible pour le jour
 */
Action.prototype.createAction = function(){

	//TODO : en fonction du type de gauge et de l'action prévue, créee du contenu DOM.


	return '<div class="Mission">'+
		'<button class="Mission-name">'+this.actionType+'</button>'+
		//'<svg class="Mission-target"></svg>'+
	'</div>';

};

Action.prototype.addEvents = function(DOMMission){
	this.DOMMission = DOMMission;
	this.DOMMission.addEventListener('click',this.open);
}


Action.prototype.open = function(e) {
	console.log("TODO");
	//TODO : donner cette méthode au header pour qui s'ouvre dans ses boutons.
	//TODO : appeller this.header.setValuesMissions()
};


Action.prototype.close = function() {
	//this.DOMMission.removeEventListener('click',this.open);
};

Action.prototype.addAction = function (type, ManyDaysBefore){

	//TODO : ajouter une action possible a la gauge concernée par ManyDaysBefore si cette gauge n'a pas déjà une action du même type.

	//TODO : ajouter une action a faire sur la gauge actuelle. 
}

module.exports = Action;