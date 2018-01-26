// see notes in actual JS file, we CANNOT test that document.ready will actually call the pageActions, but at some point we just have eto assume we can write that one line right
describe("pageActions", function() {
	describe("initialize", function() {
		beforeEach(function() {
			spyOn(cartModule, "initialize")
			spyOn(orderDataModule, "initialize")
			pageActions.initialize();
		})
		it("initializes cartModule and orderDataModule", function() {
			expect(cartModule.initialize).toHaveBeenCalledWith("toolkit")
			expect(orderDataModule.initialize).toHaveBeenCalled()
		})
	})
	describe("save", function() {
		beforeEach(function() {
			spyOn(cartDataModule, "save")
			spyOn(orderDataModule, "save")
		})

		describe("with item", function() {
			beforeEach(function() {
				spyOn(cartModule, "getItems").and.callFake(function() { return ["ladder"] })
				pageActions.save();
			})	
			it("should save cartData", function() {
				expect(cartModule.save)toHaveBeenCalled()
			})
		})
		describe("without item", function() {
			beforeEach(function() {
				spyOn(cartModule, "getItems").and.callFake(function() { return [] })
				pageActions.save();
			})	
			it("shouldn't save cartData", function() {
				expect(cartModule.save).not.toHaveBeenCalled()
			})
		})
		describe("with orderData", function() {
			beforeEach(function() {
				spyOn(orderDataModule, "isPresent").and.callFake(function() { return true })
				pageActions.save();
			})	
			it("should save orderData", function() {
				expect(orderDataModule.save).toHaveBeenCalled()
			})
		})
		describe("without orderData", function() {
			beforeEach(function() {
				spyOn(orderDataModule, "isPresent").and.callFake(function() { return false })
				pageActions.save();
			})	
			it("shouldn't save orderData", function() {
				expect(orderDataModule.save).not.toHaveBeenCalled()
			})
		})
	})
})