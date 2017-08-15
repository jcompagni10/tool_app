class Reservation < ApplicationRecord
    validates :stripe, presence: true
    validates :email, presence: true
    validates :tos, presence: true
end
