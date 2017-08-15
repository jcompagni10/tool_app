class CreateReservations < ActiveRecord::Migration[5.2]
  def change
    create_table :reservations do |t|
      t.string :email
      t.boolean :tos
      t.date :start_date
      t.boolean :ladder
      t.boolean :light
      t.string :stripe
      t.string :address
      t.string :instructions
      t.integer :delivery_time

      t.timestamps
    end
  end
end
