'use_strict';

function EventHandling(){
	this.tabClass = [];
}

/*
 * Ajoute un écouteur d'évènement de fin de TransitionCSS sur l'élément envoyé   
 */
EventHandling.prototype.addTransitionendEvent = function(element, fct){

	//'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend'

	if('transitionend' in document.documentElement){
		element.addEventListener('transitionend',function(e){
			fct(e)
		},false);
	} else {
		console.warn("Your navigator may be not support transitionend event");
		element.addEventListener('webkitTransitionEnd',function(e){
			fct(e)
		},false);
	}
};



//TODO 
/*
 * Permet d'ajouter un évènement à toutes les balises ayant le nom d'une class
 */
EventHandling.prototype.delegateEventForTabClass = function(e){

	e = e || window.event;
    var target = e.target || e.srcElement;

    console.log(e);
    if (target.className.match(/keyword/)){
        //an element with the keyword Class was clicked
    }
}

EventHandling.prototype.addClassForEvent = function(className){
	if(this.tabClass.indexOf(className) >= 0){
		this.tabClass.push(className);
	} else {
		console.error("className already in the TabClass");
	}
}

EventHandling.prototype.removeClassForEvent = function(className){
	if(this.tabClass.indexOf(className) >= 0){
		this.tabClass.push(className);
	} else {
		console.error("className is not in the TabClass");
	}
}

module.exports = EventHandling;