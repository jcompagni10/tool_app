// next step cookify/restore dates and see what will work

$(window).on('beforeunload', function(){
    // could do cart Lenght, but for something so simple, didn't want to create another public method
    if (cartModule.getTotal() > 1500) {
        cartModule.cookify()
    }
});

$(window).on('load', function(){
    storedCart = JSON.parse(sessionStorage.getItem("cart"))
    if (storedCart) {
        // could buildItem individually as part of for... loop, but seems like that would require way more functions and we lose teh inherent benefit of having stored the cart as a JSON
        cartModule.restore()
        
        non_toolkit_items = storedCart.filter(item => item.name !== 'toolkit')
        length = non_toolkit_items.length
        for (i = 0; i < length; i++) {
            $(".add_on[data-name='"+non_toolkit_items[i].name+"']").prop("checked", true)
        }
    }
});

var cartModule = (function() {
    var cart = []

    var priceList = {
        toolkit:1500,
        ladder:1000,
        light:1000,
        delivery:800,
    }

    cart.push(buildItem("toolkit"))

    function buildItem(name) {
        return { name:name, price:priceList[name] }
    }
    
    return {
        addItem: function(name) {
            return cart.push(buildItem(name))
        },

        removeItem: function(name) {
            index = cart.findIndex(item => item.name === name)
            return cart.splice(index, 1)
        },

        getTotal: function() {
            console.log(cart)
            total = 0
            length = cart.length
            for (i = 0; i < length; i++ ) {
                total += cart[i].price
            }
            return total
        },
        cookify: function() {
            sessionStorage.setItem("cart", JSON.stringify(cart))
        },
        restore: function() {
            cart = JSON.parse(sessionStorage.getItem("cart"))
        }
    }
})()

var logisticsModule = (function() {
    var logistics = {}
    var reserved_dates = []

    // date parameter is auto fed as part of beforeShowDay
    function disableSpecificDates(date) {
        var date_string = jQuery.datepicker.formatDate('dd-mm-yy', date);
        return [reserved_dates.indexOf(date_string) == -1];
    }


    return {
        setStartDate: function(start_date) {
            logistics.startDate = start_date
            end_date = new Date()
            end_date.setDate(start_date.getDate()+3); 
            logistics.endDate = end_date
            return logistics
        },
        setStartTime: function(start_time) {
            logistics.startTime = start_time
            endTime = 1 + parseInt(start_time);
            suffix = (endTime < 12 )? "am" : "pm";
            logistics.endTime = (endTime > 12? endTime - 12 : endTime) + ":00"+suffix
            return logistics
        },
        initDatePicker: function() {
            request = $.ajax({
                url: "/getReservedDates",
                method: "GET",
                dataType: "json"
            })
            .success(function(result){
                reserved_dates = result
                $("#start_date").datepicker({
                    minDate: new Date(),
                    beforeShowDay: disableSpecificDates,
                    dateFormat: "D, M d, yy"
                })
            })
            .fail(function(){
                alert("Something isn't working right. Make sure you have JavaScript enabled in your browser, then refresh this page");
            });
        }
    }
})()

$(document).ready(function() {
    $("#start_date").on("change", function() {
        start_date = $(this).datepicker('getDate');
        if(start_date != null && start_date != ""){
            logistics = logisticsModule.setStartDate(start_date)
            $("#end_date").text(logistics.endDate)
        } else {
            $("#end_date").text("3 days later");
        }
    })

    $("#delivery_start_time").on("change", function() {
        start_time = $(this).val();
        if(start_time != null && start_time != ""){
            logistics = logisticsModule.setStartTime(start_time)
            $("#delivery_end_time").text(logistics.endTime);
        } else {
            $("#delivery_end_time").text("1 hour later");
        }
    })

    $(".add_on").on("change", function() {
        name = $(this).data("name")
        value = $(this).prop("checked")
        value == true ? cartModule.addItem(name) : cartModule.removeItem(name)
        if (name == "delivery") {
            toggleDelivery(value)
        }
    })
})


