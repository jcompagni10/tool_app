class CreateReservedDates < ActiveRecord::Migration[5.1]
  def change
    create_table :reserved_dates do |t|
      t.string :res_date
      t.string :date

      t.timestamps
    end
  end
end
