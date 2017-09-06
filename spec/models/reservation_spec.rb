require 'rails_helper'

describe Reservation do
  it "has a valid factory" do
   expect(FactoryGirl.build(:reservation)).to be_valid
  end

  it "is invalid without terms of service" do
    expect(FactoryGirl.build(:reservation, tos:nil)).not_to be_valid
  end

  it "is invalid without start date" do
    expect(FactoryGirl.build(:reservation, start_date:nil)).not_to be_valid
  end

  it "is invalid without stripe" do
    expect(FactoryGirl.build(:reservation, stripe:nil)).not_to be_valid
  end

  it "is invalid without terms of service" do
    expect(FactoryGirl.build(:reservation, tos:nil)).not_to be_valid
  end

  it "is valid without address if delivery is not selected" do
    expect(FactoryGirl.build(:reservation, delivery_start_time:nil, address:nil)).to be_valid
  end

  it "is valid without phone if delivery is not selected" do
    expect(FactoryGirl.build(:reservation, delivery_start_time:nil, phone:nil)).to be_valid
  end

  it "is invalid without address if delivery selected" do
    expect(FactoryGirl.build(:reservation, address:nil)).not_to be_valid
  end

  it "is invalid without phone if delivery selected" do
    expect(FactoryGirl.build(:reservation, phone:nil)).not_to be_valid
  end

  it "invalidates multiple reservations on the same day" do
    FactoryGirl.create(:reservation, start_date:Date.today)
    expect(FactoryGirl.build(:reservation, start_date:Date.today)).not_to be_valid
  end

  it "invalidates reservation conflicts" do
    FactoryGirl.create(:reservation, start_date:Date.today+3.days)
    expect(FactoryGirl.build(:reservation, start_date:Date.today)).not_to be_valid
    expect(FactoryGirl.build(:reservation, start_date:Date.today+3.days)).not_to be_valid
  end

  it "validates reservations 4 days after existing reservation" do
    FactoryGirl.create(:reservation, start_date:Date.today)
    expect(FactoryGirl.build(:reservation, start_date:Date.today+4.days)).to be_valid  
  end

  it "invalidates reservations in the past " do
    expect(FactoryGirl.build(:reservation, start_date:Date.today-1.days)).not_to be_valid
  end      
end
