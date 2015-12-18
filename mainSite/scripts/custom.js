function GetMovers(searchBar) {
	$('#searched').empty();
	var params = "val="+searchBar.value;
	var response = JSON.parse(ajaxRequest("ServerCalls/GetMovers.cshtml", params, "GET", false));
	var mover;
	for (var x = 0; x < response.results.length; x++) {
		mover = response.results[x];
		$('#searched').append($('<option>', { 
			value : mover.id, 
			text : mover.FullName 
		}).text(mover.FullName));
	}
}

function addMover() {
	var text  = $('#searched option:selected').text();
	var value = $('#searched option:selected').val();
	var currentVal = $('#moveMovers').val(); 
	$("#selectedMovers").append(text + "\n");
	$("#moveMovers").attr("value", currentVal + " " + value); 
}

function removeChoices() {
	$("#selectedMovers").empty();
	$('#moveMovers').attr('value', '');
}

//Callback handler for form submit event
$(function () {
	$("#createForm").on("submit", function (e) {
		var formObj = $(this);
		var formURL = formObj.attr("action");
		var formData = new FormData(this);
		$.ajax({
			url: formURL,
			type: 'POST',
			data: formData,
			mimeType: "multipart/form-data",
			contentType: false,
			cache: false,
			processData: false,
			success: function (data, textStatus, jqXHR) {
				alert("File Uploaded");
			},
			error: function (jqXHR, textStatus, errorThrown) {
				alert("Something is wrong: " + errorThrown);
			}
		});
		e.preventDefault(); //Prevent Default action. 
		e.unbind();
	});
});

function createListTemplate(id, movers, location, endDate, status, name, createdDate, moveCount, percentage) {
	//@Create a Div that contains a move list
	createdDate = new Date(createdDate);
	endDate     = new Date(endDate);
	var createdString = createdDate.getMonth() + "/" + createdDate.getDate() + "/" + createdDate.getFullYear();
	var endString = endDate.getMonth() + "/" + endDate.getDate() + "/" + endDate.getFullYear();

	htmlTemplate = ""                                                                         +
		"<div class='moveList' name='Brett' onclick='openListModal(this)'>"                   +
			"<div class='box'>"                                                               +
				"<span class='createdDate'>" + createdString + "</span><br />"                +
				"<span class='end'>" + endString + "</span>"                                  +
				"<input class='location' type='hidden' value='" + location + "' />"           +
				"<input class='id' type='hidden' value='" + id + "'/>"                        +
			"</div>"                                                                          +
			"<div class='box'>"                                                               +
				"<span class='listName'>"                                                     +
					name                                                                      +
				"</span><br />"                                                               +
				"<span class='listPercentage'>"                                               +
					percentage                                                                +
				"</span>"                                                                     +
			"</div>"                                                                          +
			"<div class='box'>"                                                               + 
				"<span class='movers'>" + movers + "</span><br />"                            +
				"<span class='moves'>" + moveCount + "</span>"                                +
			"</div>"                                                                          +
		"</div><br />"                                                                        ;

	return htmlTemplate;	

}

function createMoveTemplate(startBuilding, startFloor, startSeat, endBuilding, endFloor, endSeat, moveName, endDate, computer, chair, printer, firstName, moveID, lastName, status) {
	//@Create a div that contains a move
	var endDate = new Date(endDate);
	var endString = endDate.getMonth() + "/" + endDate.getDate() + "/" + endDate.getFullYear();
	var cssClass = (status == "3")  ? "moveContainer finished" : "moveContainer";
	var htmlTemplate =""																												  + 
		"<div class='" + cssClass + "'>"																								      +
			"<div class='moveBox'>"																										  +
				"<div class='startLocation'>"																							  +
					startBuilding + " " + startFloor + " " + startSeat																	  +
				"</div>"																												  +  
				"<div class='moveName'>"																								  +
					moveName																											  +
				"</div>"																												  +  
			"</div>"																													  +
			"<div class='moveBox'>"																										  +
				"<div class='endDate'>"																									  +
					endString																											  +
				"</div>"																												  +  
				"<div>"																													  +
					"<button class='moveButton' onclick=\"populateMoveModal($(this).closest('.moveContainer'))\">Move Person</button>"	  +
					"<input type='hidden' value='" + computer  + " " + printer + " " + chair + "' class='moveItems' />"                +
					"<input type='hidden' value='" + firstName + " " + lastName + "' class='moveFullName' />"                             +
					"<input type='hidden' value='" + endBuilding + " " + endFloor +  " " + endSeat + "' class='moveEndLocation' />"       +
					"<input type='hidden' value='" + moveID + "' class='moveMoveID' />"													  +
				"</div>"                                                                                                                  + 
			"</div>"                                                                                                                      +
		"</div><br /><br />"                                                                                                              ;
	return htmlTemplate;
}

