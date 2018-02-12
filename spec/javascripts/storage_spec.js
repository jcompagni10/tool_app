describe ("storage class", function() {
	describe("when prototype.save is called", function() {
		describe("with sessionStorage", function() {
			it("should save", function() {
				Storage.save("sessionStorage", "test", "test")
				expect(JSON.parse(sessionStorage.getItem("test"))).toEqual("test")
			})
		})
	})
})
