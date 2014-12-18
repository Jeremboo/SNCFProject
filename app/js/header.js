'use_strict';

var content = require('js/content');

function Header(){
	this.missionsValuesShowed = false;
}

/* 
 * Ajoute les évènements
 */
Header.prototype.addEvent = function(){
	var that = this;

	content.showMissions.addEventListener('click',function(e){
		if(!that.missionsValuesShowed){
			that.showMissionsValues();
		} else {
			that.hideMissionsValues();
		}
	});

	content.veil.addEventListener('click',this.hideMissionsValues);

	content.validateMission.addEventListener('click',this.hideMissionsValues);
};

/* ####################
	SHOW & HIDE
   #################### */


/* ##
 * Affiche le titre du header
 */
Header.prototype.showTitle = function(title) {
	content.stationTitle.innerHTML = title;
	content.stationTitle.className += " fadeInDown animated";
};


/* ##
 * Affiche l'enssemble des valeurs du header destinées à la gauge ouverte
 */
Header.prototype.showGaugeValues = function() {
	content.dateSelected.classList.add('fadeInDown');
	this.showDetailsValues();
};

/*
 * Cache l'enssemble des valeurs du header destinées à la gauge ouverte
 */
Header.prototype.hideGaugeValues = function() {
	for( i = 0, j = content.detailsStation.length ; i < j ; i++){
		content.detailsStation[i].classList.remove('fadeInRight');
	}
	content.dateSelected.innerHTML = "";
	content.dateSelected.classList.remove('fadeInDown');
};


/* ##
 * Affihce de facon saccadée les valeurs détails du header (à droite)
 */
Header.prototype.showDetailsValues = function(nbrRemaining) {

	var that = this;
	nbrRemaining = nbrRemaining || content.detailsStation.length;
	nbrRemaining--;
	content.detailsStation[nbrRemaining].classList.add("fadeInRight");
	if(nbrRemaining === 0)
		return
	setTimeout(function(){
		that.showDetailsValues(nbrRemaining);
	},200);
};


/*
 * Affiche le tableau de détail des missions
 */
 Header.prototype.showMissionsValues = function() {

 	content.header.className += " missionOpened";
 	content.showMissions.className += " close";
 	content.headerMissions.classList.remove('hide');
 	content.veil.classList.remove('hide');
 	this.missionsValuesShowed = true;
 };

 /* ##
 * Cache le tableau de détail des missions
 */
 Header.prototype.hideMissionsValues = function() {

 	content.header.classList.remove('missionOpened');
 	content.showMissions.classList.remove("close");
 	content.headerMissions.className += " hide";
 	content.veil.className += ' hide';
 	this.missionsValuesShowed = false;
 };



/* ####################
	GETTERS & SETTERS
   #################### */

/*
 * Remplit les détails des valeurs de la gauge.
 */
Header.prototype.setValuesGauge = function(nbrMissions, missionName, nbrTicketWindowSells, nbrAutomateSells, nbrCrowds, dateSelected) {
	content.nbrMissions.innerHTML = nbrMissions;
	content.missionType.innerHTML = missionName;
	content.nbrCrowds.innerHTML = new Intl.NumberFormat().format(nbrCrowds);
	content.nbrAutomateSells.innerHTML = new Intl.NumberFormat().format(nbrAutomateSells);
	content.nbrTicketWindowSells.innerHTML = new Intl.NumberFormat().format(nbrTicketWindowSells);
	content.dateSelected.innerHTML = dateSelected;
};

/*
 * Remplit les détails des valeurs de mission
 */
Header.prototype.setMissionsValues = function(title, icon, titleDescription, description, parameters) {
	content.missionTitle.innerHTML = title;
	content.missionIcon.className = "MissionHeader-missionIcon "+icon;
	content.missionTitleDescription.innerHTML = titleDescription;
	content.missionDescription.innerHTML = description;
	for (var i = 0; i < content.missionsParameterTitle.length; i++) {
		console.log(parameters);
		content.missionsParameterTitle[i].innerHTML = parameters[i].title;
		content.missionsParameterDescription[i].innerHTML = parameters[i].description;
	};
};


module.exports = Header;