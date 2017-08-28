var reserved_dates = [];
var total = 20;

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

//Change back from rails string
function reformatDate(){
    date= $("#start_date").val();
    date = $.datepicker.parseDate("yy-mm-dd", date)
    if (date != ""){
        $("#start_date").val($.datepicker.formatDate("DD, MM d, yy", date));
        updateDueDate();
    }
}

function updateDueDate(){
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
}

function changeAddOn(addOn, state){
    prices ={"Ladder": 10, "Light": 10, "Delivery": 8};
    $("."+addOn+"_Row").toggleClass("hidden", !state);
    price = prices[addOn];
    total = total + (state ? price : - price);
    $(".Total_Row .priceCol").html("$"+total);
}

function toPage3(){
    $("#page1").addClass("hide");    
    $("#page2").addClass("hide");
    $("#page3").removeClass("hide");
}

function validateCheckout(){
    var start_dateValid = ($("#start_date").val() != "")   
    $("#start_dateError").toggleClass("hide", start_dateValid)
    if ($("#delivery").prop("checked")){
        var phone_valid =($("#phone").val() != "") 
        $("#phoneError").toggleClass("hide", phone_valid)
        var address_valid =($("#address").val() != "") 
        $("#addressError").toggleClass("hide", address_valid) 
        console.log(start_dateValid && phone_valid && address_valid)
        if (start_dateValid && phone_valid && address_valid){
            toPage2();
        }
        return;
        
    }
    if (start_dateValid){
        toPage2();
    }
}

function renderFullForm(){
    $("#page1").removeClass("hide");
    $("#page2").removeClass("hide");
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
