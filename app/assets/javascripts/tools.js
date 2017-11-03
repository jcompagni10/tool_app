// Module pattern, because definitely want to obscure priceList and cart and not make them visible to bad actors who can make their own modifications and save it
// Module vs RMP? I mean, I guess if I wanted this to be super strict and have no one be able to change the public methods later I'd use RMP, but don't see a real need for htat yet (as I'm the only person working on this)
// in some cases, public method refers to private method (more RMP) IF that private method needs to be used by other private methods (e.g., getItems in cartModule is used by private function isUnique, so it must itself be a private function)

// will be a gon object in regular LMG to preserve its privacy
var itemPriceModule = (function() {
  return {
    toolkit:1500,
    ladder:1000,
    light:1000, 
    delivery:800
  }
})

class Item {
  constructor(item_name) {
    this.name = item_name
    this.price = itemPriceModule()[item_name]
  }

  static isValid(item_name) {
    return $.isNumeric(itemPriceModule()[item_name])
  }
}

class Storage {
  // maybe it doens't make sense and you should just have an object method Object.prototype.saveToStorage

  static save(type, name, value) {
    if (type === "sessionStorage") {
      sessionStorage.setItem(name, JSON.stringify(value));
    }
  }
}

var cartModule = (function() {
  var cart = [];

  function preselectCart() {
    length = cart.length;
    for (i = 0; i < length; i++) { 
      // toolkit is default and actually is disabled
      if (i.name !== "toolkit") { $(".toggle_item[data-name='"+cart[i].name+"']").prop("checked", true); }
    }
  }

  function getItems() { return cart.map( object => object.name ); }
  // for this app, could just make cart a Set, but for LMG, good practice to do things in private functions
  function isUnique(item_name) { return getItems().indexOf(item_name) === -1 }
  
  return {
    initialize: function(default_item_name) {
      storedCart = JSON.parse(sessionStorage.getItem("cart"));
      if (storedCart && storedCart.length > 0) {
        cart = storedCart; // easier than calling buildItem on each item if this were part of preselectCart iterable
        preselectCart();
      } else { 
        if (Item.isValid(default_item_name)) { cartModule.toggleItem(default_item_name, true) }
      }
    },
    toggleItem: function(item_name, value) {
      if (item_name == "delivery") { elementVisAndNav.deliverySection(value) } 
      if (value) {
        if (isUnique(item_name)) { cart.push(new Item(item_name)); }
      } else {
        index = cart.findIndex(object => object.name === item_name);
        if (index > -1) { cart.splice(index, 1) }
      }
    },
    getItems: getItems,
    getTotal: function() {
      return cart.reduce((sum,object) => sum + object.price, 0);
    },
    save: function() { 
      if (cart.length) { Storage.save("sessionStorage", "cart", cart) }
    },
    isValid: function() {
      return cart.length > 0
    },
    clear: function() {
      cart = []
    }
  }
})();

class Endpoint {
  constructor(type, start_value) {
    this.type = type // date or time
    this.start_value = start_value
  }

  calculate() {
    if (this.type == "date") {
      end_date = new Date(start_value);;
      end_date.setDate(end_date.getDate()+3);
      return end_date
    } else {
      end_time = 1 + parseInt(start_value);
      suffix = (end_time < 12 )? "am" : "pm";
      return (end_time > 12 ? end_time - 12 : end_time) + ":00"+suffix;    
    }
  }
}

