describe ('cartModule', function(){
	// do NOT need ot test getItems or clear because these are used in the actual tests here and things wouldn't be passing if they were failing
	beforeEach(function() {
		cartModule.clear();
		// affix("input.add_on[data-name='ladder'][type='checkbox']");
  //   affix("input.add_on[data-name='random'][type='checkbox']");
	})
	// describe ('without sessionStorage',function(){
	// 	beforeEach(function() {
	// 		var storedCart = [];

	// 	  spyOn(JSON, 'parse').and.callFake(function () {
	// 	    return storedCart;
	// 	  });
	// 	})
 //  	describe ('with invalid default_item',function(){
 //    	it ('initializes empty cart',function(){
 //    		cartModule.initialize("random");
 //    		expect(cartModule.getItems()).toEqual([]);
 //    		expect($(".add_on[data-name='random']").prop("checked")).toEqual(false)
	// 		});
	// 	});
	// 	describe ('with no default_item',function(){
 //    	it ('initializes empty cart',function(){
 //    		cartModule.initialize("random");
 //    		expect(cartModule.getItems()).toEqual([]);
 //    		expect($(".add_on[data-name='random']").prop("checked")).toEqual(false)
	// 		}); 
	// 	}); 
	// 	describe ('with valid default_item',function(){
 //    	it ('initializes cart with default_item',function(){
 //    		cartModule.initialize("toolkit");
 //    		expect(cartModule.getItems()).toEqual(["toolkit"]);
 //    		expect($(".add_on[data-name='random']").prop("checked")).toEqual(false)
	// 		}) 
	// 	}) 
	// });
	// describe ('with sessionStorage',function(){
	// 	beforeEach(function() {
	// 		var storedCart = [{name:"ladder", price:1000}];

	// 	  spyOn(JSON, 'parse').and.callFake(function () {
	// 	    return storedCart;
	// 	  });
	// 	})
 //  	describe ('with invalid default_item',function(){
 //    	it ('initializes cart with stored item',function(){
 //    		cartModule.initialize("random");
 //    		expect(cartModule.getItems()).toEqual(["ladder"]);
 //    		expect($(".add_on[data-name='ladder']").prop("checked")).toEqual(true)
 //    		expect($(".add_on[data-name='random']").prop("checked")).toEqual(false)
	// 		});
	// 	});
	// 	describe ('with no default_item',function(){
 //    	it ('initializes cart with stored item',function(){
 //    		cartModule.initialize("random");
 //    		expect(cartModule.getItems()).toEqual(["ladder"]);
 //    		expect($(".add_on[data-name='ladder']").prop("checked")).toEqual(true)
 //    		expect($(".add_on[data-name='random']").prop("checked")).toEqual(false)
	// 		}); 
	// 	}); 
	// 	describe ('with valid default_item',function(){
 //    	it ('initializes cart with stored item',function(){
 //    		cartModule.initialize("toolkit");
 //    		expect(cartModule.getItems()).toEqual(["ladder"]);
 //    		expect($(".add_on[data-name='ladder']").prop("checked")).toEqual(true)
 //    		expect($(".add_on[data-name='random']").prop("checked")).toEqual(false)
	// 		}) 
	// 	}) 
	// })
	// describe('when addItem is called', function() {
	// 	beforeEach(function() {
	// 		spyOn(elementVisAndNav, 'deliverySection')
	// 	})
	// 	describe("for regular item", function() {
	// 		beforeEach(function() {
	// 			cartModule.addItem("ladder")
	// 		})
	// 		it ('adds item', function() {
	// 			expect(cartModule.getItems()).toEqual(["ladder"]);
	// 		})
	// 		it ("doesn't change delivery visibility", function() {
	// 			expect(elementVisAndNav.deliverySection).not.toHaveBeenCalled()
	// 		}) 
	// 	})
	// 	describe("for delivery", function() {
	// 		beforeEach(function() {
	// 			cartModule.addItem("delivery")
	// 		})
	// 		it ('adds item', function() {
	// 			expect(cartModule.getItems()).toEqual(["delivery"]);
	// 		})
	// 		it ("does change delivery visibility", function() {
	// 			expect(elementVisAndNav.deliverySection).toHaveBeenCalledWith(true)
	// 		}) 
	// 	})
	// })
	// describe('when removeItem is called', function() {
	// 	beforeEach(function() {
	// 		spyOn(elementVisAndNav, 'deliverySection')
	// 	})
	// 	describe("for regular item that exists", function() {
	// 		beforeEach(function() {
	// 			cartModule.addItem("ladder")
	// 			cartModule.removeItem("ladder")
	// 		})
	// 		it ('removes item', function() {
	// 			expect(cartModule.getItems()).toEqual([]);
	// 		})
	// 		it ("doesn't change delivery visibility", function() {
	// 			expect(elementVisAndNav.deliverySection).not.toHaveBeenCalled()
	// 		}) 
	// 	})
	// 	describe("for regular item that doesn't exist", function() {
	// 		beforeEach(function() {
	// 			cartModule.removeItem("ladder")
	// 		})
	// 		it ("doesn't throw an error", function() {
	// 			// this isn't a good test, i need to test that cartModule.removeItem("ladder") doesn't like... explode, but not sure how
	// 			expect(cartModule.getItems()).toEqual([]);
	// 		})
	// 		it ("doesn't change delivery visibility", function() {
	// 			expect(elementVisAndNav.deliverySection).not.toHaveBeenCalled()
	// 		}) 
	// 	})
	// 	describe("for delivery", function() {
	// 		beforeEach(function() {
	// 			cartModule.addItem("delivery")
	// 			cartModule.removeItem("delivery")
	// 		})
	// 		it ('removes item', function() {
	// 			expect(cartModule.getItems()).toEqual([]);
	// 		})
	// 		it ("does change delivery visibility", function() {
	// 			expect(elementVisAndNav.deliverySection).toHaveBeenCalledWith(true)
	// 			expect(elementVisAndNav.deliverySection).toHaveBeenCalledWith(false)
	// 		}) 
	// 	})
	// })
	// describe('when getTotal is called', function() {
	// 	it('adds appropriately on a full cart', function() {
	// 		cartModule.addItem("ladder")
	// 		cartModule.addItem("light")
	// 		expect(cartModule.getTotal()).toEqual(2000)
	// 	})
	// 	it('returns 0 on an empty cart', function() {
	// 		expect(cartModule.getTotal()).toEqual(0)
	// 	})
	// })
	// describe("when cookify is called", function(){
	// 	beforeEach(function() {
	// 		spyOn(sessionStorage, 'setItem')
	// 	})
	// 	it('calls sessionStorage a full cart', function() {
	// 		cartModule.addItem("ladder")
	// 		cartModule.cookify();
	// 		expect(sessionStorage.setItem).toHaveBeenCalledWith("cart", JSON.stringify([{name:"ladder", price:1000}]))
	// 	})
	// 	it('does nothing on an empty cart', function() {
	// 		cartModule.cookify();
	// 		expect(sessionStorage.setItem).not.toHaveBeenCalled()
	// 	})
	// })
	// describe("when valid is called", function() {
	// 	it('returns true on a full cart', function() {
	// 		cartModule.addItem("ladder")
	// 		expect(cartModule.valid()).toEqual(true)
	// 	})
	// 	it('returns false on an empty cart', function() {
	// 		expect(cartModule.valid()).toEqual(false)
	// 	})
	// })

	describe('when .add_on is clicked 1st time', function() {
		beforeEach(function() {
			loadFixtures('cartModule.html')
			spyOn(cartModule,'addItem')
			spyOn(cartModule,'removeItem')
		})
		it ('triggers cartModule.addItem', function() {
			expect(cartModule.addItem).toHaveBeenCalledWith("ladder")
		})
		// it ('does not trigger cartModule.removeItem', function() {
		// 	expect(cartModule.removeItem).not.toHaveBeenCalled()
		// })
		// describe('when .add_on is clicked 2nd time', function() {
		// 	beforeEach(function() {
		// 		$("input.add_on[data-name='ladder'][type='checkbox']").click()
		// 	})
		// 	it ('triggers cartModule.removeItem', function() {
		// 		expect(cartModule.removeItem).toHaveBeenCalledWith("ladder")
		// 	})
		// 	it ('does not trigger cartModule.addItem', function() {
		// 		expect(cartModule.addItem).not.toHaveBeenCalled()
		// 	})
		// })
	})

});