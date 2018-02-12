var dateTimeFxns = {
  reserved_dates: [],
  // date parameter is auto fed as part of beforeShowDay
  // FIX THIS LATER
  disableSpecificDates: function(date) {
    var timestamp = parseInt(jQuery.datepicker.formatDate('@', date)).toString();
    // console.log($.type(timestamp))
    // console.log($.type(reserved_dates[0]))
    // console.log("for date " + date + " :: " + [reserved_dates] + " " + " indexOf " + timestamp + " result is " + [reserved_dates].indexOf(timestamp))
    // console.log([!([reserved_dates].indexOf(timestamp) > -1)])
    // console.log([reserved_dates].indexOf(timestamp) === -1)
    return [this.reserved_dates.indexOf(timestamp) === -1];
  },
  // switch to function for easier testing
  getReservedDates: function(){
    // julian: no need to make a new promise. Calling functions can just chain to existing ajax promise
    // return new Promise(function(resolve, reject) {
      // technically could replace this with gon, since it's on initialize gon would be the fastest/ make most sense but gon is NOT TESTABLE omg... (that and I could always use more AJAX practice)
    return $.ajax({
      url: "/getReservedDates",
      method: "get",
      dataType: "json"
    })
    .then(
      function(result){
        this.reserved_dates = result;
        $("#start_date").datepicker({
          minDate: new Date(),
          beforeShowDay: this.disableSpecificDates,
          dateFormat: "D, M d, yy"
        });
        return result;
      },
      function(jqXHR, textStatus, errorThrown){
        // all error handling can happen here. No need to bubble up. If you do want it to bubble up then do nothing here catch error in second arg to then in calling FXN
        console.log("caught error: ", errorThrown);
      }
    );
  },
  formatDateTime: function(type, value) {
    if (type == "date") {
      days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return days[value.getDay()] + ", " + months[value.getMonth()] + " " + value.getDate() + ", " + value.getFullYear();
    } else {
    }
  }
}