
var allFeatures = (function() { 

	var person_info_url = "https://torre.bio/api/people/sergiomg77";

    var init = function(){

        initPersonInfo();

    };

    var initPersonInfo = function(){

    	$.get(person_info_url, function(data, status){

    		if(status == 'success'){
    			console.log(data);

    			$("#personName").text(data.name);

    		}else{
    			console.log("No data !");
    		}

    	});

    }

    return {

        allinit: init

    };

})();

$(document).on('ready',allFeatures.allinit);