var logisticsModule = (function() {
  var logistics = {}; // dates are always stored as JS Date objects

  // NEXT STEP USE TIMEPICKER
  var showEndText = {
    date: function(end_date = '3 days later') {
      $("#end_date").text(end_date)
    },
    time: function(end_time = '1 hour later') {
      $("#delivery_end_time").text(end_time)
    }
  }

  function setData(name, value) {
    logistics[name] = value;
    if (name.indexOf("start") > -1) {
      type = name.indexOf("date") > -1 ? "date" : "time";
      if (value == "" || value == null) {
        showEndText[type]();
      } else {
        end_value = calculateEndData[type](value);
        setData(name.replace("start", "end"), end_value);
        showEndText[type](dateTimeFxns.formatDateTime(type,end_value));
      }
    }
  }
  function prefillLogistics() {
    for (attr in logistics) {
      if (attr.indexOf("end") > -1) {
        showEndText[attr.indexOf("date") > -1 ? "date" : "time"](logistics[attr]);
      } else if (attr === "start_date") {
        $("#start_date").datepicker("setDate", logistics[attr]);
      } else {
        $("#" + attr).val(logistics[attr]); 
      }
    }
  }

  return {
    initialize: function() {
      // assess storedLogistics first
      dateTimeFxns.getReservedDates.then(
        function(reserved_dates) {
          console.log("success was cuaght with resrved dates passed to be used as " + reserved_dates)
          storedLogistics = JSON.parse(sessionStorage.getItem("logistics"), function(key, value) {
            if (key.indexOf("date") > -1) { return new Date(value) }; // converts JSON back into time objects
            return value;
          })
          if (storedLogistics) {
            if (reserved_dates.indexOf(storedLogistics.start_date.getTime()) > -1) {
              alert("Sorry! Looks like someone just reserved the toolkit for those dates, please select new dates & try again");
              storedLogistics.start_date = null;
              storedLogistics.end_date = null;
            }
            logistics = storedLogistics;
            prefillLogistics();
          }
        }, 
        function(error) { 
          // the getReservedDates shows the alert
          console.log(error) 
        }
      )
    },
    setData: setData, // private function so that we can use it with setEnd, which is itself a private function
    save: function() {
        new Storage("sessionStorage", logistics).save()
    },
    valid: function() {
      validations = new WeakSet(); // easier than array, because true/false only get added once, at the very end we can check if it has(false) versus go through and see if indexOf(false) exists
      // we do want to iterate through all fields rather than return the first false, because this process actually toggles error fields

      start_date_valid = (logistics.start_date != null)
      $("#start_date_error").toggleClass("hide", !start_date_valid)
      validations.add(start_date_valid)

      if (cartModule.getItems().indexOf("delivery") > -1) {
        fields = ["phone", "delivery_start_time", "address"];
        length = fields.length;
        for (i = 0; i < length; i ++ ) {
          valid = (logistics[fields[i]].length > 0);
          $("#"+fields[i]+"_error").toggleClass("hide", valid);
          validations.add(valid);
        }
      }

      return !(validations.has(false)) // if validations has a false, then that means the logistics object is NOT valid 
    }
  }
})();

var paymentModule = (function() {
  var payment = {};
  function prefillPayment() {
    for (attr in payment) { $("#" + attr).val(payment[attr]); }
  }
  
  return {
    initialize: function() {
      storedPayment = JSON.parse(sessionStorage.getItem("payment"));
      if (storedPayment) {
        payment = storedPayment;
        prefillPayment();
      } 
    },
    setData: function(name, value) {
      payment[name] = value;
    },
    save: function() {
      new Storage("sessionStorage", cart).payment()
    },
    valid: function() {
      validations = new WeakSet(); // easier than array, because true/false only get added once, at the very end we can check if it has(false) versus go through and see if indexOf(false) exists
      // we do want to iterate through all fields rather than return the first false, because this process actually toggles error fields
      fields = ["email", "tos"];
      length = fields.length;
      for (i = 0; i < length; i ++ ) {
        valid = (logistics[fields[i]] != null && logistics[fields[i]].length > 0);
        $("#"+fields[i]+"_error").toggleClass("hide", valid);
        validations.add(valid);
      }

      return !(validations.has(false)) // if validations has a false, then that means the logistics object is NOT valid 
    }
  }
})();

