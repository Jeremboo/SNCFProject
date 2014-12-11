'use_strict';

function AjaxRequest(){
	this.request = new XMLHttpRequest();
	this.errorServer = "Il y a une erreur avec l'ajax";
}

AjaxRequest.prototype.post = function(params, callback){

	var datas;
	var err = "";
	var that = this;

	if(callback){
		if(params.datas){
			datas = JSON.stringify(params.datas);
		}
		this.request.open("POST", params.url, true);
		this.request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		this.request.send(datas);

		this.request.onreadystatechange = function(e) {
			if(that.request.readyState == 4){
				var result = JSON.parse(that.request.response);
				callback(result.err, result.datas);
			}
		};
	}
};

module.exports = AjaxRequest;