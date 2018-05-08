var allFeatures = (function() {

	var $cache = {};

	var init = function() {

		initCache();
		bindEvents();
		fillForm();
	};

	var initCache = function() {

		$cache.modelInfoForm = $("#modelInfoForm");

		$cache.plusText = $("#plus_text");
		$cache.plusImgs = $("#plus_imgs");

		$cache.textInTemplate = $("#text_input_template");
		$cache.imgsInTemplate = $("#image_input_template");

		$cache.textsList = $("#texts_list");
		$cache.imgsList = $("#imgs_list");

		$cache.textInSettings = {
			li_id : 2
		};

		$cache.imgsInSettings = {
			li_id : 2
		};

		$cache.modelId = $("#id");
		$cache.dateAdded = $("#dateAdded");
		$cache.lastEdited = $("#lastEdited");
		
		$cache.featured = $("#featured");

		// $cache.tshirtArea = $("#dragarea");

	};

	var fillForm = function() {

		var jsonString = $("#pjsonvalue").text();

		if (jsonString) {

			var obj = JSON.parse(jsonString);
			console.log(obj);

			$("#id").val(obj.id);
			$("#dateAdded").val(obj.dateAdded);
			$("#lastEdited").val(obj.lastEdited);

			$("#modelName").val(obj.name);
			$("#generation").val(obj.generation);
			$("#year").val(obj.year);
			$("#manufacturer").val(obj.manufacturer);

			$("#coverImageSmall").val(obj.coverImageSmall.src);
			$("#coverImageMedium").val(obj.coverImageMedium.src);

			obj.carrouselImages.forEach(function(item, index) {

				$("#carousel_image_link_" + (index + 1)).val(item.src);

			});

			$("#doors").val(obj.exteriorInfo.doors);
			$("#length").val(obj.exteriorInfo.lenght_mm);
			$("#wide").val(obj.exteriorInfo.wide_mm);
			$("#tall").val(obj.exteriorInfo.tall_mm);
			$("#tracktion").val(obj.exteriorInfo.tracktion);
			$("#type").val(obj.exteriorInfo.type);

			if(obj.techDetails){
				
				$("#cylinders").val(obj.techDetails.numberCylinders);
				$("#displacement").val(obj.techDetails.displacement_cc);
				$("#torque_nm").val(obj.techDetails.torque_nm);
				$("#engine_type").val(obj.techDetails.engineType);
				$("#power_train_type").val(obj.techDetails.powerTrain);
				$("#acceleration").val(obj.techDetails.aceleration_0_100);
				$("#max_speed").val(obj.techDetails.maxSpeed);
				$("#transmission").val(obj.techDetails.transmission.type);
				$("#speeds").val(obj.techDetails.transmission.speeds);
				
			}
			
			$("#og_url").val(obj.openGraphData.url);
			$("#og_title").val(obj.openGraphData.title);
			$("#og_image").val(obj.openGraphData.image);
			$("#og_description").val(obj.openGraphData.description);

			$("#doc_state").val(obj.documentState);

			for (i = 0; i < (obj.imageParagraphs.length - 1); i++) {
				addPlusText();
			}

			obj.imageParagraphs.forEach(function(item, index) {
				
				$("#paragraph_text_"+(index+1)).val( item.text );
				$("#text_image_"+(index+1)).val( item.textImgUrl );
				$("#large_image_link_"+(index+1)).val( item.largeImgUrlLink );
				$("#position_"+(index+1)).val( item.position );
				$("#floatLeft_"+(index+1)).prop( "checked", item.imageLeft );
				
			});
			
			$("#featured").prop( "checked", obj.featured );
			
			for (i = 0; i < (obj.composedImageDto.length - 1); i++) {
				addPlusImgs();
			}
			
			obj.composedImageDto.forEach(function(item, index) {
				
				$("#gal_thumb_image_link_"+(index+1)).val( item.thumbUrl );
				$("#gal_large_image_link_"+(index+1)).val( item.mainImagePath );
				
			});

		} else {

			console.log("0000");

		}

	};

	var bindEvents = function() {

		$("body").on("click", ".delte_gal_img", function() {
			console.log("Trash ... " + $(this).data("fromline"));
			$("#imgs_input_" + $(this).data("fromline")).remove();
		});

		$("body").on("click", ".delte_txt .fas", function() {
			console.log("Trash txt ... " + $(this).data("fromline"));
			text_input_1
			$("#text_input_" + $(this).data("fromline")).remove();
		});

		$("#modelInfoForm").on("submit", function(event) {
			event.preventDefault();

			var data = new FormData(this);
			var request = {
				exteriorInfo : {},
				openGraphData : {},
				imageParagraphs : [],
				techDetails : {},
				carrouselImages : [],
				composedImageDto : [],
				coverImageSmall : {},
				coverImageMedium : {},
				dateAdded : "",
				lastEdited : ""
			};

			request.id = data.get("id");
			request.year = data.get("year");
			request.name = data.get("name");
			request.manufacturer = data.get("manufacturer");
			request.generation = data.get("generation");

			request.dateAdded = data.get("dateAdded");
			request.lastEdited = data.get("lastEdited");

			request.documentState = data.get("doc_state");

			var coverImageSmall = {
				src : data.get("coverImageSmall")
			};

			request.coverImageSmall = coverImageSmall;

			var coverImageMedium = {
				src : data.get("coverImageMedium")
			};

			request.coverImageMedium = coverImageMedium;

			var carrouselImages = [];

			$(".carousel_image").each(function(index) {

				var cimg = $(this).val();

				if (cimg) {
					carrouselImages.push({
						src : cimg
					});
				}

			});

			request.carrouselImages = carrouselImages;

			//

			var imageParagraphs = [];

			$(".text_input").each(function(index) {

				imageParagraphs.push({
					text : $(this).find("textarea").val(),
					largeImgUrlLink : $(this).find(".large_image_link").val(),
					textImgUrl : $(this).find(".text_image").val(),
					imageLeft : $(this).find(".floatLeft").is(":checked"),
					position : $(this).find(".position").val(),
				});

			});

			request.imageParagraphs = imageParagraphs;

			//

			var composedImageDto = [];

			$(".imgs_input").each(function(index) {

				var thumb = $(this).find(".gal_thumb_image_link").val();
				var large = $(this).find(".gal_large_image_link").val();

				if (thumb && large) {

					composedImageDto.push({
						thumbUrl : thumb,
						mainImagePath : large
					});

				}

			});

			request.composedImageDto = composedImageDto;

			//
			var techDetails = {};

			techDetails.numberCylinders = data.get("cylinders");
			techDetails.engineType = data.get("engine_type");
			techDetails.displacement_cc = data.get("displacement");
			techDetails.torque_nm = data.get("torque_nm");
			techDetails.aceleration_0_100 = data.get("acceleration");
			techDetails.maxSpeed = data.get("max_speed");
			techDetails.powerTrain = data.get("power_train_type");

			var trans = {};
			trans.type = data.get("transmission");
			trans.speeds = data.get("speeds");

			techDetails.transmission = trans;

			request.techDetails = techDetails;

			var exteriorInfo = {};

			exteriorInfo.doors = data.get("doors");
			exteriorInfo.tracktion = data.get("tracktion");
			exteriorInfo.type = data.get("type");
			exteriorInfo.lenght_mm = data.get("length_mm");
			exteriorInfo.wide_mm = data.get("wide_mm");
			exteriorInfo.tall_mm = data.get("tall_mm");

			request.exteriorInfo = exteriorInfo;

			var openGraphData = {};

			openGraphData.url = data.get("og_url");
			openGraphData.title = data.get("og_title");
			openGraphData.description = data.get("og_description");
			openGraphData.image = data.get("og_image");

			request.openGraphData = openGraphData;
			
			request.featured = data.get("featured") ==='on';

			console.log(request);

			$.ajax({
				method : "POST",
				url : "/api/carmodel/upsert",
				data : JSON.stringify(request),
				processData : false,
				contentType : "application/json"
			}).done(function(msg) {
				alert("Data Saved: " + msg);
				console.log(msg);

				$cache.modelId.val(msg.id);
				$cache.dateAdded.val(msg.dateAdded);
				$cache.lastEdited.val(msg.lastEdited);

			}).fail(function(msg) {
				console.log("Failed");
				console.log(msg);

			});

			// console.log(data.get("name"));
			// console.log(data.get("doors"));
		});

		$cache.plusImgs.click(addPlusImgs);

		$cache.plusText.click(addPlusText);

	};

	var addPlusImgs = function() {

		console.log(">>>> click (2)!!!");

		var data = $cache.imgsInSettings;

		var template = $cache.imgsInTemplate.html();

		var result = Mustache.to_html(template, data);

		$cache.imgsList.append(result);

		$cache.imgsInSettings.li_id = data.li_id + 1;

		console.log($cache.imgsInSettings.li_id);

	};

	var addPlusText = function() {

		console.log(">>>> click !!!");

		var data = $cache.textInSettings;

		var template = $cache.textInTemplate.html();

		var result = Mustache.to_html(template, data);

		$cache.textsList.append(result);

		$cache.textInSettings.li_id = data.li_id + 1;

		console.log($cache.textInSettings.li_id);

	};

	return {
		allinit : init
	};

})();

$(document).on('ready', allFeatures.allinit);