var validHelper = {
  email: function(email) {
    re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  },
  phone: function(phone) {
    re = /\d/
    // NEXT STEP: better regex, at least 4 numbers present (could add first trim all non-digits)
    return re.test(phone)
  }
}

var orderDataModule = (function() {
  var orderData = {}; // dates are always stored as JS Date objects
  // will contain start/end date, email, tos

  function prefillOrderData() {
    for (attr in orderData) {
      if (attr === "start_date") {
        $("#start_date").datepicker("setDate", orderData[attr]);
      } else {
        $("#" + attr).val(orderData[attr]); 
      }
    }
  }

  return {
    initialize: function() {
      // getreserveddates always needs to happen since this is what sets the datepicker defaults
      dateTimeFxns.getReservedDates.then(
        function(reserved_dates) {
          console.log("success was cuaght with resrved dates passed to be used as " + reserved_dates)
          storedOrderData = JSON.parse(sessionStorage.getItem("orderData"), function(key, value) {
            if (key.indexOf("date") > -1) { return new Date(value) }; // converts JSON back into time objects
            return value;
          })
          if (storedOrderData) {
            if (reserved_dates.indexOf(storedOrderData.start_date.getTime()) > -1) {
              Alertion.show("Sorry! Looks like someone just reserved the toolkit for those dates, please select new dates & try again");
              storedOrderData.start_date = null;
              storedOrderData.end_date = null;
            }
            orderData = storedOrderData;
            prefillOrderData();
          }
        }, 
        function(error) { 
          // the getReservedDates shows the alert
          console.log(error) 
        }
      )
    },
    set: function(name, value) {
      orderData[name] = value;
    },
    save: function() {
      if (Object.keys(orderData).length) { Storage.save("sessionStorage", "orderData", orderData) }
    },
    isValid: function() {
      validations = [] // can't use weakSet, because that cannot store primitives like boolean
      // we do want to iterate through all fields rather than return the first false, because this process actually toggles error fields

      // open debate:
      // since delivery is a cart item, we should validate the item when we validate the cart, i.e., inside cartModule.isValid
      // then again since its order fields feel like order data, we should validate here
      // sticking with this for now just to make us not have analogous validation code in 2 places (and not have to extract the validation code into yet another function)
      if (cartModule.hasDelivery()) {
        fields = ["start_date", "end_date", "email", "tos", "delivery_start_time", "delivery_end_time", "phone", "address"] 
      } else {
        fields = ["start_date", "end_date", "email", "tos"] 
      }
      length = fields.length // iterate over fields that are SUPPOSED to be captured, rather than what was captured (object.keys.orderData)
      for (i = 0; i < length; i ++ ) {
        present = (orderData[fields[i]] != null);

        if (fields[i].indexOf("date") > -1) {
          valid = (orderData[fields[i]] instanceof Date)
          // end date COULD further check that it's 3 days later but given that this is programmatically built, as long as we have robust tests for the Endpoint class this is fine
        } else if (fields[i] == "email") {
          valid = validHelper.email(orderData[fields[i]])
        } else if (fields[i] == "tos") {
          valid = (orderData[fields[i]] == true)
        } else if (fields[i] == "phone") {
          valid = validHelper.phone(orderData[fields[i]])
        } else {
          valid = true
          // no special validation:
          // for start time (an integer for hte select method) or end time (a string that's programmatically calculated)
          // for address
        }

        if ( (fields[i] != "end_date" ) && (fields[i] != "delivery_end_time") ) {
          // no error fields for end_date/delivery_end_time since it's programmatically built
          $("#"+fields[i]+"_error_msg").toggleClass("hide", (present && valid) );
        }
        validations.push(present && valid);
      }

      return !(validations.indexOf(false) > -1) // if validations has a false, then that means the orderData hash is NOT valid 
    },
    get: function() {
      return orderData
    },
    clear: function() {
      orderData = {}
    },
    isPresent: function() {
      return (orderData != {})
    }
  }
})();