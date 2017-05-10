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
    
    if (fieldName == "salesperson") {
        if (!(isLetter(value.charAt(0)) && isNumber(value.charAt(value.length - 1)))) {
            alert("Please enter a valid Salesperson ID in the correct format");
            return "";
        }
    }
    return value;
}

function get_pass_value(fieldName) {
    var value = $('#' + fieldName).val();
    if (value == "") {
		alert("Please enter a password");
		return "";
    }
    return value;
}

function get_client_value(fieldName) {
    var value = $('#' + fieldName).val();
    if (value == "") {
		alert("Please enter a Client ID");
		return "";
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
		//var number;
		var price = "";
	  
      function megaMaxSale() {
		
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
						document.getElementById('price').innerHTML = price;
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
			var clientInput = get_pass_value('client_id');
			var client = "";
			//var order = "";
			
            /* Invoke the RESTful API to get order details*/
			$.get('http://137.108.93.222/openstack/api/orders?OUCU='+ oucu + '&password=' + pass,
              function (data) {
                  var obj = $.parseJSON(data);
                  if (obj.status == "fail") {
                      alert(obj.data[0].reason);
                  } else {
						$.each(obj.data, function (index, value) {
							//display description
							client = value.client_id;
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
								latitude: 0.00000000,
								longitude: 0.00000000
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
		};


		this.newOrder = function () {
			
			//get salesperson and password
			var oucu = get_name_value('salesperson'); 
			var pass = get_pass_value('password');
			
			var clientInput = get_pass_value('client_id');
			var client = "";
			var order = "";
			
			
			var url = "http://137.108.93.222/openstack/api/orders";
                          $.ajax({
                              url: url,
                              type: 'POST',
                              data: {
								OUCU: oucu,
								password: pass,
								client_id: clientInput,
								latitude: 0.00000000,
								longitude: 0.00000000
                              },
                              success: function (result) {
                                  alert("Posted: " + result);
								
									var parsedData = $.parseJSON(result);
									order_id = parsedData.data[0].id;
									alert(order_id);
                              }
                          });  
		};
		
		
		this.addToOrder = function () {
			
			var oucu = get_name_value('salesperson'); 
			var pass = get_pass_value('password');
			var order = order_id;
			var widget_id = widgetNumber;
			var amount = 10; //for now - need to implement Quantity input
			var pence_price = price;
			var discount = 10; //for now - need to implement discounted input
			var agreedPrice = pence_price - ((pence_price / 100) * discount); 
			
			//get the discount amount and take off price = agreedPrice
			
			
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
								pence_price: 17
                              },
                              success: function (result) {
                                  alert("Posted: " + result);
								
									//var parsedData = $.parseJSON(result);
									//order_id = parsedData.data[0].id;
                              }
                          });  
			
			
			
			
			
			
			$.get('http://137.108.93.222/openstack/api/order_items?OUCU='+ oucu + '&password=' + pass + '&order_id=' + order,
								function (data) {
									var obj = $.parseJSON(data);
									if (obj.status == "fail") {
										alert(obj.data[0].reason);
									} else {
										oblenth = Object.keys(obj.data).length;
										alert(oblenth);
										if (Object.keys(obj.data).length > 0) {
											$.each(obj.data, function (index, value) {
											//display widget
											var widgetInfo = value.widget_id;
											//display price
											var priceReceived = value.pence_price;
											//display number
											var numberOf = value.number;
											var result = numberOf + " x " + 'widget No ' + widgetInfo + ' price = ' + priceReceived;
											document.getElementById('orderDetails').innerHTML = result;
											'\n';
											} 
										)} 
									
									}
								}); 
			
			
			
			
		}
		
		
		
	   
      } //end of megaMaxSale function
      this.megaMaxSale = new megaMaxSale();
    }    
};
app.initialize();
