require 'faker'

FactoryGirl.define do
    factory :reservation do |f|
      f.start_date Faker::Date.forward
      f.email Faker::Internet.email
      f.stripe "12312312321"
      f.tos true
      f.delivery_start_time 10
      f.phone Faker::PhoneNumber.phone_number
      f.address Faker::Address.street_address
    end
  end