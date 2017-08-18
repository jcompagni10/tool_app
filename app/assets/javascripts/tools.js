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
        $("#deliveryInput").show()
    }
    else{
        $("#delivery_time").prop('disabled', true)
        $("#deliveryInput").hide()
    }
    deliveryChange;

}

function toggleReserve(){
    reserveNow = !reserveNow;
    if (!reserveNow){
        $(".reserveDate").show();
    }
}

function changeResMonth(month){
    $("#start_date_3i option").prop('disabled', false)
    var reserved_days;
    if (reserved_days = reserved_dates[month]){
        reserved_days.forEach(function(n){
            $("#start_date_3i option[value="+n+"]").prop('disabled', true)
        })  
    }
    updateDueDate()
}

function updateDueDate(){
    var day
    if (day = $("#start_date_3i").val()){
        var year = $("#start_date_1i").val();
        var month = $("#start_date_2i").val();
        var dueBack = new Date(year, month-1, parseInt(day) + 3);
        var formatDate= dueBack.getMonth()+1+'/'+dueBack.getDate()+'/'+dueBack.getFullYear();
        $(".dueDate").html(" on " + formatDate);
    }
    else{
        $(".dueDate").html("");
    }
}
$(window).load(function(){
    changeResMonth($("#start_date_2i").val());
})