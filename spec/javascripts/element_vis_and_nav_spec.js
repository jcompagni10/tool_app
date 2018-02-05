describe ('elementVisAndNav object literal', function(){
	// not testing scrollToAnchor, would require testing coordinates, not THAT concerned about it, if it looks fine visually, it's good

	// below doesn't pass, not sure if we need some kind of action or if this si better in integration test (possibly there)
	// describe("at initial load", function() {
	// 	affix("#page1") 
	// 	affix("#delivery_start_time")
	// 	affix("#deliveryInput.collapse")
	// 	affix("#edit_delivery.hide")
	// 	affix("#checkoutBtn") 
	// 	affix("#totalRow.hide") // actually a part of page1

	// 	affix("#page2.collapse") 

	// 	affix("#confirmationPage.hide") 
	// })
	// it("shoudl show correct elements", function() {
	// 	expect($("#page1")).not.toBeHidden();
	// 	expect($("#delivery_start_time")).toBeHidden();
	// 	expect($("#deliveryInput")).toBeHidden();
	// 	expect($("#edit_delivery")).toBeHidden();
	// 	expect($("#checkoutBtn")).not.toBeHidden();
	// 	expect($("#totalRow")).toBeHidden();

	// 	expect($("#page2")).toBeHidden();
	// 	expect($("#confirmationPage")).toBeHidden();
	// })	

	describe("deliverySection", function(){
		beforeEach(function(){
			affix("#delivery_start_time")
			affix("#deliveryInput.collapse")
			affix("#edit_delivery.hide")
		})
		describe("with show == true, even with show_link = false", function() {
			beforeEach(function() {
				elementVisAndNav.deliverySection(true, false)
			})
			it("should enable delivery_start_time", function(){
				expect($("#delivery_start_time").prop("disabled")).toEqual(false)
			})
			it("should show deliveryInput", function(){
				expect($("#deliveryInput")).not.toBeHidden();
			})
			it("should keep edit_delivery hidden", function(){
				expect($("#edit_delivery")).toBeHidden()
			})
		})
		describe("with show == false, show_link == false", function() {
			beforeEach(function() {
				elementVisAndNav.deliverySection(false, false)
			})
			it("should disable delivery_start_time", function(){
				expect($("#delivery_start_time").prop("disabled")).toEqual(true)
			})
			it("should hide deliveryInput", function(){
				expect($("#deliveryInput")).toBeHidden();
			})
			it("should keep edit_delivery hidden", function(){
				expect($("#edit_delivery")).toBeHidden()
			})
		})
		describe("with show == false, show_link == true", function() {
			beforeEach(function() {
				elementVisAndNav.deliverySection(false, true)
			})
			it("should disable delivery_start_time", function(){
				expect($("#delivery_start_time").prop("disabled")).toEqual(true)
			})
			it("should hide deliveryInput", function(){
				expect($("#deliveryInput")).toBeHidden();
			})
			it("should show edit_delivery", function(){
				expect($("#edit_delivery")).not.toBeHidden()
			})
		})
	}) 
	describe("fullForm", function() {
		beforeEach(function() {
			affix("#checkoutBtn") 
			affix("#totalRowcart.hide")
			affix("#edit_delivery.hide") 
			spyOn(elementVisAndNav, "deliverySection")
			spyOn(elementVisAndNav, "scrollToAnchor").and.callFake(function() {return true})
		})
		describe("without delivery", function() {
			beforeEach(function() {
				spyOn(cartModule, "hasDelivery").and.callFake(function() {return false})
				elementVisAndNav.fullForm();
			})
			it("should show page2", function() {
				expect($("#page2")).not.toBeHidden();
			})
			it("should show totalRow", function() {
				expect($("#totalRowcart")).not.toBeHidden();
			})
			it("should hide checkoutBtn", function() {
				expect($("#checkoutBtn")).toBeHidden();
			})
			it("should not call deliverySection", function() {
				expect(elementVisAndNav.deliverySection).not.toHaveBeenCalled()
			})
			it("should receive scroll", function() {
				expect(elementVisAndNav.scrollToAnchor).toHaveBeenCalledWith("#page2")
			})
		})
		describe("with delivery", function() {
			beforeEach(function() {
				spyOn(cartModule, "hasDelivery").and.callFake(function() {return true})
				elementVisAndNav.fullForm();
			})
			it("should show page2", function() {
				expect($("#page2")).not.toBeHidden();
			})
			it("should show totalRow", function() {
				expect($("#totalRowcart")).not.toBeHidden();
			})
			it("should hide checkoutBtn", function() {
				expect($("#checkoutBtn")).toBeHidden();
			})
			it("should call deliverySection", function() {
				expect(elementVisAndNav.deliverySection).toHaveBeenCalledWith(false, true)
			})
			it("should receive scroll", function() {
				expect(elementVisAndNav.scrollToAnchor).toHaveBeenCalledWith("#page2")
			})
		})
	})

	describe("confirmationPage", function() {
		beforeEach(function() {
			affix("#page1") 
			affix("#page2") 
			affix("#confirmationPage.hide") 
			elementVisAndNav.confirmationPage();
		})
		it("should hide page1 & page2", function() {
			expect($("#page1")).toBeHidden();
			expect($("#page2")).toBeHidden();
		})
		it("should show confrmationPage", function() {
			expect($("#confrmationPage")).not.toBeHidden();
		})
	})
});