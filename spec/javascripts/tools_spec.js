describe("Item class", function() {
	describe("when constructor is called", function() {
		it("should auto-set price", function() {
			item = new Item("toolkit")
			expect(item.price).toEqual(itemPriceModule()["toolkit"])
		})
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

describe ("storageClass", function() {
	describe("when prototype.save is called", function() {
		describe("with sessionStorage", function() {
			it("should save", function() {
				Storage.save("sessionStorage", "test", "test")
				expect(JSON.parse(sessionStorage.getItem("test"))).toEqual("test")
			})
		})
	})
})

describe ('cartModule', function(){
	// do NOT need ot test getItems or clear because these are used in the actual tests here and things wouldn't be passing if they were failing

	beforeEach(function() {
		cartModule.clear();
		affix("input.toggle_item[data-name='ladder'][type='checkbox']");
    affix("input.toggle_item[data-name='random'][type='checkbox']");
	})
	describe ('without sessionStorage',function(){
		beforeEach(function() {
			var storedCart = [];

		  spyOn(JSON, 'parse').and.callFake(function () {
		    return storedCart;
		  });

		  spyOn(cartModule, "toggleItem").and.callThrough()
		})
  	describe ('with invalid default_item',function(){
    	it ('initializes empty cart',function(){
    		cartModule.initialize("random");
    		expect(cartModule.getItems()).toEqual([]);
    		expect(cartModule.toggleItem).not.toHaveBeenCalled()
    		expect($(".toggle_item[data-name='random']").prop("checked")).toEqual(false)
			});
		});
		describe ('with no default_item',function(){
    	it ('initializes empty cart',function(){
    		cartModule.initialize("random");
    		expect(cartModule.getItems()).toEqual([]);
    		expect(cartModule.toggleItem).not.toHaveBeenCalled()
    		expect($(".toggle_item[data-name='random']").prop("checked")).toEqual(false)
			}); 
		}); 
		describe ('with valid default_item',function(){
    	it ('initializes cart with default_item',function(){
    		cartModule.initialize("toolkit");
    		expect(cartModule.getItems()).toEqual(["toolkit"]);
    		expect(cartModule.toggleItem).toHaveBeenCalledWith("toolkit", true)
    		expect($(".toggle_item[data-name='random']").prop("checked")).toEqual(false)
			}) 
		}) 
	});
	describe ('with sessionStorage',function(){
		beforeEach(function() {
		  spyOn(JSON, 'parse').and.callFake(function () {
		    return [new Item("ladder")]
		  });

		  spyOn(cartModule, "toggleItem").and.callThrough()
		})
  	describe ('with invalid default_item',function(){
    	it ('initializes cart with stored item',function(){
    		cartModule.initialize("random");
    		expect(cartModule.getItems()).toEqual(["ladder"]);
    		expect(cartModule.toggleItem).not.toHaveBeenCalled()
    		expect($(".toggle_item[data-name='ladder']").prop("checked")).toEqual(true)
    		expect($(".toggle_item[data-name='random']").prop("checked")).toEqual(false)
			});
		});
		describe ('with no default_item',function(){
    	it ('initializes cart with stored item',function(){
    		cartModule.initialize("random");
    		expect(cartModule.getItems()).toEqual(["ladder"]);
    		expect(cartModule.toggleItem).not.toHaveBeenCalled()
    		expect($(".toggle_item[data-name='ladder']").prop("checked")).toEqual(true)
    		expect($(".toggle_item[data-name='random']").prop("checked")).toEqual(false)
			}); 
		}); 
		describe ('with valid default_item',function(){
    	it ('initializes cart with stored item',function(){
    		cartModule.initialize("toolkit");
    		expect(cartModule.getItems()).toEqual(["ladder"]);
    		expect(cartModule.toggleItem).not.toHaveBeenCalled()
    		expect($(".toggle_item[data-name='ladder']").prop("checked")).toEqual(true)
    		expect($(".toggle_item[data-name='random']").prop("checked")).toEqual(false)
			}) 
		}) 
	})

	describe('when toggleItem is called to add', function() {
		beforeEach(function() {
			spyOn(elementVisAndNav, 'deliverySection')
		})
		describe("for regular item that exists", function() {
			beforeEach(function() {
				cartModule.toggleItem("ladder", true)
				cartModule.toggleItem("ladder", true)
			})
			it ('adds item', function() {
				expect(cartModule.getItems()).toEqual(["ladder"]);
			})
			it ("doesn't change delivery visibility", function() {
				expect(elementVisAndNav.deliverySection).not.toHaveBeenCalled()
			}) 
		})
		describe("for regular item that doesn't exist", function() {
			beforeEach(function() {
				cartModule.toggleItem("ladder", true)
			})
			it ('adds item', function() {
				expect(cartModule.getItems()).toEqual(["ladder"]);
			})
			it ("doesn't change delivery visibility", function() {
				expect(elementVisAndNav.deliverySection).not.toHaveBeenCalled()
			}) 
		})
		describe("for delivery", function() {
			beforeEach(function() {
				cartModule.toggleItem("delivery", true)
			})
			it ('adds item', function() {
				expect(cartModule.getItems()).toEqual(["delivery"]);
			})
			it ("does change delivery visibility", function() {
				expect(elementVisAndNav.deliverySection).toHaveBeenCalledWith(true)
			}) 
		})
	})
	describe('when toggleItem is called to remove', function() {
		beforeEach(function() {
			spyOn(elementVisAndNav, 'deliverySection')
		})
		describe("for regular item that exists", function() {
			beforeEach(function() {
				cartModule.toggleItem("ladder", true)
				cartModule.toggleItem("ladder", false)
			})
			it ('removes item', function() {
				expect(cartModule.getItems()).toEqual([]);
			})
			it ("doesn't change delivery visibility", function() {
				expect(elementVisAndNav.deliverySection).not.toHaveBeenCalled()
			}) 
		})
		describe("for regular item that doesn't exist", function() {
			beforeEach(function() {
				cartModule.toggleItem("ladder", false)
			})
			it ("doesn't throw an error", function() {
				// this isn't a good test, i need to test that cartModule.removeItem("ladder") doesn't like... explode, but not sure how
				expect(cartModule.getItems()).toEqual([]);
			})
			it ("doesn't change delivery visibility", function() {
				expect(elementVisAndNav.deliverySection).not.toHaveBeenCalled()
			}) 
		})
		describe("for delivery", function() {
			beforeEach(function() {
				cartModule.toggleItem("delivery", true)
				cartModule.toggleItem("delivery", false)
			})
			it ('removes item', function() {
				expect(cartModule.getItems()).toEqual([]);
			})
			it ("does change delivery visibility", function() {
				expect(elementVisAndNav.deliverySection).toHaveBeenCalledWith(true)
				expect(elementVisAndNav.deliverySection).toHaveBeenCalledWith(false)
			}) 
		})
	})

	describe('when getTotal is called', function() {
		it('adds appropriately on a full cart', function() {
			cartModule.toggleItem("ladder", true)
			cartModule.toggleItem("light", true)
			expect(cartModule.getTotal()).toEqual(2000)
		})
		it('returns 0 on an empty cart', function() {
			expect(cartModule.getTotal()).toEqual(0)
		})
	})
	describe("when save is called", function(){
		beforeEach(function() {
			spyOn(Storage, "save")
		})
		it('constructs Storage a full cart', function() {
			cartModule.toggleItem("ladder", true)
			cartModule.save();
			expect(Storage.save).toHaveBeenCalledWith("sessionStorage", "cart", [new Item("ladder")])
		})
		it('does nothing on an empty cart', function() {
			cartModule.save();
			expect(Storage.save).not.toHaveBeenCalled()
		})
	})
	describe("when isValid is called", function() {
		it('returns true on a full cart', function() {
			cartModule.toggleItem("ladder", true)
			expect(cartModule.isValid()).toEqual(true)
		})
		it('returns false on an empty cart', function() {
			expect(cartModule.isValid()).toEqual(false)
		})
	})

	// jasmine-jquery was not working in terms of trying to get the fixturse to load... 
	describe('when .toggle_item is clicked 1st time', function() {
		beforeEach(function() {
			spyOn(cartModule,'toggleItem')
			$('<input class="toggle_item" data-name="ladder" type="checkbox" />').appendTo('body');

			$(".toggle_item[data-name='ladder']").trigger("change")
		})
		it ('triggers cartModule.toggleItem with true', function() {
			expect(cartModule.toggle).toHaveBeenCalledWith("ladder", true)
		})
		// describe('when .toggle_item is clicked 2nd time', function() {
		// 	beforeEach(function() {
		// 		$("input.toggle_item[data-name='ladder'][type='checkbox']").click()
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