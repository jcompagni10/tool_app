var pageActions = {
  // cannot test what's directly wrapped in a document ready (unclear about window beforeunload, but likely similar situation), need another wrapper function
  // i.e., the test is that calling initialize calls the statements below, there is NO test that document.ready calls this initialize function
  // for a small app this makes no sense, because you're just as likely to mistype document.ready(inititialize) as you are to type the two simple lines below
  // but again this is practice for something larger
  // NOTE, this wrapper has to be a variable, not just a named function, no way to call that in a test (i.e., initialize() would throw an undefined error)
  initialize: function() {
    console.log("here in iitnialize")
    cartModule.initialize("toolkit");
    orderDataModule.initialize(); // pulls reserved_dates from server and binds to an event handler for datepicker such that when datepicker is clicked, it will disable reserved_dates
  },
  save: function() {
    if (cartModule.getItems().length > 0) {
      cartModule.save();
    }
    if (orderDataModule.isPresent()) {
      orderDataModule.save();
    }
  },
  testing: function() {
    return 1
  }
}

$(window).on('beforeunload', pageActions.save);
$(document).ready(pageActions.initialize);
