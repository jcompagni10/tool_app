var reserved_dates = [];

function deliveryChange(){
    var endTime = 1 + parseInt($("#delivery_time").val());
    var suffix = (endTime < 12 )? "am" : "pm";
    var formatted = (endTime > 12? endTime - 12 : endTime) + suffix
    $("#deliveryEndTime").html(formatted);
}

function toggleDelivery(val){
    if (val){
        $("#delivery_time").prop('disabled', false)
        $("#deliveryInput").toggleClass("hidden")
    }
    else{
        $("#delivery_time").prop('disabled', true)
        $("#deliveryInput").toggleClass("hidden")
    }
    deliveryChange();
}
    

function updateDueDate(resDate){
    if ($("#start_date").length){
        dueBack= new Date();
        dueBack.setDate(( $("#start_date").datepicker('getDate').getDate() + 3))
        var formatDate= dueBack.getMonth()+1+'/'+dueBack.getDate()+'/'+dueBack.getFullYear();
        $(".dueDate").html(" on " + formatDate);
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

function toPage3(){
    $("#page1").addClass("hide");    
    $("#page2").addClass("hide");
    $("#page3").removeClass("hide");
}

function renderFullForm(){
    $("#page1").removeClass("hide");
    $("#page2").removeClass("hide");
    $(".hiddenInFullForm").addClass("hide")
}

function DisableSpecificDates(date) {
    var date_string = jQuery.datepicker.formatDate('dd-mm-yy', date);
    return [reserved_dates.indexOf(date_string) == -1];
}

function mountDatePicker(){
    $("#start_date").datepicker({
        minDate: new Date(),
        beforeShowDay: DisableSpecificDates
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
