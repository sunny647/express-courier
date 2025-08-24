const setEditModal = (id) => {
	
    const xhttp = new XMLHttpRequest();

    xhttp.open("GET", `/api/shipment/${id}`, false);
	xhttp.setRequestHeader("Authorization", "Bearer "+localStorage.getItem('token'));
    xhttp.send();

    const shipment = JSON.parse(xhttp.responseText);
	
    document.getElementById('id').value = shipment.data.id;
    document.getElementById('from').value = shipment.data.from;
    document.getElementById('to').value = shipment.data.to;
    document.getElementById('shipstatus').value = shipment.data.shipstatus;
    document.getElementById('type').value = shipment.data.type;
	document.getElementById('userEmail').value = shipment.data.userEmail;
}

const submitEditModal = () => {
	
	var data = "type="+document.getElementById('type').value+"&shipstatus="+document.getElementById('shipstatus').value+"&from="+document.getElementById('from').value+"&to="+document.getElementById('to').value;
	
    const xhttp = new XMLHttpRequest();

    xhttp.open("PUT", `/api/shipment/`+document.getElementById('id').value, false);
	xhttp.setRequestHeader("Authorization", "Bearer "+localStorage.getItem('token'));
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.send(data);

    const shipmentUpdate = JSON.parse(xhttp.responseText);
	if(shipmentUpdate.status==1){
		location.reload();
	}else{
		var errorMsg ="";
		shipmentUpdate.data.forEach(obj => {
			errorMsg += "<li>" + obj.msg + "</li>";
		});
		document.getElementById('editErrors').style.display = "block";
		document.getElementById('editErrors').innerHTML = "<ul>"+errorMsg+"</ul>";
	}
}

const submitCreateModal = () => {
	
	
	var data = "type="+document.getElementById('typeC').value+"&shipstatus="+document.getElementById('shipstatusC').value+"&from="+document.getElementById('fromC').value+"&to="+document.getElementById('toC').value+"&userEmail="+document.getElementById('userEmailC').value;
	
    const xhttp = new XMLHttpRequest();
	
    xhttp.open("POST", `/api/shipment/`, false);
	xhttp.setRequestHeader("Authorization", "Bearer "+localStorage.getItem('token'));
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.send(data);

    const shipmentUpdate = JSON.parse(xhttp.responseText);
	
	if(shipmentUpdate.status==1){
		location.reload();
	}else{
		var errorMsg ="";
		shipmentUpdate.data.forEach(obj => {
			errorMsg += "<li>" + obj.msg + "</li>";
		});
		document.getElementById('createErrors').style.display = "block";
		document.getElementById('createErrors').innerHTML = "<ul>"+errorMsg+"</ul>";
	}
}


const deleteShipment = (id) => {
    const xhttp = new XMLHttpRequest();

    xhttp.open("DELETE", `/api/shipment/${id}`, false);
	xhttp.setRequestHeader("Authorization", "Bearer "+localStorage.getItem('token'));
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.send();

    location.reload();
}

const loadShipments = () => {
	if(localStorage.getItem('admin')=="false"){
		document.getElementById('create').style.visibility = "hidden";
	}
    const xhttp = new XMLHttpRequest();
		
	xhttp.onreadystatechange = function() {
	  if (this.readyState == 4 && this.status == 401) {
			window.location.href="/unauthorised";
	  }
	};
	
    xhttp.open("GET", "/api/shipment", false);
	xhttp.setRequestHeader("Authorization", "Bearer "+localStorage.getItem('token'));
    xhttp.send();

    const shipments = JSON.parse(xhttp.responseText);
	if(shipments.data.length>0){
		document.getElementById('shipments').innerHTML="";
	}
    for (let shipment of shipments.data) {
		var shipmentCard='';
		
		if(localStorage.getItem('admin')=="true"){
			
			shipmentCard = `
            <div class="col-4" style="padding-top:20px">
                <div class="card">
                    <div class="card-body">
                        <h6 class="card-title">Tracking Id: ${shipment._id}</h6>
                        <h6 class="card-subtitle mb-2 text-muted">Status: ${shipment.shipstatus}</h6>
						<div>User: ${shipment.userEmail}</div>
                        <div>From: ${shipment.from}</div>
                        <div>To: ${shipment.to}</div>
                        <div>Type: ${shipment.type}</div>
						<div>Created: ${shipment.createdAt}</div>
                        <hr>

                        <button type="button" class="btn btn-danger" onClick="deleteShipment('${shipment._id}');">Delete</button>
                        <button id="edit" type="button" class="btn btn-primary" data-toggle="modal" 
                            data-target="#editShipmentModal" onClick="setEditModal('${shipment._id}');">
                            Edit
                        </button>
                    </div>
                </div>
            </div>
        `	
		}else{
			
			shipmentCard = `
            <div class="col-4" style="padding-top:20px">
                <div class="card">
                    <div class="card-body">
                        <h6 class="card-title">Tracking Id: ${shipment._id}</h6>
                        <h6 class="card-subtitle mb-2 text-muted">Status: ${shipment.shipstatus}</h6>
						<div>User: ${shipment.userEmail}</div>
                        <div>From: ${shipment.from}</div>
                        <div>To: ${shipment.to}</div>
                        <div>Type: ${shipment.type}</div>
						<div>Created: ${shipment.createdAt}</div>
                    </div>
                </div>
            </div>
        `
		document.getElementById('create').style.visibility = "hidden";
		}
        
        document.getElementById('shipments').innerHTML += shipmentCard;
    }
}

const logout = () => {
	localStorage.clear();
	window.location.href="/login";
}

loadShipments();

