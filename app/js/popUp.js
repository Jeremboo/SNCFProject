'use_strict'

var EventHandling = require('js/eventHandling');


function PopUp(popUp){
	this.popUp = popUp;
	this.eventHandling = new EventHandling();

}

PopUp.prototype.showPopUp = function() {
	this.popUp.classList.remove("hidden");
	this.popUp.classList.remove('hide');
};

PopUp.prototype.hidePopUp = function(callback) {
	var that = this;
	this.popUp.classList.add('hide');
	this.eventHandling.addTransitionendEvent(this.popUp, function(e){
		that.popUp.classList.add("hidden");
		if(callback)
			callback();
	});
};

module.exports = PopUp;