function mountUserActions(){
  
  $(".toggle_item").on("change", function() {
    console.log("change triggered");
    
    item_name = $(this).data("name");
    value = $(this).prop("checked");
    if (Item.isValid(item_name) && cartModule.isUnique(item_name)) { 
      cartModule.toggleItem(item_name, value); 
    }
  });

  $(".order_data_field").on("change", function() {
    id = $(this).attr("id")
    value = ( id == "start_date" ? $(this).datepicker('getDate') : $(this).val() )
    orderDataModule.set(id, value) // value gets passed even if null (for date) or blank string (for other fields) so that we can set the end values OR placeholder

    if (id.indexOf("start") > -1 ) {
      type = (id.indexOf("date") > -1 ? "date" : "time")
      endpoint = new Endpoint(type, value) // endpoint auto triggers a change in the end order_data_field, which is how the data gets passed to this function again and therefore set into the orderDataModule
    }
  });

  $("#checkoutBtn").click(function() {
    // we only want to check if cart isValid. OrderData will always be invalid because user has not had a chance to add email and accept TOS
    if (cartModule.isValid() ) {
      mountStripe();
      if ( cartModule.getItems().indexOf("delivery") > -1 ) { elementVisAndNav.deliverySection(false,true); } // hides delivery section WHILE exposing the edit_delivery link
      elementVisAndNav.fullForm();
    } else{
      console.log("invalid");
      debugger
    } 
  });

  $("#submitButton").click(function(e) {
    e.preventDefault();
    if (orderDataModule.isValid() && cartModule.isValid() ) { // is it overkill to validate AGAIN?
      // no stripe validation because it's live and controlled by stripe widget
      tokenHandler();
    }
  });

}

// mount user actions only once page has loaded
$(()=>mountUserActions());