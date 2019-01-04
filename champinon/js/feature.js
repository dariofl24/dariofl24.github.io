
var allFeatures = (function() { 

	var person_info_url = "https://torre.bio/api/people/sergiomg77";

    var init = function(){

        initPersonInfo();

    };

    var initPersonInfo = function(){

    	$.get(person_info_url, function(data, status){

    		if(status == 'success'){
    			console.log(data);

    			$("#personPhoto").attr("src",data.picture);
    			$("#personName").text(data.name);
    			$("title").text(data.name);
    			$("#personProfession").html("<i class=\"fa fa-briefcase fa-fw w3-margin-right w3-large w3-text-teal\"></i>"+data.professionalHeadline);
    			$("#personEmail").html("<i class=\"fa fa-envelope fa-fw w3-margin-right w3-large w3-text-teal\"></i>"+data.email);
    			$("#personLocation").html("<i class=\"fa fa-home fa-fw w3-margin-right w3-large w3-text-teal\"></i>"+data.location);
    			


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
