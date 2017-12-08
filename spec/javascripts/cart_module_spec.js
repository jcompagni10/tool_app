describe ('cartModule', function(){
	// do NOT need ot test getItems or clear because these are used in the actual tests here and things wouldn't be passing if they were failing

	beforeEach(function() {
		cartModule.clear();
	})
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



	describe('when toggleItem is called to add', function() {
		beforeEach(function() {
			spyOn(elementVisAndNav, 'deliverySection')
			affix("#total")
		})
		describe("for regular item", function() {
			beforeEach(function() {
				console.log("test before add")
				console.log(cartModule.getItems())
				cartModule.toggleItem("ladder", true)
				console.log("test afer add ")
				console.log(cartModule.getItems())
			})
			it ('adds item', function() {
				expect(cartModule.getItems()).toEqual(["ladder"]);
			})
			// it ("doesn't change delivery visibility", function() {
			// 	expect(elementVisAndNav.deliverySection).not.toHaveBeenCalled()
			// }) 
			// it ("updates total text", function() {
			// 	//not the best test, should test that Proxy is called, but don't think you can break this up so easily like that
			// 	$("#total").text(1000)
			// })
		})
		// describe("for delivery", function() {
		// 	beforeEach(function() {
		// 		cartModule.toggleItem("delivery", true)
		// 	})
		// 	it ('adds item', function() {
		// 		expect(cartModule.getItems()).toEqual(["delivery"]);
		// 	})
		// 	it ("does change delivery visibility", function() {
		// 		expect(elementVisAndNav.deliverySection).toHaveBeenCalledWith(true)
		// 	}) 
		// 	it ("updates total text", function() {
		// 		//not the best test, should test that Proxy is called, but don't think you can break this up so easily like that
		// 		$("#total").text(800)
		// 	})
		// })
	})
	// describe('when toggleItem is called to remove', function() {
	// 	beforeEach(function() {
	// 		spyOn(elementVisAndNav, 'deliverySection')
	// 		affix("#total")
	// 	})
	// 	describe("for regular item that exists", function() {
	// 		beforeEach(function() {
	// 			cartModule.toggleItem("ladder", true)
	// 			cartModule.toggleItem("ladder", false)
	// 		})
	// 		it ('removes item', function() {
	// 			expect(cartModule.getItems()).toEqual([]);
	// 		})
	// 		it ("doesn't change delivery visibility", function() {
	// 			expect(elementVisAndNav.deliverySection).not.toHaveBeenCalled()
	// 		}) 
	// 		it ("updates total text", function() {
	// 			//not the best test, should test that Proxy is called, but don't think you can break this up so easily like that
	// 			$("#total").text(0)
	// 		})
	// 	})
	// 	describe("for regular item that doesn't exist", function() {
	// 		beforeEach(function() {
	// 			cartModule.toggleItem("ladder", false)
	// 		})
	// 		it ("doesn't throw an error", function() {
	// 			// this isn't a good test, i need to test that cartModule.removeItem("ladder") doesn't like... explode, but not sure how
	// 			expect(cartModule.getItems()).toEqual([]);
	// 		})
	// 		it ("doesn't change delivery visibility", function() {
	// 			expect(elementVisAndNav.deliverySection).not.toHaveBeenCalled()
	// 		}) 
	// 		it ("updates total text", function() {
	// 			//not the best test, should test that Proxy is called, but don't think you can break this up so easily like that
	// 			$("#total").text(0)
	// 		})
	// 	})
	// 	describe("for delivery", function() {
	// 		beforeEach(function() {
	// 			cartModule.toggleItem("delivery", true)
	// 			cartModule.toggleItem("delivery", false)
	// 		})
	// 		it ('removes item', function() {
	// 			expect(cartModule.getItems()).toEqual([]);
	// 		})
	// 		it ("does change delivery visibility", function() {
	// 			expect(elementVisAndNav.deliverySection).toHaveBeenCalledWith(true)
	// 			expect(elementVisAndNav.deliverySection).toHaveBeenCalledWith(false)
	// 		}) 
	// 		it ("updates total text", function() {
	// 			//not the best test, should test that Proxy is called, but don't think you can break this up so easily like that
	// 			$("#total").text(0)
	// 		})
	// 	})
	// })

	// describe('when getTotal is called', function() {
	// 	it('adds appropriately on a full cart', function() {
	// 		cartModule.toggleItem("ladder", true)
	// 		cartModule.toggleItem("light", true)
	// 		expect(cartModule.getTotal()).toEqual(2000)
	// 	})
	// 	it('returns 0 on an empty cart', function() {
	// 		expect(cartModule.getTotal()).toEqual(0)
	// 	})
	// })
	// describe("when save is called", function(){
	// 	beforeEach(function() {
	// 		spyOn(Storage, "save")
	// 	})
	// 	it('constructs Storage a full cart', function() {
	// 		cartModule.toggleItem("ladder", true)
	// 		cartModule.save();
	// 		expect(Storage.save).toHaveBeenCalledWith("sessionStorage", "cart", [new Item("ladder")])
	// 	})
	// 	it('does nothing on an empty cart', function() {
	// 		cartModule.save();
	// 		expect(Storage.save).not.toHaveBeenCalled()
	// 	})
	// })
	// describe("when isValid is called", function() {
	// 	it('returns true on a full cart', function() {
	// 		cartModule.toggleItem("ladder", true)
	// 		expect(cartModule.isValid()).toEqual(true)
	// 	})
	// 	it('returns false on an empty cart', function() {
	// 		expect(cartModule.isValid()).toEqual(false)
	// 	})
	// })
});

// showdom specs