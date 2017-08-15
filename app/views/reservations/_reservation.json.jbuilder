json.extract! reservation, :id, :email, :tos, :start_date, :ladder, :light, :stripe, :address, :instructions, :delivery_time, :created_at, :updated_at
json.url reservation_url(reservation, format: :json)
