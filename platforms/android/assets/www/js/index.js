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

/**
 * This is the main class
 */
var app = {
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
      var widgetNumber = -1;
      function megaMaxSale() {
		// code to go here
       
	    this.previousWidget = function () {
			
			//get salesperson and password
			var oucu = get_name_value('salesperson'); 
			var pass = $('#' + 'password').val();
		
			widgetNumber--;
			if (widgetNumber < 0) {
				alert('Reached beginning of list');
				widgetNumber = 0;
			}
			
            /* Invoke the RESTful API to get widget details*/
			$.get('http://137.108.93.222/openstack/api/widgets?OUCU='+ oucu + '&password=' + pass,
              function (data) {
                  var obj = $.parseJSON(data);
                  if (obj.status == "error") {
                      alert(obj.data[0].reason);
                  } else {
						//display widget image
						var image = document.getElementById("widget_image");
						image.style.display = "block";
						image.src = obj.data[widgetNumber].url;
						//display description
						var disc = obj.data[widgetNumber].description;
						document.getElementById('description').innerHTML = disc;
						//display price
						var price = obj.data[widgetNumber].pence_price;
						document.getElementById('price').innerHTML = price;
					}
			  });
	  };
	   

	   this.nextWidget = function () {
			widgetNumber++;
			if (widgetNumber > 9) {
				alert('Reached end of list');
				widgetNumber = 9;
			}
			//get salesperson and password
			var oucu = get_name_value('salesperson'); 
			var pass = $('#' + 'password').val();
	    
            /* Invoke the RESTful API to get widget details*/
			$.get('http://137.108.93.222/openstack/api/widgets?OUCU='+ oucu + '&password=' + pass,
              function (data) {
                  var obj = $.parseJSON(data);
                  if (obj.status == "error") {
                      alert(obj.data[0].reason);
                  } else {
						//display widget image
						var image = document.getElementById("widget_image");
						image.style.display = "block";
						image.src = obj.data[widgetNumber].url;
						//display description
						var disc = obj.data[widgetNumber].description;
						document.getElementById('description').innerHTML = disc;
						//display price
						var price = obj.data[widgetNumber].pence_price;
						document.getElementById('price').value = "Price = " + price + " p";
					}
			  });
	  };
	   
	   
	   
      } //end of megaMaxSale function
      this.megaMaxSale = new megaMaxSale();
    }    
};
app.initialize();
