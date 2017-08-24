class Reservation < ApplicationRecord
 
    validates :start_date, :presence => {:message => "Rental Date Required"}
    validate :date_valid
    validates :stripe, :presence => {:message => "Credit Card Info Required"}
    validates :email, :presence => {:message => "Email Address Required"}
    validates_format_of :email, {:with => /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\z/i, :message => "Invalid Email Format"}    
    validates :tos, acceptance: { message: 'You must Accept Terms of Service' },
                    :presence => { message: 'You must Accept Terms of Service' }   
    #require address if delivery
    validates :address, :presence => {if: :delivery_time, :message =>"Delivery Address Required"}

    private 

        def date_valid
            if !!start_date
                if !Reservation.where(:start_date => ((start_date-3.day)..(start_date+3.days))).blank?
                    errors.add(:start_date, "Rental Date Conflicts With Existing Reservation.")
                end
                if start_date < Date.today
                    errors.add(:start_date, "Rental Date Cannot Be In The Past")
                end
            end
        end
end

