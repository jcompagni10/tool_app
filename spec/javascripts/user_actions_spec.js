// see notes in actual JS file, we CANNOT test that document.ready will actually call the pageActions, but at some point we just have eto assume we can write that one line right
describe("user actions", function() {
	describe("changing toggle item", function() {
		beforeEach(function() {
			affix("input.toggle_item[data-name='ladder'][type='checkbox']");
			mountUserActions();
		})

		describe("to true", function() {
			beforeEach(function() {
				// need to force truthy return value so that second half of '&&' statement gets evaluated and isUnique gets called
				// we can safely assume that isValid works because it gets tested in class_spec
				spyOn(Item, "isValid").and.returnValue(true);
				spyOn(cartModule, "isUnique");
				// more realistic simulation of changing to true
				$(".toggle_item").click();
			});
			it("checks if it's valid and if it's unique before calling toggleItem", function() {
				expect(Item.isValid).toHaveBeenCalledWith("ladder");
				expect(cartModule.isUnique).toHaveBeenCalledWith("ladder");
			});
		});
		describe("to false", function() {
			beforeEach(function() {
				spyOn(Item, "isValid").and.returnValue(true);
				spyOn(cartModule, "isUnique");
				// we can change the prop to true initially without triggering function 
				$(".toggle_item").prop("checked", true);
				$(".toggle_item").click();
			});
			it("checks if it's valid and if it's unique before calling toggleItem", function() {
				expect(Item.isValid).toHaveBeenCalledWith("ladder");
				expect(cartModule.isUnique).toHaveBeenCalledWith("ladder");
			});
		});
	});
});