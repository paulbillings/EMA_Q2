/* global plugin */


//Functional requirement FR1.1--------------------------------
 function isLetter(str) {
    return str.length === 1 && str.match(/[a-z]/i);
}
function isNumber(str) {
    return str.length === 1 && str.match(/[0-9]/);
}

function get_name_value(fieldName) {
    var value = $('#' + fieldName).val();
    
    if (fieldName === "salesperson") {
        if (!(isLetter(value.charAt(0)) && isNumber(value.charAt(value.length - 1)))) {
            alert("Please enter a valid Salesperson ID in the correct format");
            return "";
        }
    }
    return value;
}
//End of FR1.1------------------------------------------------

//helper function for password
function get_pass_value(fieldName) {
    var value = $('#' + fieldName).val();
    if (value === "") {
		alert("Please enter a password");
		return "";
    }
    return value;
}

//helper function for client input
function get_client_value(fieldName) {
    var value = $('#' + fieldName).val();
    if (value === "") {
		alert("Please enter a Client ID");
		return "";
    }
    return value;
}

//helper function for quantity input
function get_quantity_value(fieldName) {
    var value = $('#' + fieldName).val();
    if (value === "" || value === "Quantity") {
		alert("Please enter a quantity");
		return "";
    }
    return value;
}

//helper function for discount input
function get_discount_value(fieldName) {
    var value = $('#' + fieldName).val();
    if (value === "" || value === "Discount") {
		return 0;
    }
    return value;
}

//helper function to convert pence to pounds
function convertToPounds (pence) {
	var priceReceived = (pence / 100);
	var price_in_pounds = priceReceived.toFixed(2);
	return price_in_pounds;
}
		
//helper function to get VAT total from an amount		
function vatAmount (vat, subtotal) {
	var result = (vat / 100) * subtotal;
	result = Math.round(result);
	return result;
}
		
//helper function to get discount amount in pence, rounding to nearest penny 		
function discountAmount (discount, price) {
	var result = (discount / 100) * price;
	result = Math.round(result);
	return result;
}

//helper function to convert a date to yyyy-mm-dd	
function convertDate (date) {
	var aDate = date.getDate();
	var aMonth = date.getMonth() + 1; 
	if (aMonth < 10) {
		aMonth = "0" + aMonth;
	} 
	var aYear = date.getFullYear();
	var convertedDate = (aYear + "-" + aMonth + "-" + aDate);
	return convertedDate;
}



/**
 * This is the main class
 */
