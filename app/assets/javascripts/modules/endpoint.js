class Endpoint {
  constructor(type, start_value) {
    var end_date, end_time, suffix; 

    this.type = type // date or time
    if (start_value == null || start_value == "") {
      this.end_value = null
    } else {
      if (type == "date") {
        end_date = new Date(start_value);;
        end_date.setDate(end_date.getDate()+3);
        this.end_value = end_date
      } else if (type == "time"){
        end_time = 1 + parseInt(start_value);
        suffix = (end_time < 12 )? "am" : "pm";
        this.end_value = (end_time > 12 ? end_time - 12 : end_time) + ":00"+suffix;    
      }
    }
    this.constructor.prefill(type, this.end_value);
  }

  static prefill(type, end_value) {
    var end_field, end_text;

    if (type === "date")  {
      end_field = $("#end_date") 
      end_text = (end_value == "" || end_value == null) ? "3 days later" : dateTimeFxns.formatDateTime("date", end_value)
    } else {
      end_field = $("#delivery_end_time")
      end_text = (end_value == "" || end_value == null) ? "1 hour later" : end_value
    }
    end_field.val(end_text)
    end_field.trigger("change")
  }
}