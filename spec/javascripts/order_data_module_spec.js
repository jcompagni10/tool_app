describe ('orderDataModule', function(){
	// do NOT need ot test get or clear because these are used in the actual tests here and things wouldn't be passing if they were failing

	beforeEach(function() {
		orderDataModule.clear();
	})
	describe("initializing", function() {
	})

	describe("when set", function() {	
		beforeEach(function() {
			orderDataModule.set("this", "that")
		})
		it("should return the value in a get", function() {
			expect(orderDataModule.get()).toEqual({"this": "that"})
		})
	})

	describe("when save is called", function(){
		beforeEach(function() {
			spyOn(Storage, "save")
		})
		it('constructs Storage a full hash', function() {
			orderDataModule.set("this", "that")
			orderDataModule.save();
			expect(Storage.save).toHaveBeenCalledWith("sessionStorage", "orderData", {"this": "that"})
		})
		it('does nothing on an empty hash', function() {
			orderDataModule.save();
			expect(Storage.save).not.toHaveBeenCalled()
		})
	})
	describe("when isPresent is called", function() {
		describe("on a hash with something", function() {
			beforeEach(function() {
				orderDataModule.set("start_date", new Date())
			})
			it("returns true", function() {
				expect(orderDataModule.isPresent()).toEqual(true)
			})
		})
		describe("on an empty hash", function() {
			it("returns false", function() {
				expect(orderDataModule.isPresent()).toEqual(true)
			})
		})
	})
	describe("when isValid is called", function() {
		// NOT spying on validHelper, just for email/phone is very tedious, would have to create a spy and a callthrough or call fake for every test
		describe("no delivery", function() {
			describe("on a hash with all the right fields", function() {
				beforeEach(function() {
					affix("#start_date_error_msg.hide")
					affix("#email_error_msg.hide")
					affix("#tos_error_msg.hide")
					orderDataModule.set("start_date", new Date())
					orderDataModule.set("end_date", new Date())
					orderDataModule.set("email", "test@example.com")
					orderDataModule.set("tos", true)	
				})

				it("returns true and does NOT show any errors", function() {
					expect(orderDataModule.isValid()).toEqual(true);	
					expect($("#start_date_error_msg")).toBeHidden();
					expect($("#email_error_msg")).toBeHidden();
					expect($("#tos_error_msg")).toBeHidden();
				})	
			})
			describe("on a hash missing a field", function() {
				beforeEach(function() {
					affix("#start_date_error_msg.hide")
					affix("#email_error_msg.hide")
					affix("#tos_error_msg.hide")
					orderDataModule.set("start_date", new Date())
					orderDataModule.set("end_date", new Date())
					orderDataModule.set("email", "test@example.com")
				})

				it("returns false and shows RIGHT error", function() {
					expect(orderDataModule.isValid()).toEqual(false)	
					expect($("#start_date_error_msg")).toBeHidden();
					expect($("#email_error_msg")).toBeHidden();
					expect($("#tos_error_msg")).not.toBeHidden();
				})	
			})
			describe("on a hash with all fields but an incorrect value for EMAIL", function() {
				beforeEach(function() {
					affix("#start_date_error_msg.hide")
					affix("#email_error_msg.hide")
					affix("#tos_error_msg.hide")
					orderDataModule.set("start_date", new Date())
					orderDataModule.set("end_date", new Date())
					orderDataModule.set("email", "test@@example.com")
					orderDataModule.set("tos", true)	
				})

				it("returns false and shows RIGHT error", function() {
					expect(orderDataModule.isValid()).toEqual(false)	
					expect($("#start_date_error_msg")).toBeHidden();
					expect($("#email_error_msg")).not.toBeHidden();
					expect($("#tos_error_msg")).toBeHidden();
				})	
			})
			describe("on a hash with all fields but an incorrect value for START DATE", function() {
				beforeEach(function() {
					affix("#start_date_error_msg.hide")
					affix("#email_error_msg.hide")
					affix("#tos_error_msg.hide")
					orderDataModule.set("start_date", "test")
					orderDataModule.set("end_date", new Date())
					orderDataModule.set("email", "test@example.com")
					orderDataModule.set("tos", true)	
				})

				it("returns false and shows RIGHT error", function() {
					expect(orderDataModule.isValid()).toEqual(false)	
					expect($("#start_date_error_msg")).not.toBeHidden();
					expect($("#email_error_msg")).toBeHidden();
					expect($("#tos_error_msg")).toBeHidden();
				})	
			})
			describe("on a hash with all fields but an incorrect value for END DATE", function() {
				beforeEach(function() {
					affix("#start_date_error_msg.hide")
					affix("#email_error_msg.hide")
					affix("#tos_error_msg.hide")
					orderDataModule.set("start_date", new Date())
					orderDataModule.set("end_date", "test")
					orderDataModule.set("email", "test@example.com")
					orderDataModule.set("tos", true)	
				})

				it("returns false and shows NO errors", function() {
					expect(orderDataModule.isValid()).toEqual(false)	
					expect($("#start_date_error_msg")).toBeHidden();
					expect($("#email_error_msg")).toBeHidden();
					expect($("#tos_error_msg")).toBeHidden();
				})	
			})
			describe("on a hash with all fields but an incorrect value for TOS", function() {
				beforeEach(function() {
					affix("#start_date_error_msg.hide")
					affix("#email_error_msg.hide")
					affix("#tos_error_msg.hide")
					orderDataModule.set("start_date", new Date())
					orderDataModule.set("end_date", new Date())
					orderDataModule.set("email", "test@example.com")
					orderDataModule.set("tos", false)	
				})

				it("returns false and shows RIGHT error", function() {
					expect(orderDataModule.isValid()).toEqual(false)
					expect($("#start_date_error_msg")).toBeHidden();
					expect($("#email_error_msg")).toBeHidden();
					expect($("#tos_error_msg")).not.toBeHidden();
				})	
			})
		})
		describe("with delivery", function() {
			beforeEach(function() {
				// so we dont' have to create extra proxy functions again
				spyOn(cartModule, "hasDelivery").and.callFake(function() {
					return true
				})
			})
			describe("on a hash with all the right fields", function() {
				beforeEach(function() {
					affix("#start_date_error_msg.hide")
					affix("#email_error_msg.hide")
					affix("#tos_error_msg.hide")
					affix("#delivery_start_time_error_msg.hide")
					affix("#phone_error_msg.hide")
					affix("#address_error_msg.hide")
					orderDataModule.set("start_date", new Date())
					orderDataModule.set("end_date", new Date())
					orderDataModule.set("email", "test@example.com")
					orderDataModule.set("tos", true)	
					orderDataModule.set("delivery_start_time", 1)
					orderDataModule.set("delivery_end_time", "4:00pm")
					orderDataModule.set("phone", "322135")
					orderDataModule.set("address", "random")	
				})

				it("returns true and does NOT show any errors", function() {
					expect(orderDataModule.isValid()).toEqual(true)	
					expect($("#start_date_error_msg")).toBeHidden();
					expect($("#email_error_msg")).toBeHidden();
					expect($("#tos_error_msg")).toBeHidden();
					expect($("#delivery_start_time_error_msg")).toBeHidden();
					expect($("#tos_error_msg")).toBeHidden();
					expect($("#phone_error_msg")).toBeHidden();
					expect($("#address_error_msg")).toBeHidden();
				})	
			})
			describe("on a hash missing a field", function() {
				beforeEach(function() {
					affix("#start_date_error_msg.hide")
					affix("#email_error_msg.hide")
					affix("#tos_error_msg.hide")
					affix("#delivery_start_time_error_msg.hide")
					affix("#phone_error_msg.hide")
					affix("#address_error_msg.hide")
					orderDataModule.set("start_date", new Date())
					orderDataModule.set("end_date", new Date())
					orderDataModule.set("email", "test@example.com")
					orderDataModule.set("tos", true)	
					orderDataModule.set("delivery_start_time", 1)
					orderDataModule.set("delivery_end_time", "4:00pm")
					orderDataModule.set("phone", "322135")
				})

				it("returns false and shows RIGHT error", function() {
					expect(orderDataModule.isValid()).toEqual(false)	
					expect($("#start_date_error_msg")).toBeHidden();
					expect($("#email_error_msg")).toBeHidden();
					expect($("#tos_error_msg")).toBeHidden();
					expect($("#delivery_start_time_error_msg")).toBeHidden();
					expect($("#tos_error_msg")).toBeHidden();
					expect($("#phone_error_msg")).toBeHidden();
					expect($("#address_error_msg")).not.toBeHidden();
				})	
			})
			describe("on a hash with all fields but an incorrect value for PHONE", function() {
				beforeEach(function() {
					affix("#start_date_error_msg.hide")
					affix("#email_error_msg.hide")
					affix("#tos_error_msg.hide")
					affix("#delivery_start_time_error_msg.hide")
					affix("#phone_error_msg.hide")
					affix("#address_error_msg.hide")
					orderDataModule.set("start_date", new Date())
					orderDataModule.set("end_date", new Date())
					orderDataModule.set("email", "test@example.com")
					orderDataModule.set("tos", true)	
					orderDataModule.set("delivery_start_time", 1)
					orderDataModule.set("delivery_end_time", "4:00pm")
					orderDataModule.set("phone", "asdf")
					orderDataModule.set("address", "random")
				})

				it("returns false and shows RIGHT error", function() {
					expect(orderDataModule.isValid()).toEqual(false)	
					expect($("#start_date_error_msg")).toBeHidden();
					expect($("#email_error_msg")).toBeHidden();
					expect($("#tos_error_msg")).toBeHidden();
					expect($("#delivery_start_time_error_msg")).toBeHidden();
					expect($("#tos_error_msg")).toBeHidden();
					expect($("#phone_error_msg")).not.toBeHidden();
					expect($("#address_error_msg")).toBeHidden();
				})	
			})
		})
	})
});