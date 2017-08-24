describe("date display", function(){
 it("gets dates via ajax", function(){
    reserved_dates = [];
    getReservedDates();
    expect(reserved_dates.length > 1).toBe("true") 
 })
})