require 'rails_helper'

RSpec.describe ReservationsController, type: :controller do
  it "prevents day of reservation after 9pm" do
    testTime = Time.now
    testTime= testTime.change(hour: 21)
    allow(Time).to receive(:now) { testTime }  
    get :getReservedDates
    dates = JSON.parse response.body
    expect(dates.include?(Date.today.strftime("%d-%m-%Y"))).to be true
  end
end
