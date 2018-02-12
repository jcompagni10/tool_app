// see notes in actual JS file, we CANNOT test that document.ready will actually call the pageActions, but at some point we just have eto assume we can write that one line right
describe("user actions", function() {
	describe("changing toggle item", function() {
		beforeEach(function() {
			affix("input.toggle_item[data-name='ladder'][type='checkbox']");
			// Need to mount user actions because jasmine doesn't trigger a page load
			mountUserActions();
		})

		describe("to true", function() {
			beforeEach(function() {
				spyOn(Item, "isValid").and.callThrough();
				// julian: using $.lcik() for more realistic simulation of changing to true
				$(".toggle_item").click();
			});
			it("checks if it's valid before calling toggleItem", function() {
				expect(Item.isValid).toHaveBeenCalledWith("ladder");
			});
			it("adds the item to the cart", function(){
				expect(cartModule.getProxyItems().includes("ladder")).toBe(true);
			});
		});
		describe("to false", function() {
			beforeEach(function() {
				// julian: this is would be a much strong test if we could use the cart that we know has a ladder from the previous spec and then remove it
				// but because of the proxy issue isUnqiue doesn't work properly and the cart ends up with 3 ladders
				cartModule.clear();
				spyOn(Item, "isValid").and.callThrough();
				$(".toggle_item").click();
				$(".toggle_item").click();
			});
			it("removes the item from the cart", function(){
				expect(cartModule.getProxyItems().includes("ladder")).toBe(false);
			});
			it("checks if it's valid and if it's unique before calling toggleItem", function() {
				expect(Item.isValid).toHaveBeenCalledWith("ladder");
			});
		});
	});


	describe("changing order data field", function(){
		beforeEach(function(){
			orderDataModule.clear();
		});
		describe("start date", function(){
			const testDate = new Date(2018,6,6);
			beforeEach(function(){
				affix("input#start_date.order_data_field");
				affix("input#end_date.order_data_field");
				$("#start_date").datepicker();
				mountUserActions();
				// $("#start_date").val(testDate);
				$("#start_date").datepicker('setDate', testDate);
				$("#start_date").change();
			});
			it("updates the orderData for start date", function(){
				expect(orderDataModule.get().start_date).toEqual(testDate);
			});
			// Can't get spy on work on constructor. Not an essential test but would be helpful for completeness
			// it("creates a new EndPoint with the correct parameters", function(){
			// 	const endpointSpy = spyOn(window, 'Endpoint').and.callThrough();
			// 	expect(endpointSpy).toHaveBeenCalledWith("date", testDate);
			// });
			it("updates the end date feild and orderDate for the end date", function(){
				// julian: This test could be improved. It is a bit brittle as is. Ideally it would use datepicker to determine what the text should be. 
				let endDate = "Mon, Jul 9, 2018";
				expect($("#end_date").val()).toEqual(endDate);
				expect(orderDataModule.get().end_date).toEqual(endDate);
			});
		});
		describe("delivery start time", function(){
			const startTime = '10';
			beforeEach(function(){
				affix("input#delivery_start_time.order_data_field");
				affix("input#delivery_end_time.order_data_field");
				mountUserActions();
				$("#delivery_start_time").val(startTime);
				$("#delivery_start_time").change();
			});
			it("updates the orderData for start time", function(){
				expect(orderDataModule.get().delivery_start_time).toEqual(startTime);
			});
			// also should test constructor here. See above.
			it("updates the end date feild and orderDate for the end date", function(){
				let endTime = "11:00am";
				expect($("#delivery_end_time").val()).toEqual(endTime);
				expect(orderDataModule.get().delivery_end_time).toEqual(endTime);
			});
		});
		describe("email", function(){
			it("updates the orderData for email", function(){
				affix("input#email.order_data_field");
				mountUserActions();
				const testEmail = "test@test.com";
				$("#email").val(testEmail);
				$("#email").change();
				expect(orderDataModule.get().email).toEqual(testEmail);
			});
		});
		describe("phone", function(){
			it("updates the orderData for phone", function(){
				affix("input#phone.order_data_field");
				mountUserActions();
				const testphone = "4157101111";
				$("#phone").val(testphone);
				$("#phone").change();
				expect(orderDataModule.get().phone).toEqual(testphone);
			});
		});
		describe("address", function(){
			it("updates the orderData for address", function(){
				affix("input#address.order_data_field");
				mountUserActions();
				const testaddress = "111 Main St., Anytown";
				$("#address").val(testaddress);
				$("#address").change();
				expect(orderDataModule.get().address).toEqual(testaddress);
			});
		});
		describe("tos", function(){
			it("updates the orderData for tos", function(){
				affix("input#tos.order_data_field");
				mountUserActions();
				$("#tos").val(1);
				$("#tos").change();
				expect(orderDataModule.get().tos).toEqual('1');
			});
		});
	});

	describe("click checkout button", function(){
		beforeEach(function(){
			cartModule.clear();
			// force truthy return for easier testing. We can assume is valid works b/c its tested in cart_module_spec
			spyOn(cartModule, "isValid").and.returnValue(true);
			spyOn(window, "mountStripe");
			spyOn(elementVisAndNav, "deliverySection");
			spyOn(elementVisAndNav, "fullForm");
			affix("#checkoutBtn");
			mountUserActions();
			$("#checkoutBtn").click();
		});
		it("checks if the cart is valid", function(){
			expect(cartModule.isValid).toHaveBeenCalled();
		});
		it("mounts stripe", function(){
			expect(window.mountStripe).toHaveBeenCalled();
		});
		it("displays the full form", function(){
			expect(elementVisAndNav.fullForm).toHaveBeenCalled();
		});
		describe("when there isn't delivery in the cart", function(){
			it("doesn't hide the delivery section", function(){
				expect(elementVisAndNav.deliverySection).not.toHaveBeenCalled();
			});
		});
		describe("when there is delivery in the cart", function(){
			beforeEach(function(){
				spyOn(cartModule, "getItems").and.returnValue(['delivery']);
				// julian: need to reclick button so that new stubbed function will be called
				$("#checkoutBtn").click();
			});
			it("hides the delivery section and exposes the delivery edit link", function(){
				expect(elementVisAndNav.deliverySection).toHaveBeenCalledWith(false, true);
			});
		});
	});

	describe("click submit button", function(){
		let cartValidSpy, tokenHandlerSpy;
		beforeAll(function(){
			affix("#submitButton");
			mountUserActions();
			spyOn(orderDataModule, "isValid").and.returnValue(true);
			cartValidSpy = spyOn(cartModule, "isValid").and.returnValue(true);
			tokenHandlerSpy = spyOn(window, "tokenHandler");
			$("#submitButton").click();
		});
		it("should check if the data module is valid", function(){
			expect(orderDataModule.isValid).toHaveBeenCalled();
		});
		it("should check if the cart is valid", function(){
			expect(cartModule.isValid).toHaveBeenCalled();
		});
		describe("when both conditions are true", function(){
			it("should call the tokenHandler", function(){
				expect(window.tokenHandler).toHaveBeenCalled();
			});
		});
		describe("when both conditions are not true", function(){
			beforeEach(function(){
				cartValidSpy.and.returnValue(false);
				tokenHandlerSpy.calls.reset();
				affix("#submitButton");
				mountUserActions();
				$("#submitButton").click();
			});
			it("should not call the tokenHandler", function(){
				expect(tokenHandlerSpy).not.toHaveBeenCalled();
			});
		});
	});

});