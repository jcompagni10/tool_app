// julian: helper function for returning deferred promises
function ajax_response(resp) {
  var deferred = $.Deferred().resolve(resp);
  return deferred.promise();
}

describe("date and time functions", function(){
  describe("get reserved dates", function(){
    describe("ajax call", function(){
      beforeEach(function(){
        spyOn($, "ajax").and.returnValue(ajax_response());
        dateTimeFxns.getReservedDates();
      });
      it("should make a get request to the right url", function(){
        expect($.ajax.calls.argsFor(0)[0].url).toEqual("/getReservedDates");
        expect($.ajax.calls.argsFor(0)[0].method.toUpperCase()).toEqual("GET");
      });
    });
    describe("ajax call with successs",function(){
      let returnedDates, testDates;
      beforeEach(function(done){
        affix("#start_date");
        testDates = [new Date(1,1,2018), new Date(1,2,2018)];
        spyOn($, "ajax").and.returnValue(ajax_response(testDates));
        dateTimeFxns.getReservedDates().then((function(dates){
          returnedDates = dates;
          done();
        }));
      });
      it ("should mount the datepicker", function(){
        expect($("#start_date")).toHaveClass("hasDatepicker");
      });
      it ("should pass through reserved dates", function(){
        expect(returnedDates).toEqual(testDates);
      });
    });
    describe("ajax call with failure", function(){
      // not sure what the expected result that we would test here is
    });
  });
  describe("disableSpecificDates", function(){
    const date1 = new Date(1,1,2018);
    const date2 =  new Date(1,2,2018);
    beforeEach(function(){
      // map dates to integer format
      const testDates = [date1, date2]
        .map(date => (jQuery.datepicker.formatDate('@', date)));
      dateTimeFxns.reserved_dates = testDates;
    });
    it("should return should return true for non-reserved dates", function(){
      const date3 = new Date(1,3,2020);
      expect(dateTimeFxns.disableSpecificDates(date3)).toEqual([true]);
    });
    it("should return should return false for reserved dates", function(){
      expect(dateTimeFxns.disableSpecificDates(date2)).toEqual([false]);
    });
  }); 
});