$(document).ready(function() {
    logisticsModule.initDatePicker()
    // mountDatePicker();

    // var total = 20;
    // var prices ={"ladder": 10, "light": 10, "delivery": 8};

    // $("#start_date").on("change", function() {
    //     start_date = $('#start_date').datepicker('getDate');
    //     if(start_date != null && start_date != ""){
    //         end_date = new Date()
    //         end_date.setDate(start_date.getDate()+3); 
    //         $("#end_date").text(end_date);
    //     } else {
    //         $("#end_date").text("3 days later");
    //     }
    // })


    // $("#delivery_start_time").on("change", function() {
    //     start_time = $(this).val();
    //     if(start_time != null && start_time != ""){
    //         end_time = calculateDeliveryEndTime(start_time)
    //         $("#delivery_end_time").text(end_time);
    //     } else {
    //         $("#delivery_end_time").text("1 hour later");
    //     }
    // })

    // function calculateDeliveryEndTime(start_time) {
    //     endTime = 1 + parseInt(start_time);
    //     var suffix = (endTime < 12 )? "am" : "pm";
    //     return (endTime > 12? endTime - 12 : endTime) + ":00"+suffix
    // }

    // $(".add_on").on("change", function() {
    //     type = $(this).data("type")
    //     value = $(this).prop("checked")
    //     toggleAddOn(type, value)
    //     if (type == "delivery") {
    //         toggleDelivery(value)
    //     }
    // })

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
            if (show_edit) {
                $("#edit_delivery").removeClass("hide")
            } else {
                $("#edit_delivery").addClass("hide")
            }
        }
    }

    // function toggleAddOn(addOn, state){
    //     price = prices[addOn];
    //     total = total + (state ? price : - price);
    //     $("#total_price").html("$"+total);
    // }

    $("#submitButton").click(function(e) {
        e.preventDefault()
        tokenHandler()
    })

    $("#checkoutBtn").click(function() {
        validateCheckout();
    })

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
                // toggleDelivery({"section_view":false, "edit_view": true})
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
        console.log("render full form with delivery = " + delivery)
        $("#page2").removeClass("collapse");
        console.log("render full form with delivery = " + delivery)
        $(".hideInFullForm").addClass("hide")
        console.log("render full form with delivery = " + delivery)
        $(".showInFullForm").removeClass("hide")
        console.log("render full form with delivery = " + delivery)

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

    // function mountDatePicker(initial_start_date){
    //     console.log("mount date picker with initial_start_date = " + initial_start_date)
    //     if (initial_start_date != "" && initial_start_date != null){
    //         start_date = $.datepicker.parseDate("yy-mm-dd", initial_start_date)   
    //         formatted_start_date = ($.datepicker.formatDate("D, M d, yy", start_date));
    //         $("#start_date").datepicker("setDate", formatted_start_date) 

    //         // not incremental to trigger change in start_date, since this requires you to call .datepicker on #start_date when you already have its value here
    //         end_date = calculateEndDate(start_date)
    //         $("#end_date").val(end_date);
    //     }   

    //     reserved_dates = []
    //     getReservedDates()
    //     $("#start_date").datepicker({
    //         minDate: new Date(),
    //         beforeShowDay: disableSpecificDates,
    //         dateFormat: "D, M d, yy"
    //     })
    // }

    // // date parameter is auto fed as part of beforeShowDay
    // function disableSpecificDates(date) {
    //     var date_string = jQuery.datepicker.formatDate('dd-mm-yy', date);
    //     return [reserved_dates.indexOf(date_string) == -1];
    // }

    // function getReservedDates(){
    //     request = $.ajax({
    //         url: "/getReservedDates",
    //         method: "GET",
    //         dataType: "json"
    //       })
    //       .success(function(result){
    //         reserved_dates = result
    //       })
    //       .fail(function(){
    //         alert("Something isn't working right. Make sure you have JavaScript enabled in your browser");
    //       });
    // }
})