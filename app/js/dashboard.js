'use_strict';

var Gauge = require('js/gauge');
var content = require('js/content');

function Dashboard(content, today){
	this.DOMWrapper = content;
	this.today = new Date(today);
	this.days = [];
	this.gauges = [];
	this.gaugeOpened = false;
	this.DOMGauges = false;
	this.DOMDates = false;
}

/*
 * Ajoute au DOM les gauges avec les données nessessaires sans les afiché et les activés. 
 */ 
Dashboard.prototype.insertGauges = function(datas){

	var DOMBoard = "";
	var todayTimeStamp = this.today.getTime();

	this.days = datas.datasByDays;

	for( var i = 0, j = this.days.length ; i < j ; i++){
		var gauge = new Gauge(datas.maxSells, this.days[i]);

		if(new Date(this.days[i].day).getTime() > todayTimeStamp){
			DOMBoard += gauge.createGauge(content.cst.ACTIVE);
		} else if(new Date(this.days[i].day).getTime() < todayTimeStamp) {
			DOMBoard += gauge.createGauge(content.cst.UNACTIVE);
		} else {
			DOMBoard += gauge.createGauge(content.cst.TODAY);
		}
		this.gauges.push(gauge);
	}

	this.DOMWrapper.innerHTML += DOMBoard;
	this.DOMGauges = document.getElementsByClassName('Gauge-wrapper');
	this.DOMDates = document.getElementsByClassName('Date');
};

/*
 * Crée l'animation pour afficher les gauges et ajoute les écouteurs nessessaires au gauges actives.
 */
Dashboard.prototype.showDashboard = function(nbrRemaining){
	var that = this;

	nbrRemaining = nbrRemaining || 0;

	this.gauges[nbrRemaining].addEvents(this.DOMGauges[nbrRemaining].parentNode,function(openedGauge){		console.log(that.gaugeOpened)
		if(that.gaugeOpened)
			that.gaugeOpened.close();
		that.gaugeOpened = openedGauge;
		for( i = 0, j = content.detailsStation.length ; i < j ; i++){
			content.detailsStation[i].classList.remove('fadeInRight');
			content.detailsStation[i].classList.remove('animated');
		}
		//TODO : résoudre bug d'asyncronisme (le dernié a toujours animated)
		setTimeout(function(){
			that.showDetailsValues();
		},50);
	});
	this.DOMGauges[nbrRemaining].className += " fadeInUp animated";
	this.DOMDates[nbrRemaining].className += " fadeInUp animated";


	if(nbrRemaining === this.gauges.length-1){
		//TODO : ouvrir la gauge de today
		return
	}
	nbrRemaining++;
	setTimeout(function(){
		that.showDashboard(nbrRemaining);
	},50);
};


Dashboard.prototype.showDetailsValues = function(nbrRemaining){
	var that = this;
	nbrRemaining = nbrRemaining || content.detailsStation.length;
	nbrRemaining--;
	content.detailsStation[nbrRemaining].className += " fadeInRight animated";
	if(nbrRemaining === 0)
		return
	setTimeout(function(){
		that.showDetailsValues(nbrRemaining);
	},200);
}

/* ##########
	PRIVATE
   ########## */






module.exports = Dashboard;