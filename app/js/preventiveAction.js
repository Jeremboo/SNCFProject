'use_strict';

function PreventiveAction(){
	
}

/*
 * Ecrit dans le DOM une action de prévention possible pour le jour
 */
PreventiveAction.prototype.createPreventiveAction = function(actionType, gaugeType){

	//TODO : en fonction du type de gauge et de l'action prévue, créee du contenu DOM.



	return '';

};

PreventiveAction.prototype.addAction = function (type, ManyDaysBefore){

	//TODO : ajouter une action possible a la gauge concernée par ManyDaysBefore si cette gauge n'a pas déjà une action du même type.

	//TODO : ajouter une action a faire sur la gauge actuelle. 
}

module.exports = PreventiveAction;