function getMoveLists(user) {
	var response = JSON.parse(ajaxRequest("ServerCalls/GetMoveLists.cshtml", "creator=" + user, "POST", false));
	var result;
	for (var i = 0; i < response.results.length; i++) {
		result = response.results[i];
		$("#moveListContainer").append(
			createListTemplate(result.id, result.movers, result.location, result.endDate, result.status, result.name, result.createdDate, result.moveCount, result.movePercentage)
		);
	} 
}

function openListModal(obj) {
	$('#modalLocation').html('');
	var loc = $('.location', obj).attr('value');
	var id = $('.id', obj).attr('value');
	$('#modalLocation').html(loc);
	$('#moveId').val(id);
	openModal("listModal");
}

function populateMoves() {
	$("#moveContainer").html("");
	var moveID = $('#moveId').val();
	closeModal("listModal");
	//Get all moves
	var response = JSON.parse(ajaxRequest("ServerCalls/GetMoves.cshtml", "val=" + moveID, "GET", false));
	for (var i = 0; i < response.results.length; i++) {
		result = response.results[i];
		$('#moveContainer').append( 
			createMoveTemplate(
				result.startBuilding					, 
				result.startFloor						, 
				result.startSeat						, 
				result.endBuilding                      , 
				result.endFloor                         , 
				result.endSeat                          ,
				result.firstName + " " + result.lastName,  
				"10/24/2013"							, //Figure out a way to get the date out of the move table
				result.computer							,
				result.chair							, 
				result.printer							, 
				result.firstName						,
				result.moveID							, 
				result.lastName							,
				result.status							)
		);
	}
	$("#tabs").tabs("option", "active", 2);
}

function populateMoveModal(moveObj) {

	var moveName = $(".moveName", moveObj).text();
	var items = $(".moveItems", moveObj).val().split(" ");
	var checkboxes = ["#computerCheckbox", "#printerCheckbox", "#ergonomicCheckbox"];
	for(var x = 0, y = 0; x < checkboxes.length; x++, y++) {
		var box = checkboxes[x];
		var item = items[y];
		if (item == "0") {
			$(box).prop('disabled', true);
			$(box).attr('checked', false);
		}
		else if (item == "1") {
			$(box).attr('checked', false);
			$(box).prop('disabled', false);
		}
		else if (item == "2") {
			$(box).prop('disabled', false);
			$(box).attr('checked', true);
		}
	}
	$("#moveModal-Name").text(moveName);
	$("#moveModal-moveID").val($(".moveMoveID", moveObj).val());
	openModal("moveModal");
}

function submitMove(full) {
	var computerReady  = ($("#computerCheckbox").prop("checked")  || $("#computerCheckbox").prop("disabled"));
	var printerReady   = ($("#printerCheckbox").prop("checked")   || $("#printerCheckbox").prop("disabled"));
	var ergoReady      = ($("#ergonomicCheckbox").prop("checked") || $("#ergonomicCheckbox").prop("disabled"));
	
	var moveID = $('#moveModal-moveID').val();
	var status;

	var computerStatus = getCheckboxStatus("#computerCheckbox");
	var printerStatus  = getCheckboxStatus("#printerCheckbox");
	var ergoStatus     = getCheckboxStatus("#ergonomicCheckbox");
	
	if (full) {
		if (computerReady && printerReady && ergoReady) {
			status = "3";
		} else {
			alert("Submit failed: cannot complete move with outstanding items");
			return;
		}
	} else {
		status = "2";
	}
	var queryString = "id=" + moveID + "&cpu=" + computerStatus + "&printer=" + printerStatus + "&ergo=" + ergoStatus + "&status=" + status;
	var response = JSON.parse(ajaxRequest("ServerCalls/SubmitMove.cshtml", queryString, "POST", false));
	//alert(response.results[0].ErrorMessage);
	alert(queryString);
	closeModal();
	populateMoves();
}

function getCheckboxStatus(id) {
	var cValue = $(id).prop("checked");
	var dValue = $(id).prop("disabled");

	if (dValue) {
		return "0"
	}
	else if (cValue) {
		return "2"
	} else {
		return "1"
	}
}