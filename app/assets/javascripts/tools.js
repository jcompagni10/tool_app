var total = 20;
var prices ={"ladder": 10, "light": 10, "delivery": 8};

function calculateEndDate(start_date) {
    end_date = new Date()
    end_date.setDate(start_date.getDate()+3); 
    return $.datepicker.formatDate("D, M d, yy", end_date)
}

function calculateDeliveryEndTime(start_time) {
    endTime = 1 + parseInt(start_time);
    var suffix = (endTime < 12 )? "am" : "pm";
    return (endTime > 12? endTime - 12 : endTime) + ":00"+suffix
}

function toggleDelivery(state, show_edit){
    if (state){
        $("#delivery_start_time").prop('disabled', false)
        $("#deliveryInput").collapse("show")

        // repopulates end_time if this is a page re-render
        start_time = $("#delivery_start_time").val();
        if(start_time != null && start_time != ""){
            end_time = calculateDeliveryEndTime(start_time)
            end_time_field = $("#delivery_end_time")
            if (end_time_field.text() != end_time) {
                end_time_field.text(end_time)
            }
        } 

        // as long as delivery section is showing, neve need to show edit link
    }else{
        $("#delivery_start_time").prop('disabled', true);
        $("#deliveryInput").collapse("hide");   

        // shows edit link if delivery exists (i.e., if it was passed on render full form)
        $("#edit_delivery").removeClass("hide")
    }
}

function toggleAddOn(addOn, state){
    price = prices[addOn];
    total = total + (state ? price : - price);
    $("#total_price").html("$"+total);
}

function validateCheckout(){
    var start_dateValid = ($("#start_date").val() != "")   
    $("#start_dateError").toggleClass("hide", start_dateValid)
    if ($(".add_on[data-type='delivery']").prop("checked") == true){
        var phone_valid =($("#phone").val() != "") 
        $("#phoneError").toggleClass("hide", phone_valid)
        var address_valid =($("#address").val() != "") 
        $("#addressError").toggleClass("hide", address_valid) 
        var time_valid =($("#delivery_start_time").val() != null) 
        $("#timeError").toggleClass("hide", time_valid) 
        if (start_dateValid && phone_valid && time_valid && address_valid){
            renderFullForm();
            toggleDelivery(false, true); // hides this section, which user can then pop out via "edit"
            toggleDelivery({"section_view":false, "edit_view": true})
            scrollTo("#page2")
        }
    } else {
        if (start_dateValid) {
            renderFullForm();
            scrollTo("#page2")
        }
    }
}

function renderFullForm(delivery){
    $("#page2").removeClass("collapse");
    $(".hideInFullForm").addClass("hide")
    $(".showInFullForm").removeClass("hide")

    if (delivery) {
        // for page re-renders
        $(".add_on[data-type='delivery']").prop("checked", true)
        $("#edit_delivery").removeClass("hide")
    }
    mountStripe()
}

function toConfirmationPage(){
    $("#page1").addClass("hide");    
    $("#page2").addClass("hide");
    $("#confirmationPage").removeClass("hide");
}

function scrollTo(anchor){
    $('.mainContent').scrollTop($(anchor).offset().top);
}

function mountDatePicker(initial_start_date){
    if (initial_start_date != "" && initial_start_date != null){
        start_date = $.datepicker.parseDate("yy-mm-dd", initial_start_date)   
        formatted_start_date = ($.datepicker.formatDate("D, M d, yy", start_date));
        $("#start_date").datepicker("setDate", formatted_start_date) 

        // not incremental to trigger change in start_date, since this requires you to call .datepicker on #start_date when you already have its value here
        end_date = calculateEndDate(start_date)
        $("#end_date").val(end_date);
    }   

    reserved_dates = []
    getReservedDates()
    $("#start_date").datepicker({
        minDate: new Date(),
        beforeShowDay: disableSpecificDates,
        dateFormat: "D, M d, yy"
    })
}

// date parameter is auto fed as part of beforeShowDay
function disableSpecificDates(date) {
    var date_string = jQuery.datepicker.formatDate('dd-mm-yy', date);
    return [reserved_dates.indexOf(date_string) == -1];
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


function documentLoaded() {
    mountDatePicker();

    $("#start_date").on("change", function() {
        start_date = $('#start_date').datepicker('getDate');
        if(start_date != null && start_date != ""){
            end_date = calculateEndDate(start_date)
            $("#end_date").text(end_date);
        } else {
            $("#end_date").text("3 days later");
        }
    })

    $("#delivery_start_time").on("change", function() {
        start_time = $(this).val();
        if(start_time != null && start_time != ""){
            end_time = calculateDeliveryEndTime(start_time)
            $("#delivery_end_time").text(end_time);
        } else {
            $("#delivery_end_time").text("1 hour later");
        }
    })


    $(".add_on").on("change", function() {
        type = $(this).data("type")
        value = $(this).prop("checked")
        toggleAddOn(type, value)
        if (type == "delivery") {
            toggleDelivery(value)
        }
    })

    $("#submitButton").click(function(e) {
        e.preventDefault()
        tokenHandler()
    })

    $("#checkoutBtn").click(function() {
        validateCheckout();
    })
}

$(document).ready(documentLoaded)