// Module pattern, because definitely want to obscure priceList and cart and not make them visible to bad actors who can make their own modifications and save it
// Module vs RMP? I mean, I guess if I wanted this to be super strict and have no one be able to change the public methods later I'd use RMP, but don't see a real need for htat yet (as I'm the only person working on this)
// in some cases, public method refers to private method (more RMP) IF that private method needs to be used by other private methods (e.g., getItems in cartModule is used by private function isUnique, so it must itself be a private function)

// NEXT LEARNING: how would you do a publish/subscribe where methods like set check for changes to existing and THEN act
// the only things that need to listen are NON inputs, because inputs already store the changes, and those are only needed on refresh

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
    // all other attributes later added upon change in delivery_modification

    if (item_name === "delivery") {
      // set data object so that modifications can be directly made
      $(".delivery_modification").data("itemobject", this)
    }
  }

  static isValid(item_name) {
    return $.isNumeric(itemPriceModule()[item_name])
  }
}

class Storage {
  static save(type, name, value) {
    if (type === "sessionStorage") {
      sessionStorage.setItem(name, JSON.stringify(value));
    }
  }
}

var cartModule = (function() {
  var cart = [];

  function prefillCart() {
    length = cart.length;
    for (i = 0; i < length; i++) { 
      // toolkit is default and actually is disabled
      if (i.name !== "toolkit") { $(".toggle_item[data-name='"+cart[i].name+"']").prop("checked", true); }
      if (i.name === "delivery") {
        for (attribute in i) {
          if (["delivery_start_time", "phone", "address", "instructions"].indexOf(attribute) > -1) {
            $("#" + attribute).val(i[attribute]);             
          } else if ("delivery_end_time" === attribute) {
            Endpoint.prefill("time", orderData[attr])
          }
        }
      }
    }
  }

  function getItems() { return cart.map( object => object.name ); }
  function isUnique(item_name) { return getItems().indexOf(item_name) === -1 } // for this app, could just make cart a Set, but for LMG, good practice to do things in private functions
  
  return {
    initialize: function(default_item_name) {
      storedCart = JSON.parse(sessionStorage.getItem("cart"));
      if (storedCart && storedCart.length > 0) {
        cart = storedCart; // easier than calling buildItem on each item if this were part of prefillCart iterable
        prefillCart();
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
    var end_date, end_time, suffix; 

    this.type = type // date or time
    if (start_value == null || start_value == "") {
      this.end_value = null
    } else {
      if (type == "date") {
        end_date = new Date(start_value);;
        end_date.setDate(end_date.getDate()+3);
        this.end_value = end_date
      } else {
        end_time = 1 + parseInt(start_value);
        suffix = (end_time < 12 )? "am" : "pm";
        this.end_value = (end_time > 12 ? end_time - 12 : end_time) + ":00"+suffix;    
      }
    }
    this.constructor.prefill(type, this.end_value);
  }

  static prefill(type, end_value) {
    console.log("CALLED")
    var end_field, end_text;

    if (type === "date")  {
      end_field = $("#end_date") 
      end_text = (end_value == "" || end_value == null) ? "3 days later" : dateTimeFxns.formatDateTime("date", end_value)
    } else {
      end_field = $("#delivery_end_time")
      end_text = (end_value == "" || end_value == null) ? "1 hour later" : end_value
    }
    end_field.text(end_text)
  }
}

var orderDataModule = (function() {
  var orderData = {}; // dates are always stored as JS Date objects
  // will contain start/end date, email, tos

  function prefillOrderData() {
    for (attr in orderData) {
      if (attr === "start_date") {
        $("#start_date").datepicker("setDate", orderData[attr]);
      } else if (attr === "end_date") {
        Endpoint.prefill("date", orderData[attr])
      } else {
        $("#" + attr).val(logistics[attr]); 
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
              alert("Sorry! Looks like someone just reserved the toolkit for those dates, please select new dates & try again");
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
    valid: function() {
      validations = new WeakSet(); // easier than array, because true/false only get added once, at the very end we can check if it has(false) versus go through and see if indexOf(false) exists
      // we do want to iterate through all fields rather than return the first false, because this process actually toggles error fields

      fields = ["start_date", "email", "tos"] // iterate over fields that are SUPPOSED to be captured, rather than what was captured (object.keys.orderData)
      fields.length
      for (i = 0; i < length; i ++ ) {
        valid = (orderData[fields[i]] != null && orderData[fields[i]].length > 0);
        $("#"+fields[i]+"_error").toggleClass("hide", valid);
        validations.add(valid);
      }

      return !(validations.has(false)) // if validations has a false, then that means the logistics object is NOT valid 
    },
    get: function() {
      return orderData
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
  if (orderDataModule.isPresent) {
    orderDataModule.save();
  }
});

$(document).ready(function() {
  var end_date = $("#end_date")

  cartModule.initialize("toolkit");
  orderDataModule.initialize(); // pulls reserved_dates from server and binds to an event handler for datepicker such that when datepicker is clicked, it will disable reserved_dates

  $(".toggle_item").on("change", function() {
    item_name = $(this).data("name");
    value = $(this).prop("checked");
    if (Item.isValid(item_name)) { cartModule.toggleItem(item_name, value); }
  })

  $(".delivery_modification").on("change", function() {
    item_object = $(this).data("itemobject")
    attr_name = $(this).data("name")
    value = $(this).val()
    item_object[attr_name] = value

    if (name === "delivery_start_time") {
      endpoint = new Endpoint("time", value)
      item_object.delivery_end_time = endpoint.end_value
    }
  })

  $(".order_data_field").on("change", function() {
    name = $(this).data("name");
    value = ( name == "start_date" ? $(this).datepicker('getDate') : $(this).val() )
    orderDataModule.set(name, value) // value gets passed even if null (for date) or blank string (for other fields) so that we can set the end values OR placeholder

    if (name === "start_date") {
      endpoint = new Endpoint("date", value)
      orderDataModule.set("end_date", endpoint.end_value)
    }
  })

  $("#checkoutBtn").click(function() {
    if (orderDataModule.valid() && cartModule.valid() ) {
      mountStripe();
      if ( cartModule.getItems().indexOf("delivery") > -1 ) { elementVisAndNav.deliverySection(false,true); } // hides delivery section WHILE exposing the edit_delivery link
      elementVisAndNav.fullForm();
    }
  })

  $("#submitButton").click(function(e) {
    e.preventDefault();
    if (orderDataModule.valid() && cartModule.valid() && paymentValid() ) { // is it overkill to validate AGAIN?
      // no stripe validation because it's live and controlled by stripe widget
      tokenHandler();
    }
  })
})


    