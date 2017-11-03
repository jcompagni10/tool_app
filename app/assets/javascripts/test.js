class Endpoint {
	constructor(name, value) {
		this.name = name // could be "date" or "time"
		this.value = value 
	}

	calculate() {
		if (this.name == "date") {
			// calculate endDate from startDate
			return // some end date
		} else {
			// calculate endTime from startTime
			return // some end time
		}
		
	}
}

$(".logistics_field").on("change", function() {
	name = $(this).data("name")
	// value = value
	logisticsModule.setData(name, value)

	if (name.indexOf("start") > -1) {
		endpoint = new Endpoint(name.indexOf("date") > -1 ? "date" : "time", value)
		end_value = endpoint.calculate() 
		end_name = name.replace("start", "end")
		logisticsModule.setData(end_name, end_value)
		elementVisAndNav.setEndText(end_name, end_value)
	}

})