// Create a Stripe client
var stripe = Stripe('pk_test_X1gaLPxnMAXc1bXktUMQgeTW');

// Create an instance of Elements
var elements = stripe.elements();

// Custom styling can be passed to options when creating an Element.
// (Note that this demo uses a wider set of styles than the guide below.)
var style = {
  base: {
    color: '#32325d',
    lineHeight: '24px',
    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    fontSmoothing: 'antialiased',
    fontSize: '16px',
    '::placeholder': {
      color: '#aab7c4'
    }
  },
  invalid: {
    color: '#fa755a',
    iconColor: '#fa755a'
  }
};

// Create an instance of the card Element
var card = elements.create('card', {style: style});



function mountStripe(){
    // Add an instance of the card Element into the `card-element` <div>
    card.mount('#card-element');

    // Handle real-time validation errors from the card Element.
    card.addEventListener('change', function(event) {
        var displayError = document.getElementById('card-errors');
        if (event.error) {
            displayError.textContent = event.error.message;
        } else {
            displayError.textContent = '';
        }
    });
    
    //Enable submit button once stripe mounted
    $("#submitButton").prop("disabled", false)

}

window.addEventListener('resize', function(event) {
    if (window.innerWidth <= 450) {
      card.update({style: {base: {fontSize: '13px'}}});
    } else {
        card.update({style: {base: {fontSize: '16px'}}});
    }
  });
  
function tokenHandler(e){    
    $("#submitButton").prop("disabled", true)
    e.preventDefault()

    stripe.createToken(card).then(function(result){        
        if (result.error) {
            // Inform the user if there was an error
            var errorElement = document.getElementById('card-errors');
            errorElement.textContent = result.error.message;
            $("#submitButton").prop("disabled", false)

        }
        //no result created ie. Stripe not loaded
        else {            
            $("#reservation_stripe").val(result.token.id)
            //submit form
            $("#reservation_form").trigger('submit.rails');

        }
    })
}