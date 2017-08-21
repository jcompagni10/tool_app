class Reservation < ApplicationRecord
    attr_accessor :reserve_ahead

    validates :start_date, :presence => {:message => "Rental Date Required"}
    validates :stripe, :presence => {:message => "Credit Card Info Required"}
    validates :email, :presence => {:message => "Email Address Required"}
    validates :tos, :presence => {:message => "You Must Agree To 'Terms of Service'"}
    validates_format_of :email, {:with => /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\z/i, :message => "Invalid Email Format"}
    
    #require address if delivery
    validates :address, :presence => {if: :delivery_time, :message =>"Delivery Address Required"}

end
