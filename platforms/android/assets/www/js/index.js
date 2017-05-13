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
		//alert("Please enter a quantity");
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
		
      var widgetNumber = 7;
	  var widgetNumber2 = widgetNumber - 8;
	  //global variables
		var order_id = "";
		//var number = "";
		var price = "";
		 var address;
		 var lat;
		 var lon;
		 var clientLat;
		 var clientLon;
		 
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
	   
	    this.nextOrder = function () {
			
			//get salesperson and password
			var oucu = get_name_value('salesperson'); 
			var pass = get_pass_value('password');
			//var clientInput = get_pass_value('client_id');
			//var client = "";
			//var order = "";
			var date;
			
            /* Invoke the RESTful API to get order details*/
			$.get('http://137.108.93.222/openstack/api/orders?OUCU='+ oucu + '&password=' + pass,
              function (data) {
                  var obj = $.parseJSON(data);
                  if (obj.status == "fail") {
                      alert(obj.data[0].reason);
                  } else {
						$.each(obj.data, function (index, value) {
							//display description
							//client = value.client_id;
							order = value.id;
							
							//get order details if inputted client ID matches order record
							if (client === clientInput) {
								
								document.getElementById('orderDetails').innerHTML = client;
								client = "";
								return false;
							}
							
						})
					
					}
				//if no order found for client create one	
				if (client != "" && client != clientInput) {
				  var url = "http://137.108.93.222/openstack/api/orders";
                          $.ajax({
                              url: url,
                              type: 'POST',
                              data: {
								OUCU: oucu,
								password: pass,
								client_id: clientInput,
								latitude: position.coords.latitude,
								longitude: position.coords.longitude
                              },
                              success: function (result) {
                                  alert("POSTed" + result);
                              }
                          });
				document.getElementById('orderDetails').innerHTML = clientInput
			  } else {
				  alert('Order already open');
			  } 	
					
			  });
		}


		
		
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
			
			updateMap(address);
			load_position();
			var lat1 = lat;
			var lon2 = lon;
			//alert(lat1);
			//alert(lon2);
			
			
			//get salesperson and password
			var oucu = get_name_value('salesperson'); 
			var pass = get_pass_value('password');
			var clientInput = get_pass_value('client_id');
			
			//var client = "";
			//var order = "";
			
			
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
                                  alert("Posted: " + result);
								
									var parsedData = $.parseJSON(result);
									order_id = parsedData.data[0].id;
									alert(order_id);
                              }
                          });  
		}
		
		
		function getOrderItems(oucu, pass, order) {

				$.get('http://137.108.93.222/openstack/api/order_items?OUCU='+ oucu + '&password=' + pass + '&order_id=' + order,
								function (data) {
									var obj = $.parseJSON(data);
									if (obj.status == "fail") {
										alert(obj.data[0].reason);
									} else {
										//oblenth = Object.keys(obj.data).length;
										//alert(oblenth);
										
											var list = "";
											var subtotal = 0;
											document.getElementById("orderDetailsList").innerHTML = "";	
						
											$.each(obj.data, function (index, value) {
												var widgetInfo = value.widget_id;
												var priceReceived = value.pence_price;
												var numberOf = value.number;
												var itemTotal = numberOf * priceReceived;
												var result = numberOf + " x " + '(widget No ' + widgetInfo + ')' + ' x ' + priceReceived + 'p ' + '= ';
												
												list += "<li>" + result + '<div style="float:right;">' + itemTotal + 'p   '+ '</div>' + "</li>";
												subtotal += itemTotal;
											}
											
										);
										var vat = 20;
										var vatTotal = vatAmount(vat, subtotal);
										var grandTotal = subtotal + vatTotal;
										list += "<li>" + 'Subtotal:' +  '<div style="float:right;">' + subtotal + 'p   ' + '</div>' + "</li>";
										list += "<li>" + 'VAT:' +  '<div style="float:right;">' + vatTotal + 'p   ' + '</div>' + "</li>";
										list += "<li>" + '<strong>' +'Grand Total:' + '<div style="float:right;">' + grandTotal + 'p   '+ '</div>' + '</strong>' + "</li>";
										//document.getElementById("orderDetailsList").append(list);
										$("#orderDetailsList").append(list);
									}
								}); 
		
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
                                  alert("Posted: " + result);
									getOrderItems(oucu, pass, order);
									//var parsedData = $.parseJSON(result);
									//order_id = parsedData.data[0].id;
                              }
                          }); 
			  
				
		}
		
		
		this.placeOrdersOnMap = function () {
			//get salesperson and password
			var oucu = get_name_value('salesperson'); 
			var pass = get_pass_value('password');
			//var clientInput = get_pass_value('client_id');
			//var client = "";
			//var order = "";
			var date1;
			var orderLat;
			var orderLon;
			
            /* Invoke the RESTful API to get order details*/
			$.get('http://137.108.93.222/openstack/api/orders?OUCU='+ oucu + '&password=' + pass,
              function (data) {
                  var obj = $.parseJSON(data);
                  if (obj.status == "fail") {
                      alert(obj.data[0].reason);
                  } else {
						$.each(obj.data, function (index, value) {
							//display description
							//client = value.client_id;
							order = value.id;
							date1 = value.date;
							orderLat = value.latitude;
							orderLon = value.longitude;
							
							var date = new Date(date1);
							var curr_date = date.getDate();
							var curr_month = date.getMonth() + 1; 
							if (curr_month < 10) {
								curr_month = "0" + curr_month;
							} 
							var curr_year = date.getFullYear();
							
							var refinedDate = (curr_year + "-" + curr_month + "-" + curr_date);
							
							
							
							//date.format("yyyy-mm-dd");
							//alert(refinedDate);
							//get order details if inputted client ID matches order record
							if (refinedDate == "2017-05-13") {
								alert('i did it');
								updateMap(orderLat, orderLon);
							}
							
						})
					
					}
 	
					
			  });
		}
		
		
		
		
		load_position();

	   
      } //end of megaMaxSale function
      this.megaMaxSale = new megaMaxSale();
    }    
};
app.initialize();
