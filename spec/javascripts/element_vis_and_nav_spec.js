describe ('elementVisAndNav object literal', function(){
	beforeEach(function() {
		affix("#delivery_start_time")
		affix("#deliveryInput.collapse")
		affix("#edit_delivery.hide")
	})
	describe("deliverySection with show == true, even with show_link = false", function() {
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
			expect($("#edit_delivery").hasClass("hide")).toEqual(true)
		})
	})
	describe("deliverySection with show == false, show_link == false", function() {
		beforeEach(function() {
			console.log("run function")
			elementVisAndNav.deliverySection(false, false)
		})
		it("should disable delivery_start_time", function(){
			expect($("#delivery_start_time").prop("disabled")).toEqual(true)
		})
		it("should hide deliveryInput", function(){
			console.log("asdfasdfsad")
			expect($("#deliveryInput")).toBeHidden();
		})
		it("should keep edit_delivery hidden", function(){
			expect($("#edit_delivery").hasClass("hide")).toEqual(true)
		})
	})
	// describe("deliverySection with show == false, show_link == true", function() {
	// 	beforeEach(function() {
	// 		elementVisAndNav.deliverySection(false, false)
	// 	})
	// 	it("should disable delivery_start_time", function(){
	// 		expect($("#delivery_start_time").prop("disabled")).toEqual(true)
	// 	})
	// 	it("should hide deliveryInput", function(){
	// 		expect($("#deliveryInput")).toBeHidden();
	// 	})
	// 	it("should show edit_delivery", function(){
	// 		expect($("#edit_delivery").hasClass("hide")).toEqual(false)
	// 	})
	// })
});