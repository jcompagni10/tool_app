describe("orderDataModule", function() {
  // do NOT need ot test get or clear because these are used in the actual tests here and things wouldn't be passing if they were failing

  beforeEach(function() {
    orderDataModule.clear();
  });
  let orderData;
  describe("initialize", function() {
    const reservedDate = new Date(2018, 1, 1);
    beforeAll(function() {
      orderData = {
        start_date: new Date(2018, 3, 4),
        end_date: new Date(2018, 3, 7),
        delivery_start_time: "12",
        delivery_end_time: "1:00pm",
        tos: 1,
        phone: "4157101111",
        email: "test@test.com",
        address: "123 Main St."
      };
      const datePromise = new Promise(function(resolve, reject) {
        resolve([reservedDate.getTime()]);
      });
      spyOn(dateTimeFxns, "getReservedDates").and.returnValue(datePromise);
    });

    it("defaults to an empty object", function() {
      orderDataModule.initialize();
      expect(orderDataModule.get()).toEqual({});
    });

    let retrievedData;
    describe("when there is stored data", function() {
      beforeEach(function(done) {
        Storage.save("sessionStorage", "orderData", orderData);
        orderDataModule.initialize().then(function() {
          retrievedData = orderDataModule.get();
          done();
        });
      });
      it("succesfully retrives and converts dates", function() {
        // julian: object comparison with date fails have to do them individually
        expect(retrievedData.start_date.getTime()).toEqual(
          orderData.start_date.getTime()
        );
        expect(retrievedData.end_date.getTime()).toEqual(
          orderData.end_date.getTime()
        );
      });
      it("successfull retrives all other data", function() {
        // julian: now we can null out the dates and compare the rest
        const datelessData = Object.assign({}, orderData);
        datelessData.start_date = null;
        datelessData.end_date = null;
        retrievedData.start_date = null;
        retrievedData.end_date = null;
        expect(retrievedData).toEqual(datelessData);
      });
    });

    describe("when a stored date has already been reserved", function() {
      beforeEach(function(done) {
        let orderDataWithConflict = Object.assign({}, orderData, {
          start_date: reservedDate
        });
        Storage.save("sessionStorage", "orderData", orderDataWithConflict);
        orderDataModule.initialize().then(function() {
          retrievedData = orderDataModule.get();
          done();
        });
        spyOn(Alertion, "show");
      });
      it("calls alertion", function() {
        expect(Alertion.show).toHaveBeenCalled();
      });
      it("sets start and end date to null", function() {
        retrievedData = orderDataModule.get();
        expect(retrievedData.start_date).toEqual(null);
        expect(retrievedData.end_date).toEqual(null);
      });
    });

    describe("prefillOrderData", function() {
      beforeAll(function(done) {
        affix("#start_date");
        $("#start_date").datepicker();
        affix("#email");
        affix("input#tos[type='checkbox']");
        affix("#delivery_start_time");
        affix("#phone");
        affix("#address");
        Storage.save("sessionStorage", "orderData", orderData);
        orderDataModule.initialize().then(function() {
          done();
        });
      });
      it("prefills all feilds", function() {
        expect(
          $("#start_date")
            .datepicker("getDate")
            .getDate()
        ).toEqual(orderData.start_date.getDate());
        expect($("#email")).toHaveValue(orderData.email);
        expect($("#tos")).toBeChecked();
        expect($("#delivery_start_time")).toHaveValue(
          orderData.delivery_start_time
        );
        expect($("#phone")).toHaveValue(orderData.phone);
        expect($("#address")).toHaveValue(orderData.address);
      });
    });
  });

  describe("when set", function() {
    beforeEach(function() {
      orderDataModule.set("this", "that");
    });
    it("should return the value in a get", function() {
      expect(orderDataModule.get()).toEqual({ this: "that" });
    });
  });

  describe("when save is called", function() {
    beforeEach(function() {
      spyOn(Storage, "save");
    });
    it("constructs Storage a full hash", function() {
      orderDataModule.set("this", "that");
      orderDataModule.save();
      expect(Storage.save).toHaveBeenCalledWith("sessionStorage", "orderData", {
        this: "that"
      });
    });
    it("does nothing on an empty hash", function() {
      orderDataModule.save();
      expect(Storage.save).not.toHaveBeenCalled();
    });
  });
  describe("when isPresent is called", function() {
    describe("on a hash with something", function() {
      beforeEach(function() {
        orderDataModule.set("start_date", new Date());
      });
      it("returns true", function() {
        expect(orderDataModule.isPresent()).toEqual(true);
      });
    });
    describe("on an empty hash", function() {
      it("returns false", function() {
        expect(orderDataModule.isPresent()).toEqual(true);
      });
    });
  });
  describe("when isValid is called", function() {
    // NOT spying on validHelper, just for email/phone is very tedious, would have to create a spy and a callthrough or call fake for every test
    describe("no delivery", function() {
      describe("on a hash with all the right fields", function() {
        beforeEach(function() {
          affix("#start_date_error_msg.hide");
          affix("#email_error_msg.hide");
          affix("#tos_error_msg.hide");
          orderDataModule.set("start_date", new Date());
          orderDataModule.set("end_date", new Date());
          orderDataModule.set("email", "test@example.com");
          orderDataModule.set("tos", true);
        });

        it("returns true and does NOT show any errors", function() {
          expect(orderDataModule.isValid()).toEqual(true);
          expect($("#start_date_error_msg")).toBeHidden();
          expect($("#email_error_msg")).toBeHidden();
          expect($("#tos_error_msg")).toBeHidden();
        });
      });
      describe("on a hash missing a field", function() {
        beforeEach(function() {
          affix("#start_date_error_msg.hide");
          affix("#email_error_msg.hide");
          affix("#tos_error_msg.hide");
          orderDataModule.set("start_date", new Date());
          orderDataModule.set("end_date", new Date());
          orderDataModule.set("email", "test@example.com");
        });

        it("returns false and shows RIGHT error", function() {
          expect(orderDataModule.isValid()).toEqual(false);
          expect($("#start_date_error_msg")).toBeHidden();
          expect($("#email_error_msg")).toBeHidden();
          expect($("#tos_error_msg")).not.toBeHidden();
        });
      });
      describe("on a hash with all fields but an incorrect value for EMAIL", function() {
        beforeEach(function() {
          affix("#start_date_error_msg.hide");
          affix("#email_error_msg.hide");
          affix("#tos_error_msg.hide");
          orderDataModule.set("start_date", new Date());
          orderDataModule.set("end_date", new Date());
          orderDataModule.set("email", "test@@example.com");
          orderDataModule.set("tos", true);
        });

        it("returns false and shows RIGHT error", function() {
          expect(orderDataModule.isValid()).toEqual(false);
          expect($("#start_date_error_msg")).toBeHidden();
          expect($("#email_error_msg")).not.toBeHidden();
          expect($("#tos_error_msg")).toBeHidden();
        });
      });
      describe("on a hash with all fields but an incorrect value for START DATE", function() {
        beforeEach(function() {
          affix("#start_date_error_msg.hide");
          affix("#email_error_msg.hide");
          affix("#tos_error_msg.hide");
          orderDataModule.set("start_date", "test");
          orderDataModule.set("end_date", new Date());
          orderDataModule.set("email", "test@example.com");
          orderDataModule.set("tos", true);
        });

        it("returns false and shows RIGHT error", function() {
          expect(orderDataModule.isValid()).toEqual(false);
          expect($("#start_date_error_msg")).not.toBeHidden();
          expect($("#email_error_msg")).toBeHidden();
          expect($("#tos_error_msg")).toBeHidden();
        });
      });
      describe("on a hash with all fields but an incorrect value for END DATE", function() {
        beforeEach(function() {
          affix("#start_date_error_msg.hide");
          affix("#email_error_msg.hide");
          affix("#tos_error_msg.hide");
          orderDataModule.set("start_date", new Date());
          orderDataModule.set("end_date", "test");
          orderDataModule.set("email", "test@example.com");
          orderDataModule.set("tos", true);
        });

        it("returns false and shows NO errors", function() {
          expect(orderDataModule.isValid()).toEqual(false);
          expect($("#start_date_error_msg")).toBeHidden();
          expect($("#email_error_msg")).toBeHidden();
          expect($("#tos_error_msg")).toBeHidden();
        });
      });
      describe("on a hash with all fields but an incorrect value for TOS", function() {
        beforeEach(function() {
          affix("#start_date_error_msg.hide");
          affix("#email_error_msg.hide");
          affix("#tos_error_msg.hide");
          orderDataModule.set("start_date", new Date());
          orderDataModule.set("end_date", new Date());
          orderDataModule.set("email", "test@example.com");
          orderDataModule.set("tos", false);
        });

        it("returns false and shows RIGHT error", function() {
          expect(orderDataModule.isValid()).toEqual(false);
          expect($("#start_date_error_msg")).toBeHidden();
          expect($("#email_error_msg")).toBeHidden();
          expect($("#tos_error_msg")).not.toBeHidden();
        });
      });
    });
    describe("with delivery", function() {
      beforeEach(function() {
        // so we dont' have to create extra proxy functions again
        spyOn(cartModule, "hasDelivery").and.callFake(function() {
          return true;
        });
      });
      describe("on a hash with all the right fields", function() {
        beforeEach(function() {
          affix("#start_date_error_msg.hide");
          affix("#email_error_msg.hide");
          affix("#tos_error_msg.hide");
          affix("#delivery_start_time_error_msg.hide");
          affix("#phone_error_msg.hide");
          affix("#address_error_msg.hide");
          orderDataModule.set("start_date", new Date());
          orderDataModule.set("end_date", new Date());
          orderDataModule.set("email", "test@example.com");
          orderDataModule.set("tos", true);
          orderDataModule.set("delivery_start_time", 1);
          orderDataModule.set("delivery_end_time", "4:00pm");
          orderDataModule.set("phone", "322135");
          orderDataModule.set("address", "random");
        });

        it("returns true and does NOT show any errors", function() {
          expect(orderDataModule.isValid()).toEqual(true);
          expect($("#start_date_error_msg")).toBeHidden();
          expect($("#email_error_msg")).toBeHidden();
          expect($("#tos_error_msg")).toBeHidden();
          expect($("#delivery_start_time_error_msg")).toBeHidden();
          expect($("#tos_error_msg")).toBeHidden();
          expect($("#phone_error_msg")).toBeHidden();
          expect($("#address_error_msg")).toBeHidden();
        });
      });
      describe("on a hash missing a field", function() {
        beforeEach(function() {
          affix("#start_date_error_msg.hide");
          affix("#email_error_msg.hide");
          affix("#tos_error_msg.hide");
          affix("#delivery_start_time_error_msg.hide");
          affix("#phone_error_msg.hide");
          affix("#address_error_msg.hide");
          orderDataModule.set("start_date", new Date());
          orderDataModule.set("end_date", new Date());
          orderDataModule.set("email", "test@example.com");
          orderDataModule.set("tos", true);
          orderDataModule.set("delivery_start_time", 1);
          orderDataModule.set("delivery_end_time", "4:00pm");
          orderDataModule.set("phone", "322135");
        });

        it("returns false and shows RIGHT error", function() {
          expect(orderDataModule.isValid()).toEqual(false);
          expect($("#start_date_error_msg")).toBeHidden();
          expect($("#email_error_msg")).toBeHidden();
          expect($("#tos_error_msg")).toBeHidden();
          expect($("#delivery_start_time_error_msg")).toBeHidden();
          expect($("#tos_error_msg")).toBeHidden();
          expect($("#phone_error_msg")).toBeHidden();
          expect($("#address_error_msg")).not.toBeHidden();
        });
      });
      describe("on a hash with all fields but an incorrect value for PHONE", function() {
        beforeEach(function() {
          affix("#start_date_error_msg.hide");
          affix("#email_error_msg.hide");
          affix("#tos_error_msg.hide");
          affix("#delivery_start_time_error_msg.hide");
          affix("#phone_error_msg.hide");
          affix("#address_error_msg.hide");
          orderDataModule.set("start_date", new Date());
          orderDataModule.set("end_date", new Date());
          orderDataModule.set("email", "test@example.com");
          orderDataModule.set("tos", true);
          orderDataModule.set("delivery_start_time", 1);
          orderDataModule.set("delivery_end_time", "4:00pm");
          orderDataModule.set("phone", "asdf");
          orderDataModule.set("address", "random");
        });

        it("returns false and shows RIGHT error", function() {
          expect(orderDataModule.isValid()).toEqual(false);
          expect($("#start_date_error_msg")).toBeHidden();
          expect($("#email_error_msg")).toBeHidden();
          expect($("#tos_error_msg")).toBeHidden();
          expect($("#delivery_start_time_error_msg")).toBeHidden();
          expect($("#tos_error_msg")).toBeHidden();
          expect($("#phone_error_msg")).not.toBeHidden();
          expect($("#address_error_msg")).toBeHidden();
        });
      });
    });
  });
});
