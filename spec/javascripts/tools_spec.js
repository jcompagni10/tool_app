describe ('cartModule', function(){
	beforeEach(function() {
		spyOn($, "ajax").and.callFake( (e) => e.success({}) )
	})
	describe ('without sessionStorage',function(){
  	describe ('with invalid default_item',function(){
    	it ('initializes empty cart',function(){
    		cartModule.initialize("random");
    		expect(cartModule.getItems).toBe([]);
			});
		});
		describe ('with no default_item',function(){
    	it ('initializes empty cart',function(){
    		cartModule.initialize("random");
    		expect(cartModule.getItems).toBe([]);
			}); 
		}); 
		describe ('with valid default_item',function(){
    	it ('initializes cart with default_item',function(){
    		cartModule.initialize("toolkit");
    		expect(cartModule.getItems).toBe([{name:"toolkit", price:1500}]);
			}) 
		}) 
	})
});