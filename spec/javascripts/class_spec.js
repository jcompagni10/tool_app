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

describe("Endpoint class", function() {
	describe("when constructor is called", function() {
		beforeEach(function(){
			spyOn(Endpoint, "prefill")
		})
		describe("with no start value", function() {
			beforeEach(function() {
				endpoint = new Endpoint("date")
			})
			it("calculates right", function() {
				expect(endpoint.end_value).toEqual(null)
			})
			it("calls prefill correctly", function() {
				expect(endpoint.constructor.prefill).toHaveBeenCalledWith("date", null)
			})
		})
		describe("for date", function() {
			beforeEach(function() {
				today = new Date()
				end = new Date(today)
				end.setDate(end.getDate() + 3)

				endpoint = new Endpoint("date", today)
			})
			it("calculates right", function() {
				expect(endpoint.end_value.getTime()).toEqual(end.getTime())
			})
			it("calls prefill correctly", function() {
				expect(endpoint.constructor.prefill).toHaveBeenCalledWith("date", endpoint.end_value)
			})
		})
		describe("for time", function() {
			beforeEach(function() {
				endpoint = new Endpoint("time", 3)
			})
			it("calculates right", function() {
				expect(endpoint.end_value).toEqual("4:00am")
			})
			it("calls prefill correctly", function() {
				expect(endpoint.constructor.prefill).toHaveBeenCalledWith("time","4:00am")
			})
		})
		describe("for time", function() {
			beforeEach(function() {
				endpoint = new Endpoint("time", 12)
			})
			it("calculates right", function() {
				expect(endpoint.end_value).toEqual("1:00pm")
			})
		})
	})
	describe("when prefill is called", function() {
		beforeEach(function() {
			affix("#end_date");
			affix("#delivery_end_time");
		})
		describe("for date", function() {
			beforeEach(function() {
				spyOnEvent("#end_date", "change")
			})
			describe("with real value", function() {
				it("fills correctly", function(){
					today = new Date()
					Endpoint.prefill("date", today)
					expect($("#end_date").val()).toEqual(dateTimeFxns.formatDateTime("date", today))
					expect('change').toHaveBeenTriggeredOn('#end_date');
				})
			})
			describe("with null", function() {
				it("fills correctly", function(){
					Endpoint.prefill("date")
					expect($("#end_date").val()).toEqual("3 days later")
					expect('change').toHaveBeenTriggeredOn('#end_date');
				})
			})
		})
		describe("for time", function() {
			beforeEach(function() {
				spyOnEvent("#delivery_end_time", "change")
			})
			describe("with real value", function() {
				it("fills correctly", function(){
					Endpoint.prefill("time", "6:00pm")
					expect($("#delivery_end_time").val()).toEqual("6:00pm")
					expect('change').toHaveBeenTriggeredOn('#delivery_end_time');
				})
			})
			describe("with null", function() {
				it("fills correctly", function(){
					Endpoint.prefill("time")
					expect($("#delivery_end_time").val()).toEqual("1 hour later")
					expect('change').toHaveBeenTriggeredOn('#delivery_end_time');
				})
			})
		})
	})
})

// no point testing Alertion class since it's created since alert() doesn't test very well
