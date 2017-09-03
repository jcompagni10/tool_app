
describe ('deliveryChange', function(){
    beforeEach(function(){
        affix("#delivery_time");   
        affix("#deliveryEndTime"); 
    })

    it ('formats the return time properly',function(){
        $("#delivery_time").val(12);
        deliveryChange()
        expect($("#deliveryEndTime").html()).toBe("1:00pm")
    })
})



describe('reformatDate & updateDueDate', function(){
    beforeEach(function(){
        affix("#start_date");
        mountDatePicker();        
        affix("#dueDate");
        $("#start_date").val("2017-12-29" );
        reformatDate();
    })

    it("formats date from ruby date to full date", function(){
        expect($("#start_date").val()).toBe("Fri, Dec 29, 2017");
    })

    it("it formats due date", function(){
        expect($("#dueDate").val()).toBe("Mon, Jan 1, 2018");
    })
})

describe("changeAddOn", function(){
    beforeEach(function(){
        affix("table");
        $("table").html("<tr class='totalRow'><td class='priceCol'></td></tr>");
        total = 20;
    })

    it("it adds a ladder",function(){
        changeAddOn("Ladder",true);
        expect(total).toBe(30);
    })

    it("it adds a light",function(){
        changeAddOn("Light",true);
        expect(total).toBe(30);        
    })

    it("it adds delivery",function(){
        changeAddOn("Delivery",true);
        expect(total).toBe(28);        
    })

    it("it removes delivery",function(){
        changeAddOn("Delivery",true);
        changeAddOn("Delivery",false);        
        expect(total).toBe(20);        
    })
    it("it shows the right price",function(){
        changeAddOn("Delivery",true);
        changeAddOn("Light",true);
        changeAddOn("Ladder",true);
        expect($(".totalRow .priceCol").html()).toBe("$48");
    })
})

describe("toConfirmationPage", function(){
    beforeEach(function(){
        affix("#page2");
        affix("#page1");
        affix("#confirmationPage");
        toConfirmationPage();        
    })
    it("hides page 1",function(){
        expect($("#page1").hasClass("hide")).toBe(true);
    })

    it("it hides page 2",function(){
        expect($("#page2").hasClass("hide")).toBe(true);
    })
   
    it("it show confirmationPAge",function(){
        expect($("#confirmationPage").hasClass("hide")).toBe(false);
    })
})

describe('validateCheckout', function(){
    beforeEach(function(){
        spyOn(window, 'renderFullForm');
        spyOn(window, 'scrollTo');
        affix("#start_date");
        affix("#phone");
        affix("#address");
        affix("#delivery_time");
        affix("#start_dateError");
        affix("#addressError");
        affix("#phoneError");
        $("#start_dateError").addClass("hide");
        $("#phoneError").addClass("hide");
        $("#addressError").addClass("hide");
        $("#timeError").addClass("hide");
        affix("#delivery");
    })

    it("errors for all empty fields", function(){
        $("#delivery").prop("checked", true);
        validateCheckout();
        expect($("#start_dateError").hasClass("hide")).toBe(false);
        expect($("#phoneError").hasClass("hide")).toBe(false);
        expect($("#addressError").hasClass("hide")).toBe(false);
        expect($("#timeError").hasClass("hide")).toBe(false);
        
        
        
    })

    it("it shows no error if start_date has a value and goes to page2",function(){
        $("#start_date").val("Thursday, August 31, 2017");
        validateCheckout();
        expect($("#start_dateError").hasClass("hide")).toBe(true);
        expect(window.renderFullForm).toHaveBeenCalled();
    })


    it("goes to page2 if delivery feilds valid",function(){
        $("#delivery").prop("checked", true);
        $("#phone").val("510-531-1114");
        $("#start_date").val("Thursday, August 31, 2017");        
        $("#address").val("123 any address ");
        $("#delivery_time").val(12);
        validateCheckout();        
        expect(window.renderFullForm).toHaveBeenCalled();
    })
})

