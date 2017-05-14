/* global plugin */


/**
 * Utility to get value from the field name and check it is valid
 * @param {type} fieldName
 * @returns {jQuery}
 */
 
//Funtional requirement FR1.1
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
//End of FR1.1

function get_pass_value(fieldName) {
    var value = $('#' + fieldName).val();
    if (value === "") {
		alert("Please enter a password");
		return "";
    }
    return value;
}

function get_client_value(fieldName) {
    var value = $('#' + fieldName).val();
    if (value === "") {
		alert("Please enter a Client ID");
		return "";
    }
    return value;
}

function get_quantity_value(fieldName) {
    var value = $('#' + fieldName).val();
    if (value === "" || value === "Quantity") {
		alert("Please enter a quantity");
		return "";
    }
    return value;
}

function get_discount_value(fieldName) {
    var value = $('#' + fieldName).val();
    if (value === "" || value === "Discount") {
		return 0;
    }
    return value;
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
		var widgetNumber2 = widgetNumber - 8;
		var order_id;
		var price;
		//var address; //still using this??
		var lat;
		var lon;
		//var clientLat;
		//var clientLon;
		var newOrder = true;
		 
      function megaMaxSale() {
		  
		  function updateMap(clientLat, clientLon) {
				var onSuccess = function(position) {
                  var div = document.getElementById("map_canvas");
                  div.width = window.innerWidth-20;
                  div.height = window.innerHeight*0.38-40;
                  var map = plugin.google.maps.Map.getMap(div);
                  
                  //added an event listener
                  map.addEventListener(plugin.google.maps.event.MAP_READY, onMapReady, false);
                  
                  function onMapReady() {
					if (clientLat == undefined) {  
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
					if (clientLat != undefined) {
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
		  
		 
		
       //FR1.2
	    this.previousWidget = function () {
			
			//get salesperson and password
			var oucu = get_name_value('salesperson'); 
			var pass = get_pass_value('password');
		
			widgetNumber--;
			widgetNumber2 = widgetNumber - 8;
			if (widgetNumber < 8) {
				alert('Reached beginning of list');
				widgetNumber = 8;
				widgetNumber2 = widgetNumber - 8;
			}
			
            /* Invoke the RESTful API to get widget details*/
			$.get('http://137.108.93.222/openstack/api/widgets?OUCU='+ oucu + '&password=' + pass,
              function (data) {
                  var obj = $.parseJSON(data);
                  if (obj.status == "error") {
                      alert(obj.message);
                  } else {
						//display widget image
						var image = document.getElementById("widget_image");
						image.style.display = "block";
						image.src = obj.data[widgetNumber2].url;
						//display description
						var disc = obj.data[widgetNumber2].description;
						document.getElementById('description').innerHTML = disc;
						//display price
						price = obj.data[widgetNumber2].pence_price;
						document.getElementById('price').value = "Price = " + price + "p";
					}
			  });
	  };
	   

	   this.nextWidget = function () {
			widgetNumber++;
			widgetNumber2 = widgetNumber - 8;
			if (widgetNumber > 17) {
				alert('Reached end of list');
				widgetNumber = 17;
				widgetNumber2 = widgetNumber - 8;
			}
			//get salesperson and password
			var oucu = get_name_value('salesperson'); 
			var pass = get_pass_value('password');
	    
            /* Invoke the RESTful API to get widget details*/
			$.get('http://137.108.93.222/openstack/api/widgets?OUCU='+ oucu + '&password=' + pass,
              function (data) {
                  var obj = $.parseJSON(data);
                  if (obj.status == "error") {
                      alert(obj.message);
                  } else {
						//display widget image
						var image = document.getElementById("widget_image");
						image.style.display = "block";
						image.src = obj.data[widgetNumber2].url;
						//display description
						var disc = obj.data[widgetNumber2].description;
						document.getElementById('description').innerHTML = disc;
						//display price
						price = obj.data[widgetNumber2].pence_price;
						document.getElementById('price').value = "Price = " + price + "p";
					}
			  });
	  };
	
		
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
		
		
		
		this.newOrder = function () {
			if (newOrder = true) {
				
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
                                  //alert("Posted: " + result);
								
									var parsedData = $.parseJSON(result);
									order_id = parsedData.data[0].id;
									//alert(order_id);
                              }
                          });  
				this.nextWidget();
			}
		}
		
		
		function getOrderItems(oucu, pass, order) {

				$.get('http://137.108.93.222/openstack/api/order_items?OUCU='+ oucu + '&password=' + pass + '&order_id=' + order,
								function (data) {
									var obj = $.parseJSON(data);
									if (obj.status == "fail") {
										alert(obj.data[0].reason);
									} else {
											var list = "";
											var subtotal_pence = 0;
											document.getElementById("orderDetailsList").innerHTML = "";	
						
											$.each(obj.data, function (index, value) {
												var widgetInfo = value.widget_id;
												
												var priceReceived = value.pence_price;
												var itemPrice = convertToPounds(priceReceived);
												
												var numberOf = value.number;
												
												var itemTotal_pence = numberOf * priceReceived;
												var itemTotal_pounds = convertToPounds(itemTotal_pence);
												
												var result = numberOf + " x " + '(widget No ' + widgetInfo + ')' + ' x ' + '\u00A3' + itemPrice + ' = ';
												
												list += "<li>" + result + '<div style="float:right;">' + '\u00A3' + itemTotal_pounds + '</div>' + "</li>";
												subtotal_pence += itemTotal_pence;
											}
											
										);
										var vat = 20;
										var vatTotal_pence = vatAmount(vat, subtotal_pence);
										var vatTotal_pounds = convertToPounds(vatTotal_pence);
										
										var subtotal_pounds = convertToPounds(subtotal_pence);
										
										var grandTotal_pence = subtotal_pence + vatTotal_pence;
										var grandTotal_pounds = convertToPounds(grandTotal_pence);
										
										list += "<li>" + 'Subtotal:' +  '<div style="float:right;">' + '\u00A3' + subtotal_pounds + '</div>' + "</li>";
										list += "<li>" + 'VAT:' +  '<div style="float:right;">' + '\u00A3' + vatTotal_pounds + '</div>' + "</li>";
										list += "<li>" + '<strong>' +'Grand Total:' + '<div style="float:right;">' + '\u00A3' + grandTotal_pounds + '</div>' + '</strong>' + "</li>";
										$("#orderDetailsList").append(list);
									}
								}); 
		
		}
		
		function convertToPounds (pence) {
			var priceReceived = (pence / 100);
			var price_in_pounds = priceReceived.toFixed(2);
			return price_in_pounds;
		}
		
		
		function vatAmount (vat, subtotal) {
			var result = (vat / 100) * subtotal;
			result = Math.round(result);
			return result;
		}
		
		
		function discountAmount (discount, price) {
			var result = (discount / 100) * price;
			result = Math.round(result);
			return result;
		}
		
		
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
			  
				
		}
		
		
		this.placeOrdersOnMap = function () {
			
			newOrder = true;
			document.getElementById("orderDetailsList").innerHTML = "";	
			var oucu = get_name_value('salesperson'); 
			var pass = get_pass_value('password');
			var date1;
			var orderLat;
			var orderLon;
			var totalOrdersToday = 0;
			
            /* Invoke the RESTful API to get order details*/
			$.get('http://137.108.93.222/openstack/api/orders?OUCU='+ oucu + '&password=' + pass,
              function (data) {
                  var obj = $.parseJSON(data);
                  if (obj.status == "fail") {
                      alert(obj.data[0].reason);
                  } else {
						$.each(obj.data, function (index, value) {
							
							order = value.id;
							date1 = value.date;
							orderLat = value.latitude;
							orderLon = value.longitude;
							
							var orderDate = new Date(date1);
							var convOrderDate = convertDate(orderDate);
							
							var todaysDate = new Date();
							var convTodaysDate = convertDate(todaysDate);
							
							if (convOrderDate == convTodaysDate) {
								totalOrdersToday ++;
								//alert('i did it');
								updateMap(orderLat, orderLon);
							}
							
						})
						alert('Total orders today, so far = ' + totalOrdersToday);
					}	
			  });
		}
		
		
		
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
		
		
		// LOSE THIS BEFORE SUBMITTING
		load_position();

	   
      } //end of megaMaxSale function
      this.megaMaxSale = new megaMaxSale();
    }    
};
app.initialize();
