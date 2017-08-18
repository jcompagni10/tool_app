class Reservation < ApplicationRecord
    before_save :default_values
    def default_values
        self.start_date ||= Date.today
    end
    
    validates :stripe, presence: true
    validates :email, presence: true
    validates :tos, presence: true

   # validates :start_date, presence: true

end