var app = {
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
		
		 //global variables
		var widgetNumber = 7;
		var widgetArrayLocation = widgetNumber - 8;
		var order_id;
		var price;
		var lat;
		var lon;
		var newOrder = true;
		 
      function megaMaxSale() {
		  
		 
//------Functional requirement FR1.2 part 1 ------------------------------------
	    this.previousWidget = function () {
			
			//get salesperson and password
			var oucu = get_name_value('salesperson'); 
			var pass = get_pass_value('password');
		
			widgetNumber--;
			widgetArrayLocation = widgetNumber - 8;
			if (widgetNumber < 8) {
				alert('Reached beginning of list');
				widgetNumber = 8;
				widgetArrayLocation = widgetNumber - 8;
			}
			
            /* Invoke the RESTful API to get widget details*/
			$.get('http://137.108.93.222/openstack/api/widgets?OUCU='+ oucu + '&password=' + pass,
              function (data) {
                  var obj = $.parseJSON(data);
                  if (obj.status === "error") {
                      alert(obj.message);
                  } else {
						//display widget image
						var image = document.getElementById("widget_image");
						image.style.display = "block";
						image.src = obj.data[widgetArrayLocation].url;
						//display description
						var disc = obj.data[widgetArrayLocation].description;
						document.getElementById('description').innerHTML = disc;
						//display price
						price = obj.data[widgetArrayLocation].pence_price;
						document.getElementById('price').value = "Price = " + price + "p";
					}
			  });
	  };
	   

//-----Functional requirement FR1.2 part 2 -------------------------------------
	   this.nextWidget = function () {
			widgetNumber++;
			widgetArrayLocation = widgetNumber - 8;
			if (widgetNumber > 17) {
				alert('Reached end of list');
				widgetNumber = 17;
				widgetArrayLocation = widgetNumber - 8;
			}
			//get salesperson and password
			var oucu = get_name_value('salesperson'); 
			var pass = get_pass_value('password');
	    
            /* Invoke the RESTful API to get widget details*/
			$.get('http://137.108.93.222/openstack/api/widgets?OUCU='+ oucu + '&password=' + pass,
              function (data) {
                  var obj = $.parseJSON(data);
                  if (obj.status === "error") {
                      alert(obj.message);
                  } else {
						//display widget image
						var image = document.getElementById("widget_image");
						image.style.display = "block";
						image.src = obj.data[widgetArrayLocation].url;
						//display description
						var disc = obj.data[widgetArrayLocation].description;
						document.getElementById('description').innerHTML = disc;
						//display price
						price = obj.data[widgetArrayLocation].pence_price;
						document.getElementById('price').value = "Price = " + price + "p";
					}
			  });
	  };
	
		
		//get current location
		function load_position() {
			if (navigator.geolocation) {
					navigator.geolocation.getCurrentPosition(showPosition);
			} 
			else { 
				alert('Geolocation is not supported');
			}
		}
		function showPosition(position) {
			lat = position.coords.latitude;
			lon = position.coords.longitude;
		}
		
		//creates new order for client
		this.newOrder = function () {
			
			if (newOrder === true) {
				
				newOrder = false;
				updateMap();
				load_position();
				var lat1 = lat;
				var lon2 = lon;
				var oucu = get_name_value('salesperson'); 
				var pass = get_pass_value('password');
				var clientInput = get_pass_value('client_id');
			
				var url = "http://137.108.93.222/openstack/api/orders";
                          $.ajax({
                              url: url,
                              type: 'POST',
                              data: {
								OUCU: oucu,
								password: pass,
								client_id: clientInput,
								latitude: lat1,
								longitude: lon2
                              },
                              success: function (result) {
									//get order_id so can add order items to this order
									var parsedData = $.parseJSON(result);
									order_id = parsedData.data[0].id;	
                              }
                          }); 
				//shows widgets after salesperson, passwords and client have been entered and new order created	  
				this.nextWidget();
			}
		};
		
		
//------Functional requirement FR1.3 --------------------------------------
		this.addToOrder = function () {
			
			var oucu = get_name_value('salesperson'); 
			var pass = get_pass_value('password');
			var order = order_id;
			var widget_id = widgetNumber;
			var amount = get_quantity_value('quantity');
			var pence_price = price;
			var discount = get_discount_value('discount');
			var discountPence = discountAmount(discount, pence_price);
			var agreedPrice = pence_price - discountPence; 
			
			var url = "http://137.108.93.222/openstack/api/order_items";
                          $.ajax({
                              url: url,
                              type: 'POST',
                              data: {
								OUCU: oucu,
								password: pass,
								order_id: order,
								widget_id: widgetNumber,
								number: amount,
								pence_price: agreedPrice
                              },
                              success: function (result) {
                                  //alert("Posted: " + result);
									getOrderItems(oucu, pass, order);
                              }
                          }); 		
		};
		
		
//------Functional requirement FR1.4 --------------------------------------
		function getOrderItems(oucu, pass, order) {

			$.get('http://137.108.93.222/openstack/api/order_items?OUCU='+ oucu + '&password=' + pass + '&order_id=' + order,
				function (data) {
					var obj = $.parseJSON(data);
					if (obj.status === "fail") {
							alert(obj.data[0].reason);
					} else {
						var list = "";
						var subtotal_pence = 0;
						document.getElementById("orderDetailsList").innerHTML = "";	
						
						$.each(obj.data, function (index, value) {
							var widgetInfo = value.widget_id;
												
							var priceReceived = value.pence_price;
							var itemPrice = convertToPounds(priceReceived);	//convert item price to £'s
												
							var numberOf = value.number;
												
							var itemTotal_pence = numberOf * priceReceived;
							var itemTotal_pounds = convertToPounds(itemTotal_pence);  //convert quantity x item price to £'s
												
							var result = numberOf + " x " + '(widget No ' + widgetInfo + ')' + ' x ' + '\u00A3' + itemPrice + ' = ';
												
							list += "<li>" + result + '<div style="float:right;">' + '\u00A3' + itemTotal_pounds + '</div>' + "</li>";
							subtotal_pence += itemTotal_pence;
						});
						
						//VAT at 20%
						var vat = 20;
						var vatTotal_pence = vatAmount(vat, subtotal_pence);
						var vatTotal_pounds = convertToPounds(vatTotal_pence);	//convert VAT total to £'s
						
						var subtotal_pounds = convertToPounds(subtotal_pence);	//convert subtotal to £'s
						
						var grandTotal_pence = subtotal_pence + vatTotal_pence;
						var grandTotal_pounds = convertToPounds(grandTotal_pence);	//convert grand total to £'s
										
						list += "<li>" + 'Subtotal:' +  '<div style="float:right;">' + '\u00A3' + subtotal_pounds + '</div>' + "</li>";
						list += "<li>" + 'VAT:' +  '<div style="float:right;">' + '\u00A3' + vatTotal_pounds + '</div>' + "</li>";
						list += "<li>" + '<strong>' +'Grand Total:' + '<div style="float:right;">' + '\u00A3' + grandTotal_pounds + '</div>' + '</strong>' + "</li>";
						$("#orderDetailsList").append(list);
					}
				}); 
		
		}
		
		
//------Functional requirement FR2.2 ----------------------------------------
		this.placeOrdersOnMap = function () {
			
			newOrder = true;
			document.getElementById("orderDetailsList").innerHTML = "";	
			var oucu = get_name_value('salesperson'); 
			var pass = get_pass_value('password');
			var orderDate;
			var orderLat;
			var orderLon;
			var totalOrdersToday = 0;
			
            /* Invoke the RESTful API to get order details*/
			$.get('http://137.108.93.222/openstack/api/orders?OUCU='+ oucu + '&password=' + pass,
              function (data) {
                  var obj = $.parseJSON(data);
                  if (obj.status === "fail") {
                      alert(obj.data[0].reason);
                  } else {
						$.each(obj.data, function (index, value) {
							
							order = value.id;
							orderDate = value.date;
							orderLat = value.latitude;
							orderLon = value.longitude;
							
							//date the order was placed
							var orderDate = new Date(orderDate);
							var convOrderDate = convertDate(orderDate);
							
							//todays date
							var todaysDate = new Date();
							var convTodaysDate = convertDate(todaysDate);
							
							//if dates are the same then add a pin to the map
							if (convOrderDate === convTodaysDate) {
									totalOrdersToday ++;
									//sends location of order to place pin
									updateMap(orderLat, orderLon);
							}	
						});
						alert('Total orders today, so far = ' + totalOrdersToday);
					}	
			  });
		};
		
		
		
		function updateMap(clientLat, clientLon) {
				var onSuccess = function(position) {
                  var div = document.getElementById("map_canvas");
                  div.width = window.innerWidth-20;
                  div.height = window.innerHeight*0.38-40;
                  var map = plugin.google.maps.Map.getMap(div);
                  
                  //added an event listener
                  map.addEventListener(plugin.google.maps.event.MAP_READY, onMapReady, false);
                  
                  function onMapReady() {
					if (clientLat === undefined) { 
						
//----------------------Functional requirement FR2.1 ----------------------------------
						map.setVisible(false);
						plugin.google.maps.Map.setDiv(div);
						var currentLocation = new plugin.google.maps.LatLng(position.coords.latitude, position.coords.longitude);
						//Add a marker to the map, at the current location with text
						map.addMarker({'position': currentLocation,
							'title': "You are here"},
						function (marker){
                            marker.showInfoWindow();
                        });
						
					map.setZoom(11);
					map.setCenter(currentLocation);
					map.refreshLayout();
					map.setVisible(true);
					}
					// Mark the address if it is defined
					if (clientLat !== undefined) {
						map.setVisible(false);
						var clientLocation = new plugin.google.maps.LatLng(clientLat, clientLon);
						map.addMarker({'position': clientLocation,
								'title': "Client order"
						},
						function(marker) {
								marker.setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png');
								marker.showInfoWindow();
						});
						map.setZoom(11);
						map.setCenter(clientLocation);
						map.refreshLayout();
						map.setVisible(true); 
					 
					}
					}
				 
				};
			 
            var onError = function(error) {
              alert('code: ' + error.code + '\n' +'message: ' + error.message + '\n');
            };
            navigator.geolocation.getCurrentPosition(onSuccess, onError);
        }
		
		load_position(); 
      } 
      this.megaMaxSale = new megaMaxSale();
    }    
};
app.initialize();
