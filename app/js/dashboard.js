'use_strict';

var Gauge = require('js/gauge');
var PretentiveActions = ('js/preventiveActions');
var content = require('js/content');

function Dashboard(content, today){
	this.DOMWrapper = content;
	this.today = new Date(today);
	this.days = [];
	this.gauges = [];
	this.numberOfTodaysGauge = -1;
	this.openGauge = false;
	this.DOMGauges = false;
	this.DOMDates = false;
}

/*
 * Ajoute au DOM les gauges avec les données nessessaires sans les afiché et les activés. 
 */ 
Dashboard.prototype.createDashboard = function(datas){

	var DOMBoard = "";
	var todayTimeStamp = this.today.getTime();

	this.days = datas.datasByDays;

	for( var i = 0, j = this.days.length ; i < j ; i++){
		var that = this;
		var gauge = new Gauge(datas.maxCrowds, datas.maxSells, this.days[i]);

		this.searchPreventiveActions(gauge, function(){

			if(new Date(that.days[i].day).getTime() > todayTimeStamp){
				DOMBoard += gauge.createGauge(content.cst.ACTIVE);
			} else if(new Date(that.days[i].day).getTime() < todayTimeStamp) {
				that.numberOfTodaysGauge = i+1;
				DOMBoard += gauge.createGauge(content.cst.UNACTIVE);
			} else {
				DOMBoard += gauge.createGauge(content.cst.TODAY);
			}
			that.gauges.push(gauge);
		});	
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

	this.gauges[nbrRemaining].addEvents(this.DOMGauges[nbrRemaining].parentNode,function(openGauge){
		if(that.openGauge)
			that.openGauge.close();
		that.openGauge = openGauge;
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
		this.openGaugeForToday();
		//TODO : n'activer les rollOver et les click qu'a ce moment la.
		return
	}
	nbrRemaining++;
	setTimeout(function(){
		that.showDashboard(nbrRemaining);
	},50);
};


/* ##########
	PRIVATE
   ########## */

/*
 * Recherche les actions possibles sur la gauge donnée et ajoute ces actions aux gauges concernées ainsi qu'a la gauge active 
 */
Dashboard.prototype.searchPreventiveActions = function(gauge, callback){

	//TODO : faire les test qui permettent de définir quelles actions sont possibles et quand

	var dirsProblems = gauge.getDirsProblems();
	
	if(dirsProblems.length > 0){
		for (var i = dirsProblems.length - 1; i >= 0; i--) {
			switch(dirsProblems[i].categorisationTheme){
				case 'Vente' :
					this.addAction(gauge, 'problème de vente', 5);
					break;
				case 'Matériel' :
					this.addAction(gauge, 'problème matériel', 5);
					break;
				case 'Applicatif' :
					this.addAction(gauge, 'problème applicatif', 5);
					break;
				case 'Après-vente' :
					this.addAction(gauge, "problème d'après vente", 5);
					break;
				default :
					this.addAction(gauge, 'Problème inconnue', 5);
					break;
			}
		};
	}

	callback();
};

Dashboard.prototype.addAction = function(gauge, type, manyDaysBefore){

	gauge.addPreventionAction(type,manyDaysBefore);

	if(this.gauges.length > manyDaysBefore){
		this.gauges[manyDaysBefore-1].addActionToDo(type,manyDaysBefore);
	}
}

Dashboard.prototype.openGaugeForToday = function(){

	var that = this;

	this.gauges[this.numberOfTodaysGauge].open(function(openGauge){
		that.openGauge = openGauge;
		that.showDetailsValues();
	});
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
};




module.exports = Dashboard;