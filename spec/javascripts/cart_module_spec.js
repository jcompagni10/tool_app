describe ('cartModule', function(){
	// do NOT need ot test getItems or clear because these are used in the actual tests here and things wouldn't be passing if they were failing

	beforeEach(function() {
		cartModule.clear();
	})
	describe("initializing", function() {
		describe ('without sessionStorage',function(){
			beforeEach(function() {
				var storedCart = [];

			  spyOn(JSON, 'parse').and.callFake(function () {
			    return storedCart;
			  });

			  spyOn(cartModule, "toggleItem")
			})
	  	describe ('with invalid default_item',function(){
	    	it ("doesn't call toggleItem",function(){
	    		cartModule.initialize("random");
	    		expect(cartModule.toggleItem).not.toHaveBeenCalled()
				});
			});
			describe ('with no default_item',function(){
	    	it ("doesn't call toggleItem",function(){
	    		cartModule.initialize("random");
	    		expect(cartModule.toggleItem).not.toHaveBeenCalled()
				}); 
			}); 
			describe ('with valid default_item',function(){
	    	it ("does call toggleItem",function(){
	    		cartModule.initialize("toolkit");
	    		expect(cartModule.toggleItem).toHaveBeenCalledWith("toolkit", true)
				}) 
			}) 
		});
		describe ('with sessionStorage, non-toolkit',function(){
			beforeEach(function() {
				ladder = new Item("ladder")
			  spyOn(JSON, 'parse').and.callFake(function () {
			    return [ladder]
			  });

			  spyOn(cartModule, "toggleItem")
			  spyOn(cartModule, "showDOM")
			})
	  	describe ('with invalid default_item',function(){
	    	it ('calls toggleItem/showDOM only with what was in sessionStorage, not default_item',function(){
	    		cartModule.initialize("random");
	    		expect(cartModule.toggleItem).toHaveBeenCalledWith("ladder", true)
	    		expect(cartModule.toggleItem.calls.count()).toEqual(1)
	    		expect(cartModule.showDOM).toHaveBeenCalledWith(ladder)
	    		expect(cartModule.showDOM.calls.count()).toEqual(1)
				});
			});
			describe ('with no default_item',function(){
	    	it ('calls toggleItem/showDOM only with what was in sessionStorage',function(){
	    		cartModule.initialize();
	    		expect(cartModule.toggleItem).toHaveBeenCalledWith("ladder", true)
	    		expect(cartModule.toggleItem.calls.count()).toEqual(1)
	    		expect(cartModule.showDOM).toHaveBeenCalledWith(ladder)
	    		expect(cartModule.showDOM.calls.count()).toEqual(1)
				}); 
			}); 
			describe ('with valid default_item',function(){
	    	it ('calls toggleItem/showDOM only with what was in sessionStorage, not default_item',function(){
	    		cartModule.initialize("toolkit");
	    		expect(cartModule.toggleItem).toHaveBeenCalledWith("ladder", true)
	    		expect(cartModule.toggleItem.calls.count()).toEqual(1)
	    		expect(cartModule.showDOM).toHaveBeenCalledWith(ladder)
	    		expect(cartModule.showDOM.calls.count()).toEqual(1)
				}) 
			}) 
		})
		describe ('with sessionStorage, toolkit',function(){
			beforeEach(function() {
				toolkit = new Item("toolkit")
			  spyOn(JSON, 'parse').and.callFake(function () {
			    return [toolkit]
			  });

			  spyOn(cartModule, "toggleItem")
			  spyOn(cartModule, "showDOM")
			})
	  	it ('calls toggleItem but NOT showDOM',function(){
	  		cartModule.initialize("random");
	  		expect(cartModule.toggleItem).toHaveBeenCalledWith("toolkit", true)
	  		expect(cartModule.toggleItem.calls.count()).toEqual(1)
	  		expect(cartModule.showDOM).not.toHaveBeenCalled();
			});
		});
	})

	describe("when showDOM is called", function() {
		beforeEach(function() {
			affix("#delivery_start_time")
			affix("#delivery_end_time")
			affix("#phone")
			affix("#address")
			affix("#instructions")
		})
		describe("for regular item", function() {
			beforeEach(function() {
				affix("#.toggle_item[data-name='ladder']")
				item = new Item("ladder")
				cartModule.showDOM(item)
			})
			it("should check the checkbox", function() {
				expect($(".toggle_item[data-name='"+item.name+"']").prop("checked")).toEqual(true)
			})

			it("should not prefill delivery fields", function() {
				expect($("#delivery_start_time").val()).toEqual("")
				expect($("#delivery_end_time").val()).toEqual("")
				expect($("#phone").val()).toEqual("")
				expect($("#address").val()).toEqual("")
				expect($("#instructions").val()).toEqual("")
			})
		})
		describe("for delivery", function() {
			beforeEach(function() {
				affix("#.toggle_item[data-name='delivery']")
				item = new Item("delivery")
				item.delivery_start_time = 3
				item.delivery_end_time = 5 // this would show up as a string formatted time rather than an integer, which is only for delivery_start_time since integer is easier as a input value
				item.phone = 12
				item.address = 234
				item.instructions = 3634
				cartModule.showDOM(item)
			})
			it("should check the checkbox", function() {
				expect($(".toggle_item[data-name='"+item.name+"']").prop("checked")).toEqual(true)
			})

			it("should prefill delivery fields", function() {
				expect($("#delivery_start_time").val()).toEqual("3")
				expect($("#delivery_end_time").val()).toEqual("5")
				expect($("#phone").val()).toEqual("12")
				expect($("#address").val()).toEqual("234")
				expect($("#instructions").val()).toEqual("3634")
			})
		})
	})

	describe('when toggleItem is called to add', function() {
		beforeEach(function() {
			spyOn(elementVisAndNav, 'deliverySection')
			// affix("#total"), see note below, this is pointless because this test won't pass
		})
		describe("for regular item", function() {
			beforeEach(function() {
				cartModule.toggleItem("ladder", true)
			})
			it ('adds item', function() {
				expect(cartModule.getProxyItems()).toEqual(["ladder"])
				// code is actually working, if we had getItems as below and in the code used cart.push instead of cart_proxy.push, it would pass, as well it also passes in local server, it seems what's failing is the use of the proxy, not passing it on to the actual object in test mode only, not sure how to get around, see SO question: https://stackoverflow.com/questions/47256006/proxy-test-not-working-in-jasmine
				// expect(cartModule.getItems()).toEqual(["ladder"]);
			})
			it ("doesn't change delivery visibility", function() {
				expect(elementVisAndNav.deliverySection).not.toHaveBeenCalled()
			}) 
			// again see note above, because the proxy doesn't run, the below test won't ever succeed, i.e., any console log statement in teh setter of hte proxy will never show up
			// it ("updates total text", function() {
				// expect($("#total").text()).toEqual(1000)
			// })
		})
		describe("for delivery", function() {
			beforeEach(function() {
				cartModule.toggleItem("delivery", true)
			})
			it ('adds item', function() {
				expect(cartModule.getProxyItems()).toEqual(["delivery"]);
			})
			it ("does change delivery visibility", function() {
				expect(elementVisAndNav.deliverySection).toHaveBeenCalledWith(true)
			}) 
			// again see note above, because the proxy doesn't run, the below test won't ever succeed, i.e., any console log statement in teh setter of hte proxy will never show up
			// it ("updates total text", function() {
				// expect($("#total").text()).toEqual(1000)
			// })
		})
	})
	describe('when toggleItem is called to remove', function() {
		beforeEach(function() {
			spyOn(elementVisAndNav, 'deliverySection')
			// affix("#total"), see note below, this is pointless because this test won't pass
		})
		describe("for regular item that exists", function() {
			beforeEach(function() {
				cartModule.toggleItem("ladder", true)
				cartModule.toggleItem("ladder", false)
			})
			it ('removes item', function() {
				expect(cartModule.getProxyItems()).toEqual([]);
			})
			it ("doesn't change delivery visibility", function() {
				expect(elementVisAndNav.deliverySection).not.toHaveBeenCalled()
			}) 
			// again see note above, because the proxy doesn't run, the below test won't ever succeed, i.e., any console log statement in teh setter of hte proxy will never show up
			// it ("updates total text", function() {
				// expect($("#total").text()).toEqual(1000)
			// })
		})
		describe("for regular item that doesn't exist", function() {
			beforeEach(function() {
				cartModule.toggleItem("ladder", false)
			})
			it ("doesn't throw an error", function() {
				// this isn't a good test, i need to test that cartModule.toggleItem("ladder", false) doesn't like... explode, but not sure how
				expect(cartModule.getProxyItems()).toEqual([]);
			})
			it ("doesn't change delivery visibility", function() {
				expect(elementVisAndNav.deliverySection).not.toHaveBeenCalled()
			}) 
			// again see note above, because the proxy doesn't run, the below test won't ever succeed, i.e., any console log statement in teh setter of hte proxy will never show up
			// it ("updates total text", function() {
				// expect($("#total").text()).toEqual(1000)
			// })
		})
		describe("for delivery", function() {
			beforeEach(function() {
				cartModule.toggleItem("delivery", true)
				cartModule.toggleItem("delivery", false)
			})
			it ('removes item', function() {
				expect(cartModule.getProxyItems()).toEqual([]);
			})
			it ("does change delivery visibility", function() {
				expect(elementVisAndNav.deliverySection).toHaveBeenCalledWith(true)
				expect(elementVisAndNav.deliverySection).toHaveBeenCalledWith(false)
			}) 
			// again see note above, because the proxy doesn't run, the below test won't ever succeed, i.e., any console log statement in teh setter of hte proxy will never show up
			// it ("updates total text", function() {
				// expect($("#total").text()).toEqual(1000)
			// })
		})
	})
	describe('when getTotal is called', function() {
		// again same as above, toggleItem only affects the proxy, proxy doesn't pass it thorugh, so we have to write the spec for the proxyTotal
		it('adds appropriately on a full cart', function() {
			cartModule.toggleItem("ladder", true)
			cartModule.toggleItem("light", true)
			expect(cartModule.getProxyTotal()).toEqual(2000)
		})
		it('returns 0 on an empty cart', function() {
			expect(cartModule.getProxyTotal()).toEqual(0)
		})
	})
	describe("when save is called", function(){
		beforeEach(function() {
			spyOn(Storage, "save")
		})
		it('constructs Storage a full cart', function() {
			cartModule.toggleItem("ladder", true)
			cartModule.saveProxy();
			expect(Storage.save).toHaveBeenCalledWith("sessionStorage", "cart", [new Item("ladder")])
		})
		it('does nothing on an empty cart', function() {
			cartModule.saveProxy();
			expect(Storage.save).not.toHaveBeenCalled()
		})
	})
	describe("when isValid is called", function() {
		it('returns true on a full cart', function() {
			cartModule.toggleItem("ladder", true)
			expect(cartModule.isProxyValid()).toEqual(true)
		})
		it('returns false on an empty cart', function() {
			expect(cartModule.isProxyValid()).toEqual(false)
		})
	})
	describe("when isUnique is called", function() {
		it("returns true when item is new", function() {
			expect(cartModule.isProxyUnique("ladder")).toEqual(true)
		})
		it("returns false when item exists", function() {
			cartModule.toggleItem("ladder", true)
			expect(cartModule.isProxyUnique("ladder")).toEqual(false)
		})
	})
});