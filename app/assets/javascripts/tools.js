var reserved_dates = [];

function deliveryChange(){
    var endTime = 1 + parseInt($("#delivery_time").val());
    var suffix = (endTime < 12 )? "am" : "pm";
    var formatted = (endTime > 12? endTime - 12 : endTime) + ":00"+suffix
    $("#deliveryEndTime").html(formatted);
}

function toggleDelivery(val){
    if (val){
        $("#delivery_time").prop('disabled', false)
        $("#deliveryInput").collapse("show")
    }
    else{
        $("#delivery_time").prop('disabled', true)
        $("#deliveryInput").collapse("hide")
    }
    deliveryChange();
}
    

function updateDueDate(resDate){
    if ($("#start_date").length){
        var dueDate = $('#start_date').datepicker('getDate', '+3d'); 
        dueDate.setDate(dueDate.getDate()+3); 
        var formatDate= $.datepicker.formatDate("DD, MM d, yy", dueDate)
        $(".dueDate").html(formatDate);
    }
    else{
        $(".dueDate").html("");
    }
}

function toPage1(){
    $("#page2").addClass("hide");
    $("#page1").removeClass("hide");
}

function toPage2(){
    $("#page1").addClass("hide");
    $("#page2").removeClass("hide");
    var total = 20;
    if ($("#reservation_ladder").prop("checked")){
        total += 10;
        $(".Ladder_Row").removeClass("hidden")
    }
    if ($("#reservation_light").prop("checked")){
        total += 10;
        $(".Light_Row").removeClass("hidden")
    }
    if ($("#delivery").prop("checked")){
        total += 8;
        $(".Delivery_Row").removeClass("hidden")
    }
    $(".Total_Row .priceCol").html("$"+total)
}

function toPage3(){
    $("#page1").addClass("hide");    
    $("#page2").addClass("hide");
    $("#page3").removeClass("hide");
}

function renderFullForm(){
    $("#page1").removeClass("hide");
    $("#page2").removeClass("hide");
    $(".hideInFullForm").addClass("hide")
}

function DisableSpecificDates(date) {
    var date_string = jQuery.datepicker.formatDate('dd-mm-yy', date);
    return [reserved_dates.indexOf(date_string) == -1];
}

function mountDatePicker(){
    $("#start_date").datepicker({
        minDate: new Date(),
        beforeShowDay: DisableSpecificDates,
        dateFormat: "DD, MM d, yy"
        })
}

function getReservedDates(){
    request = $.ajax({
        url: "/getReservedDates",
        method: "GET",
        dataType: "json"
      })
      .success(function(result){
        reserved_dates = result
      })
      .fail(function(){
          alert("Something isn't working right. Make sure you have JavaScript enabled in your browser");
      });
}

$(document).ready(function(){
    //Get reserved dates w/ ajax

    getReservedDates();
    mountStripe();
    mountDatePicker();
    //Init Datepicker

    
})
