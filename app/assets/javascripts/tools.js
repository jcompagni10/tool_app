var reserveNow = true;
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

function DisableSpecificDates(date) {
    var date_string = jQuery.datepicker.formatDate('dd-mm-yy', date);
    return [reserved_dates.indexOf(date_string) == -1];
}

function tosAgree(btn){
    $("#reservation_tos").prop("checked", "true")
    $(btn).prop("disabled", "true")
    $("#tos").modal('toggle')
}

function updateDueDate(resDate){
    console.log(resDate)
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

function toCheckout(){
    $("#page1").toggleClass("hidden");
    $("#page2").toggleClass("hidden");
}

function back(){
    $("#page2").toggleClass("hidden");
    $("#page1").toggleClass("hidden");
}

$(document).ready(function(){
    $("#start_date").datepicker({
      minDate: new Date(),
      beforeShowDay: DisableSpecificDates
      })
})
