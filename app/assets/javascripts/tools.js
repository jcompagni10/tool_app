var reserved_dates = [];
var total = 20;

function deliveryChange(){
    deliveryTime = $("#delivery_time").val();
    if(deliveryTime != null && deliveryTime != ""){
        var endTime = 1 + parseInt(deliveryTime);
        var suffix = (endTime < 12 )? "am" : "pm";
        var formatted = (endTime > 12? endTime - 12 : endTime) + ":00"+suffix
        $("#deliveryEndTime").text(formatted);
   }
   else{
    $("#deliveryEndTime").text("1 hour later");
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
    // JAMES: not incremental to call delivery charge every time, should actually only be called when delivery_time.val changes
    deliveryChange();
}

//Change back from rails string
function reformatDate(){
    date= $("#start_date").val();
    if (date != ""){
        date = $.datepicker.parseDate("yy-mm-dd", date)   
        formattedDate = ($.datepicker.formatDate("D, M d, yy", date));
        $("#start_date").datepicker("setDate", date)     
        $("#start_date").val(formattedDate);
        updateDueDate();
    }   
}

// JAMES: call when start_date changes?
function updateDueDate(){
    if ($("#start_date").length){
        var dueDate = $('#start_date').datepicker('getDate', '+3d'); 
        dueDate.setDate(dueDate.getDate()+3); 
        console.log(dueDate)
        var formatedDate= $.datepicker.formatDate("D, M d, yy", dueDate)
        $("#dueDate").val(formatedDate);
    }
    else{
        $("#dueDate").val("3 days later");
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

function scrollTo(anchor){
    $('.mainContent').scrollTop($(anchor).offset().top);
}

function validateCheckout(){
    var start_dateValid = ($("#start_date").val() != "")   
    $("#start_dateError").toggleClass("hide", start_dateValid)
    if (!$("#delivery").prop("checked") && start_dateValid){
        renderFullForm();
        scrollTo("#page2")
    }
    if ($("#delivery").prop("checked")){
        var phone_valid =($("#phone").val() != "") 
        $("#phoneError").toggleClass("hide", phone_valid)
        var address_valid =($("#address").val() != "") 
        $("#addressError").toggleClass("hide", address_valid) 
        var time_valid =($("#delivery_time").val() != null) 
        $("#timeError").toggleClass("hide", time_valid) 
        if (start_dateValid && phone_valid && time_valid && address_valid){
            renderFullForm();
            scrollTo("#page2")
        }
    }
}

function renderFullForm(){
    $("#page2").removeClass("collapse");
    $(".hideInFullForm").addClass("hide")
    $(".showInFullForm").removeClass("hide")
    
}

// JAMES: where is 'date' coming from??
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

// JAMES: pass variables, dont' declare the variable in a sub-function
$(document).ready(function(){
    getReservedDates();
    mountStripe();
    mountDatePicker();

    
})
