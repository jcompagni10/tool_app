// see notes in actual JS file, we CANNOT test that document.ready will actually call the pageActions, but at some point we just have eto assume we can write that one line right
describe("user actions", function() {
	describe("changing toggle item", function() {
		beforeEach(function() {
			affix(".toggle_item[data-name='ladder']")
		})
		describe("to true", function() {
			beforeEach(function() {
				console.log("spec>>>>>>")
				spyOn(cartModule, "isUnique")
				spyOn(Item, "isValid")
				$(".toggle_item").trigger("change")
			})
			it("checks if it's valid and if it's unique before calling toggleItem", function() {
				expect(Item.isValid).toHaveBeenCalledWith("ladder")
				expect(cartModule.isUnique).toHaveBeenCalledWith("ladder")
			})
		})
	})
})