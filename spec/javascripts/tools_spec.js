
describe("toPage1", function(){
    beforeEach(function(){
        affix("#page2");
        affix("#page1");
        toPage1();        
    })
    it("hides page 1",function(){
        expect($("#page1").hasClass("hide")).toBe(false);
    })

    it("it hides page 2",function(){
        expect($("#page2").hasClass("hide")).toBe(true);
    })
})

describe("toPage2", function(){
    beforeEach(function(){
        affix("#page2");
        affix("#page1");
        toPage2();        
    })
    it("hides page 1",function(){
        expect($("#page1").hasClass("hide")).toBe(true);
    })

    it("it shows page 2",function(){
        expect($("#page2").hasClass("hide")).toBe(false);
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

describe('reformatDate', function(){
    beforeEach(function(){
        affix("#start_date");
        mountDatePicker();        
        affix(".dueDate");
        $("#start_date").val("2017-08-28" );
        reformatDate();
        
    })

    it("formats date from ruby date to full date", function(){
        expect($("#start_date").val()).toBe("Monday, August 28, 2017");
    })

    it("it formats due date", function(){
        expect($(".dueDate").html()).toBe("Thursday, August 31, 2017");
    })
})

describe('validateCheckout', function(){
    beforeEach(function(){
        spyOn(window, 'toPage2');
        affix("#start_date");
        affix("#phone");
        affix("#address");
        affix("#start_dateError");
        affix("#addressError");
        affix("#phoneError");
        $("#start_dateError").addClass("hide");
        $("#phoneError").addClass("hide");
        $("#addressError").addClass("hide");
        affix("#delivery");
    })

    it("shows an error if start date is empty",function(){
        validateCheckout();
        expect($("#start_dateError").hasClass("hide")).toBe(false);
    })

    it("it shows no error if start_date has a value and goes to page2",function(){
        $("#start_date").val("Thursday, August 31, 2017");
        validateCheckout();
        expect($("#start_dateError").hasClass("hide")).toBe(true);
        expect(window.toPage2).toHaveBeenCalled();
    })

    it("shows an error if phone is empty",function(){
        $("#delivery").prop("checked", true);
        validateCheckout();
        expect($("#phoneError").hasClass("hide")).toBe(false);
    })

    it("shows an error if address is empty",function(){
        $("#delivery").prop("checked", true);
        validateCheckout();
        expect($("#addressError").hasClass("hide")).toBe(false);
    })
    it("goes to page2 if delivery feilds valid",function(){
        $("#delivery").prop("checked", true);
        $("#phone").val("510-531-1114");
        $("#start_date").val("Thursday, August 31, 2017");        
        $("#address").val("123 any address ");
        validateCheckout();        
        expect(window.toPage2).toHaveBeenCalled();
    })
})

describe("changeAddOn", function(){
    beforeEach(function(){
        affix("table");
        $("table").html("<tr class = 'Toolbox_Row hide'> <td class='priceCol'> $20 </td> <td class='descriptionCol'> Toolbox </td> </tr> <tr class = 'Ladder_Row hide'> <td class='priceCol'> +$10 </td> <td class='descriptionCol'> Ladder </td> </tr> <tr class = 'Work Light_Row hide'> <td class='priceCol'> +$10 </td> <td class='descriptionCol'> Work Light </td> </tr> <tr class = 'Delivery_Row hide'> <td class='priceCol'> +$8 </td> <td class='descriptionCol'> Delivery </td> </tr> <tr class = 'Total_Row hide'> <td class='priceCol'> $20 </td> <td class='descriptionCol'> Total </td> </tr>")
        total = 20;
    })

    it("it adds a ladder",function(){
        changeAddOn("Ladder",true);
        expect($(".Ladder_Row").hasClass("hide")).toBe(false);
        expect(total).toBe(30);
    })

    it("it adds a light",function(){
        changeAddOn("Light",true);
        expect($(".Light_Row").hasClass("hide")).toBe(false);
        expect(total).toBe(30);        
    })

    it("it adds delivery",function(){
        changeAddOn("Delivery",true);
        expect($(".Delivery_Row").hasClass("hide")).toBe(false);
        expect(total).toBe(28);        
    })

    it("it removes delivery",function(){
        changeAddOn("Delivery",true);
        changeAddOn("Delivery",false);
        expect($(".Delivery_Row").hasClass("hide")).toBe(true);
        expect(total).toBe(20);        
    })
    it("it shows the right price",function(){
        changeAddOn("Delivery",true);
        changeAddOn("Light",true);
        changeAddOn("Ladder",true);
        expect($(".Total_Row .priceCol").html()).toBe("$48");
    })
})