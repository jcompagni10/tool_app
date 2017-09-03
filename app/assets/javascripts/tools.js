var reserved_dates = [];
var total = 20;

function deliveryChange(){
    deliveryTime = $("#delivery_time").val();
    if(deliveryTime != null){
        var endTime = 1 + parseInt(deliveryTime);
        var suffix = (endTime < 12 )? "am" : "pm";
        var formatted = (endTime > 12? endTime - 12 : endTime) + ":00"+suffix
        $("#deliveryEndTime").html(formatted);
   }
   else{
    $("#deliveryEndTime").html("End Time");
   }
}

function toggleDelivery(val){
    if (val){
        $("#delivery_time").prop('disabled', false)
        $("#deliveryInput").collapse("show")
    }
    else{
        $("#delivery_time").prop('disabled', true);
        $("#deliveryInput").collapse("hide");   
    }
    deliveryChange();
}

//Change back from rails string
function reformatDate(){
    date= $("#start_date").val();
    if (date != ""){
        date = $.datepicker.parseDate("yy-mm-dd", date)   
        formattedDate = ($.datepicker.formatDate("D, M d, yy", date));     
        $("#start_date").datepicker('setDate', formattedDate);
        //updateDueDate();
    }   
}

function updateDueDate(){
    if ($("#start_date").length){
        var dueDate = $('#start_date').datepicker('getDate', '+3d'); 
        dueDate.setDate(dueDate.getDate()+3); 
        console.log(dueDate)
        var formatedDate= $.datepicker.formatDate("D, M d, yy", dueDate)
        $("#dueDate").val(formatedDate);
    }
    else{
        $("#dueDate").val("");
    }
}



function changeAddOn(addOn, state){
    prices ={"Ladder": 10, "Light": 10, "Delivery": 8};
    price = prices[addOn];
    total = total + (state ? price : - price);
    $(".totalRow .priceCol").html("$"+total);
}

function toConfirmationPage(){
    $("#page1").addClass("hide");    
    $("#page2").addClass("hide");
    $("#confirmationPage").removeClass("hide");
}


function validateCheckout(){
    var start_dateValid = ($("#start_date").val() != "")   
    $("#start_dateError").toggleClass("hide", start_dateValid)
    if (!$("#delivery").prop("checked") && start_dateValid){
        $("#page2").collapse("show");
    }
    if ($("#delivery").prop("checked")){
        var phone_valid =($("#phone").val() != "") 
        $("#phoneError").toggleClass("hide", phone_valid)
        var address_valid =($("#address").val() != "") 
        $("#addressError").toggleClass("hide", address_valid) 
        var time_valid =($("#delivery_time").val() != null) 
        $("#timeError").toggleClass("hide", time_valid) 
        if (start_dateValid && phone_valid && time_valid && address_valid){
            $("#page2").collapse("show");
        }
    }
}

function renderFullForm(){
    $("#page2").removeClass("collapse");
    $(".hideInFullForm").addClass("hide")
    $(".showInFullForm").removeClass("hide")
    
}

function DisableSpecificDates(date) {
    var date_string = jQuery.datepicker.formatDate('dd-mm-yy', date);
    return [reserved_dates.indexOf(date_string) == -1];
}

function mountDatePicker(){
    $("#start_date").datepicker({
        minDate: new Date(),
        beforeShowDay: DisableSpecificDates,
        dateFormat: "D, M d, yy"
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
    getReservedDates();
    mountStripe();
    mountDatePicker();

    //disable "start Time" in delivery menu
    $("#delivery_time option:first").prop("disabled", true)
    
})
