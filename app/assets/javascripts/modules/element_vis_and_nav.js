var elementVisAndNav = {
  deliverySection: function(show, show_link) {
    if (show == true) {
      $("#delivery_start_time").prop('disabled', false)
      $("#deliveryInput").collapse("show")
    } else {
      $("#delivery_start_time").prop('disabled', true);
      $("#deliveryInput").collapse("hide"); 
      $("#edit_delivery").toggleClass("hide", !show_link) // if show_link is true, then we removeClass hide
    }
  },
  fullForm: function() {
    $("#page2").collapse("show");
    $("#checkoutBtn").addClass("hide");
    $("#totalRow").removeClass("hide");

    if (cartModule.hasDelivery()) {
      this.deliverySection(false,true)
    }
    this.scrollToAnchor("#page2");
  },
  confirmationPage: function() {
    $("#page1").addClass("hide");    
    $("#page2").addClass("hide");
    $("#confirmationPage").removeClass("hide");
  },
  scrollToAnchor: function(anchor) {
    $('.mainContent').scrollTop($(anchor).offset().top);
  }
}