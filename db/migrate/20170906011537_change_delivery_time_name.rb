class ChangeDeliveryTimeName < ActiveRecord::Migration[5.1]
  def change
  	rename_column :reservations, :delivery_time, :delivery_start_time
  end
end