var dateTimeFxns = {
  reserved_dates: [],
  // date parameter is auto fed as part of beforeShowDay
  // FIX THIS LATER
  disableSpecificDates: function(date) {
    var timestamp = parseInt(jQuery.datepicker.formatDate('@', date));
    // console.log($.type(timestamp))
    // console.log($.type(reserved_dates[0]))
    // console.log("for date " + date + " :: " + [reserved_dates] + " " + " indexOf " + timestamp + " result is " + [reserved_dates].indexOf(timestamp))
    // console.log([!([reserved_dates].indexOf(timestamp) > -1)])
    // console.log([reserved_dates].indexOf(timestamp) === -1)
    return [[this.reserved_dates].indexOf(timestamp) === -1];
  },
  getReservedDates: new Promise(function(resolve, reject) {
    console.log("in get reserved dates")
    // technically could replace this with gon, since it's on initialize gon would be the fastest/ make most sense but gon is NOT TESTABLE omg... (that and I could always use more AJAX practice)
    $.ajax({
      url: "/getReservedDates",
      method: "GET",
      dataType: "json"
    })
    .done(function(result){
      resolve(result)
      console.log("in success with result = ")
      console.log(result)
      this.reserved_dates = result;
      $("#start_date").datepicker({
        minDate: new Date(),
        beforeShowDay: this.disableSpecificDates,
        dateFormat: "D, M d, yy"
      });
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
      reject(new Error(errorThrown))
      // alert("Something isn't working right. Make sure you have JavaScript enabled in your browser, then refresh this page");
    })
  }),
  formatDateTime: function(type, value) {
    if (type == "date") {
      days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return days[value.getDay()] + ", " + months[value.getMonth()] + " " + value.getDate() + ", " + value.getFullYear();
    } else {
    }
  }
}


var elementVisAndNav = {
  deliverySection: function(show, show_link) {
    if (show == true) {
      delivery_start_time.prop('disabled', false)
      delivery_input_section.collapse("show")
    } else {
      delivery_start_time.prop('disabled', true);
      delivery_input_section.collapse("hide"); 
      edit_delivery_link.toggleClass("hide", !show_link) // if show_link is true, then we removeClass hide
    }
  },
  fullForm: function() {
    $("#page2").removeClass("collapse");
    $(".hideInFullForm").addClass("hide")
    $(".showInFullForm").removeClass("hide")

    if (delivery) {
      // for page re-renders
      $(".toggle_item[data-type='delivery']").prop("checked", true)
      $("#edit_delivery").removeClass("hide")
    }
    this.scrollTo("#page2");
  },
  confirmationPage: function() {
    $("#page1").addClass("hide");    
    $("#page2").addClass("hide");
    $("#confirmationPage").removeClass("hide");
  },
  scrollTo: function(anchor) {
    $('.mainContent').scrollTop($(anchor).offset().top);
  }
}

$(window).on('beforeunload', function(){
  if (cartModule.getItems().length > 1) {
    cartModule.save();
  }
  if (logisticsModule.isPresent) {
    logisticsModule.save();
  }
});

$(document).ready(function() {
  var end_date = $("#end_date")

  cartModule.initialize("toolkit");
  logisticsModule.initialize(); // pulls reserved_dates from server and binds to an event handler for datepicker such that when datepicker is clicked, it will disable reserved_dates

  $(".toggle_item").on("change", function() {
    item_name = $(this).data("name");
    value = $(this).prop("checked");
    if (Item.isValid(item_name)) { cartModule.toggleItem(item_name, value); }
  })

  $(".logistics_field").on("change", function() {
    name = $(this).data("name");
    value = ( name == "start_date" ? $(this).datepicker('getDate') : $(this).val() )
    logisticsModule.setData(name, value) // value gets passed even if null (for date) or blank string (for other fields) so that we can set the end values OR placeholder
  })

  $("#checkoutBtn").click(function() {
    if (logisticsModule.valid() && cartModule.valid() ) {
      mountStripe();
      if ( cartModule.getItems().indexOf("delivery") > -1 ) { elementVisAndNav.deliverySection(false,true); } // hides delivery section WHILE exposing the edit_delivery link
      elementVisAndNav.fullForm();

      paymentModule.initialize();

      $(".payment_field").on("change", function() {
        name = $(this).data("name");
        value = $(this).val();
        paymentModule.setData(name, value) // value gets passed even if null (for date) or blank string (for other fields) so that we can set the end values OR placeholder
      })
    }
  })

  $("#submitButton").click(function(e) {
    e.preventDefault();
    if (logisticsModule.valid() && cartModule.valid() && paymentValid() ) { // is it overkill to validate AGAIN?
      // no stripe validation because it's live and controlled by stripe widget
      tokenHandler();
    }
  })
})


    