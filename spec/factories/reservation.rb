require 'faker'

FactoryGirl.define do
    factory :reservation do |f|
      f.start_date Faker::Date.forward
      f.email Faker::Internet.email
      f.stripe "12312312321"
      f.tos true
    end
  end