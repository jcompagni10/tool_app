describe("Item class", function() {
	beforeEach(function() {
		affix(".delivery_modification");
	})
	describe("when constructor is called", function() {
		describe("for non-delivery", function() {
			it("should auto-set price", function() {
				item = new Item("toolkit")
				expect(item.price).toEqual(itemPriceModule()["toolkit"])
			})
			// it("shouldn't set data object on delivery_modification", function() {
			// 	expect($(".delivery_modification").data("itemobject")).not.toBeDefined(); 
			// })
		})
		// describe("with delivery", function() {
		// 	it("should set data object on delivery_modification", function() {
		// 		item = new Item("delivery")
		// 		expect($(".delivery_modification").data("itemobject")).toBe(item)
		// 	})
		// })
	})
	describe("when prototype.isValid is called", function() {
		describe("with invalid item", function() {
			it("should return false", function() {
				test = Item.isValid("random")
				expect(test).toEqual(false)
			})
		})
		describe("with valid item", function() {
			it("should return true", function() {
				test = Item.isValid("ladder")
				expect(test).toEqual(true)	
			})
		})
	})
})
