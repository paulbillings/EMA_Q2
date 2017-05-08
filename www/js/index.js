/* global plugin */


/**
 * Utility to get default value from the field name if it was undefined or empty
 * @param {type} fieldName
 * @param {type} defaultValue
 * @returns {jQuery}
 */
function isLetter(str) {
    return str.length === 1 && str.match(/[a-z]/i);
}
function isNumber(str) {
    return str.length === 1 && str.match(/[0-9]/);
}

function get_name_value(fieldName, defaultValue) {
    var value = $('#' + fieldName).val();
    if (value == "") {
       value = defaultValue;
       $('#' + fieldName).val(value);
    }
    if (fieldName == "name") {
        if (!(isLetter(value.charAt(0)) && isNumber(value.charAt(value.length - 1)))) {
            alert("Please enter the correct value");
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
			widgetNumber--;
			if (widgetNumber < 0) {
				alert('Reached beginning of list');
				widgetNumber = 0;
			}
	    
            /* Invoke the RESTful API to get widget details*/
			$.get('http://137.108.93.222/openstack/api/widgets?OUCU=pb8255&password=CKJ8SgSY',
              function (data) {
                  var obj = $.parseJSON(data);
                  if (obj.status == "error") {
                      alert(obj.data[0].reason);
                  } else {
						//alert(obj.data[widgetNumber].description);
						var image = document.getElementById("widget_image");
						image.style.display = "block";
						image.src = obj.data[widgetNumber].url;
						
						var disc = obj.data[widgetNumber].description;
						document.getElementById('description').innerHTML = disc;
						
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
	    
            /* Invoke the RESTful API to get widget details*/
			$.get('http://137.108.93.222/openstack/api/widgets?OUCU=pb8255&password=CKJ8SgSY',
              function (data) {
                  var obj = $.parseJSON(data);
                  if (obj.status == "error") {
                      alert(obj.data[0].reason);
                  } else {
						//alert(obj.data[widgetNumber].description);
						var image = document.getElementById("widget_image");
						image.style.display = "block";
						image.src = obj.data[widgetNumber].url;
						
						var disc = obj.data[widgetNumber].description;
						document.getElementById('description').innerHTML = disc;
						
						var price = obj.data[widgetNumber].pence_price;
						document.getElementById('price').innerHTML = price;
					}
			  });
	  };
	   
	   
	   
      } //end of megaMaxSale function
      this.megaMaxSale = new megaMaxSale();
    }    
};
app.initialize();
