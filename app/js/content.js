
module.exports = {
	cst : {
		UNACTIVE : 0,
		ACTIVE : 1,
		TODAY : 2,
	},
	autocompleZone : document.getElementById('autocomplete-station'),
	popupConnexion : document.getElementById('popup-connexion'),
	errorConnexion : document.getElementById('error-connexion'),
	loader : document.getElementById('loader'),

	stationTitle : document.getElementById('station-name'),

	detailsStation : document.getElementsByClassName('DetailStation'),
	dateSelected : document.getElementById('date-selected'),
	nbrCrowds : document.getElementById('nbr-crowds'),
	nbrAutomateSells : document.getElementById('nbr-automatesells'),
	nbrTicketWindowSells : document.getElementById('nbr-ticketwindowsells'),
	nbrMissions : document.getElementById('nbr-missions'),
	missionType : document.getElementById('mission-type'),

	showMissions : document.getElementById('show-mission'),
	headerMissions : document.getElementById('header-missions'),
	veil : document.getElementById('veil'),

	dashboardWrapper : document.getElementById('dashboard-wrapper'),
	taux : document.getElementById('taux'),
	maxCrowds : document.getElementById('max-crowds'),
	maxSells : document.getElementById('max-sells')
};